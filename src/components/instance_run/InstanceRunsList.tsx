import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { format, intervalToDuration } from 'date-fns';
import { Link, useSearchParams } from 'react-router';
import type { Query } from '@/__generated__/graphql';
import { Archetype } from '@/__generated__/graphql';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getInstanceRunsFilters } from '@/components/instance_run/InstanceRunsFilters';
import { QueryPagination } from '@/components/global/QueryPagination';
import clsx from 'clsx';
import { formatApiDuration } from '@/utils';
import {
  getInstanceRunFamily,
  isLostValeComplete,
  INSTANCE_RUN_FAMILIES,
} from '@/components/instance_run/instanceRunFamilies';

const INSTANCE_RUNS = gql`
  query GetInstanceRuns(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: InstanceRunFilterInput
  ) {
    instanceRuns(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
      order: { start: DESC }
    ) {
      nodes {
        id
        instanceId
        start
        end
        completed
        instance {
          id
          name
          encounters {
            id
          }
        }
        scoreboardEntries {
          character {
            id
          }
          itemRating
          deaths
          archetype
          damage
          healing
        }
        encounters {
          id
          encounterId
          completed
          start
          end
          encounter {
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
      totalCount
      medianDuration
      averageDeaths
    }
  }
`;

type InstanceRunNode = NonNullable<
  NonNullable<Query['instanceRuns']>['nodes']
>[number];

// Some dungeon wings are spaced well beyond fifteen minutes, especially when
// the first instance record contains the early Bastion Stair encounters.
const INSTANCE_FAMILY_SEGMENT_GAP_MS = 60 * 60 * 1000;

const formatCompactDuration = (
  duration: ReturnType<typeof intervalToDuration>,
): string => {
  const units = [
    [duration.days, 'd'],
    [duration.hours, 'h'],
    [duration.minutes, 'm'],
    [duration.seconds, 's'],
  ] as const;
  const parts = units.flatMap(([value, label]) =>
    value != null && value > 0 ? [`${value}${label}`] : [],
  );

  return parts.join(' ') || '0s';
};
type InstanceRunFamily = (typeof INSTANCE_RUN_FAMILIES)[number];

type InstanceRunGroup = {
  key: string;
  family?: InstanceRunFamily;
  run: InstanceRunNode;
  segments: InstanceRunNode[];
};

const belongsToSameParty = (left: string[], right: string[]) => {
  const rightIds = new Set(right);
  const sharedCount = left.filter((characterId) =>
    rightIds.has(characterId),
  ).length;
  const smallerRosterSize = Math.min(left.length, right.length);
  const largerRosterSize = Math.max(left.length, right.length);

  // Ignore single-character partial records; require substantial overlap on both sides.
  return (
    sharedCount >= 3 &&
    sharedCount / smallerRosterSize >= 0.75 &&
    sharedCount / largerRosterSize >= 0.5
  );
};

/** Join same-party records for sections that form one larger dungeon. */
const groupInstanceRuns = (runs: InstanceRunNode[]): InstanceRunGroup[] => {
  const combined: InstanceRunGroup[] = [];

  for (const run of [...runs].sort(
    (left, right) =>
      new Date(left.start).getTime() - new Date(right.start).getTime(),
  )) {
    const family = getInstanceRunFamily(run.instanceId);
    const roster = run.scoreboardEntries
      .map((entry) => entry.character.id)
      .sort();
    const runStart = new Date(run.start).getTime();
    const matchingGroup = family
      ? [...combined].reverse().find((group) => {
          if (group.family?.key !== family.key) return false;
          const groupEnd = Math.max(
            ...group.segments.map((segment) => new Date(segment.end).getTime()),
          );
          const sharesParty = group.segments.some((segment) =>
            belongsToSameParty(
              roster,
              segment.scoreboardEntries.map((entry) => entry.character.id),
            ),
          );
          return (
            sharesParty &&
            runStart >=
              Math.min(
                ...group.segments.map((segment) =>
                  new Date(segment.start).getTime(),
                ),
              ) &&
            runStart - groupEnd <= INSTANCE_FAMILY_SEGMENT_GAP_MS
          );
        })
      : undefined;

    if (matchingGroup) {
      matchingGroup.segments.push(run);
      if (
        run.instanceId === family?.ids[0] &&
        matchingGroup.run.instanceId !== family.ids[0]
      ) {
        matchingGroup.run = run;
      }
    } else {
      combined.push({
        key: '',
        family,
        run,
        segments: [run],
      });
    }
  }

  return combined
    .map((group) => ({
      ...group,
      key: group.family
        ? `${group.family.key}:${group.segments
            .map((segment) => segment.id)
            .sort()
            .join(':')}`
        : group.run.id,
    }))
    .sort((left, right) => {
      const leftStart = Math.min(
        ...left.segments.map((segment) => new Date(segment.start).getTime()),
      );
      const rightStart = Math.min(
        ...right.segments.map((segment) => new Date(segment.start).getTime()),
      );
      return rightStart - leftStart;
    });
};

const getCompletedBossKills = (segments: InstanceRunNode[]) =>
  segments
    .flatMap((segment) =>
      segment.encounters
        .filter((encounter) => encounter.completed)
        .map((encounter) => ({
          ...encounter,
          instanceName: segment.instance.name,
        })),
    )
    .sort(
      (left, right) =>
        new Date(left.end).getTime() - new Date(right.end).getTime(),
    );

const getBossKillSpan = (segments: InstanceRunNode[]) => {
  const killTimes = getCompletedBossKills(segments).map((encounter) =>
    new Date(encounter.end).getTime(),
  );

  if (killTimes.length < 2) return null;

  return intervalToDuration({
    start: Math.min(...killTimes),
    end: Math.max(...killTimes),
  });
};

export const InstanceRunsList = ({
  instanceId,
}: { instanceId?: string } = {}) => {
  const [perPage, setPerPage] = useState(25);
  const [expandedRunGroups, setExpandedRunGroups] = useState<Set<string>>(
    () => new Set(),
  );

  const [search] = useSearchParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading, refetch } = useQuery<Query>(INSTANCE_RUNS, {
    variables: {
      first: perPage,
      where: instanceId
        ? {
            ...getInstanceRunsFilters(search),
            instanceId: getInstanceRunFamily(instanceId)
              ? {
                  in: getInstanceRunFamily(instanceId)!.ids.map(Number),
                }
              : { eq: Number(instanceId) },
          }
        : getInstanceRunsFilters(search),
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (data?.instanceRuns?.nodes?.length === 0) {
    return <p>{t('common:noResults')}</p>;
  }

  if (loading || data?.instanceRuns?.nodes == null) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const { pageInfo } = data.instanceRuns;
  const combinedRuns = groupInstanceRuns(data.instanceRuns.nodes);
  const totalCompletedEncounters = combinedRuns.reduce(
    (total, group) =>
      total +
      group.segments.reduce(
        (count, segment) =>
          count +
          segment.encounters.filter((encounter) => encounter.completed).length,
        0,
      ),
    0,
  );

  const medianDuration = formatApiDuration(data.instanceRuns.medianDuration);

  return (
    <>
      <div className="card mb-5">
        <div className="card-content">
          <p className="mb-2">
            <strong>{`${t('pages:instanceRuns.medianDuration')} `}</strong>
            {medianDuration}
          </p>
          <p className="is-size-7">
            <strong>{`${t('pages:instanceRuns.groupsOnPage')}: `}</strong>
            {combinedRuns.length}
            <span className="mx-3">·</span>
            <strong>{`${t('pages:instanceRuns.completedEncountersTotal')}: `}</strong>
            {totalCompletedEncounters}
          </p>
          <p className="is-size-7 has-text-grey-light mt-2">
            {t('pages:instanceRuns.groupingHint')}
          </p>
        </div>
      </div>
      <table
        className={clsx(
          'table',
          'is-striped',
          'is-hoverable',
          'is-marginless',
          'instance-runs-main-table',
          isMobile ? 'is-narrow' : 'is-fullwidth',
        )}
      >
        <thead>
          <tr>
            <th>{t('pages:instanceRuns.startTime')}</th>
            <th>{t('pages:instanceRuns.instance')}</th>
            <th>{t('pages:instanceRuns.duration')}</th>
            <th>{t('pages:instanceRuns.bossesRecorded')}</th>
            <th className="is-hidden-mobile">
              {t('pages:instanceRuns.itemRatingMin')}
            </th>
            <th className="is-hidden-mobile">
              {t('pages:instanceRuns.itemRatingAverage')}
            </th>
            <th className="is-hidden-mobile">
              {t('pages:instanceRuns.itemRatingMax')}
            </th>
            <th className="is-hidden-mobile">
              {t('pages:instanceRuns.deaths')}
            </th>
            <th align="center" className="is-hidden-mobile">
              <span className="icon">
                <img
                  src="/images/icons/protection.png"
                  width={28}
                  height={33}
                  alt={t('pages:instanceRuns.numTanks') ?? ''}
                  title={t('pages:instanceRuns.numTanks') ?? ''}
                />
              </span>
            </th>
            <th align="center" className="is-hidden-mobile">
              <span className="icon">
                <img
                  src="/images/icons/healing.png"
                  width={28}
                  height={28}
                  alt={t('pages:instanceRuns.numHealers') ?? ''}
                  title={t('pages:instanceRuns.numHealers') ?? ''}
                />
              </span>
            </th>
            <th align="center" className="is-hidden-mobile">
              <span className="icon">
                <img
                  src="/images/icons/damage.png"
                  width={30}
                  height={32}
                  alt={t('pages:instanceRuns.numDps') ?? ''}
                  title={t('pages:instanceRuns.numDps') ?? ''}
                />
              </span>
            </th>
            <th>{t('common:details')}</th>
          </tr>
        </thead>
        <tbody>
          {combinedRuns.flatMap((group) => {
            const { run, segments, family } = group;
            const groupBossKills = getCompletedBossKills(segments);
            const startDate = groupBossKills.length
              ? new Date(groupBossKills[0].end)
              : new Date(
                  Math.min(
                    ...segments.map((segment) =>
                      new Date(segment.start).getTime(),
                    ),
                  ),
                );
            const endDate = groupBossKills.length
              ? new Date(groupBossKills[groupBossKills.length - 1].end)
              : new Date(
                  Math.max(
                    ...segments.map((segment) =>
                      new Date(segment.end).getTime(),
                    ),
                  ),
                );
            const durationObject =
              getBossKillSpan(segments) ??
              intervalToDuration({ end: endDate, start: startDate });
            const duration = formatCompactDuration(durationObject);
            const expanded = expandedRunGroups.has(group.key);
            const partyEntries = [
              ...new Map(
                segments
                  .flatMap((segment) => segment.scoreboardEntries)
                  .map((entry) => [entry.character.id, entry]),
              ).values(),
            ];
            const itemRatings = partyEntries.map((entry) => entry.itemRating);
            const itemRatingMin = itemRatings.length
              ? Math.min(...itemRatings)
              : 0;
            const itemRatingMax = itemRatings.length
              ? Math.max(...itemRatings)
              : 0;
            const itemRatingAverage = itemRatings.length
              ? itemRatings.reduce((a, b) => a + b, 0) / itemRatings.length
              : 0;
            const numTanks = partyEntries.filter(
              (entry) => entry.archetype === Archetype.Tank,
            ).length;
            const numHealers = partyEntries.filter(
              (entry) => entry.archetype === Archetype.Healer,
            ).length;
            const numDPS = partyEntries.filter((entry) =>
              [Archetype.MeleeDps, Archetype.RangedDps].includes(
                entry.archetype,
              ),
            ).length;
            const completedEncounters = segments.flatMap((segment) =>
              segment.encounters.filter((encounter) => encounter.completed),
            );
            const lostValeComplete = segments.some((segment) =>
              isLostValeComplete(segment.instanceId, completedEncounters),
            );
            const completedEncounterIds = new Set(
              completedEncounters.map((encounter) => encounter.encounterId),
            );
            const expectedEncounterIds = new Set(
              segments.flatMap((segment) =>
                (
                  segment.instance.encounters?.map(
                    (encounter) => encounter?.id,
                  ) ?? []
                ).filter((id): id is string => Boolean(id)),
              ),
            );
            const expectedEncounterCount = Math.max(
              expectedEncounterIds.size,
              completedEncounterIds.size,
            );
            const totalDeaths = segments
              .flatMap((segment) => segment.scoreboardEntries)
              .reduce((total, entry) => total + entry.deaths, 0);

            const rows = [
              <tr key={group.key} className="instance-run-summary-row">
                <td
                  className="instance-run-start-cell"
                  data-label={t('pages:instanceRuns.startTime')}
                  aria-label={t('pages:instanceRuns.startTime')}
                >
                  <small>
                    <time
                      className="instance-run-date-time"
                      dateTime={startDate.toISOString()}
                    >
                      <span>{format(startDate, 'yyyy-MM-dd')}</span>{' '}
                      <span>{format(startDate, 'HH:mm')}</span>
                    </time>
                  </small>
                </td>
                <td
                  className="instance-run-instance-cell"
                  data-label={t('pages:instanceRuns.instance')}
                  aria-label={t('pages:instanceRuns.instance')}
                >
                  <div>{family?.name ?? run.instance.name}</div>
                  {family && segments.length > 1 && (
                    <button
                      type="button"
                      className="instance-run-breakdown-toggle mt-1"
                      aria-expanded={expanded}
                      onClick={() => {
                        setExpandedRunGroups((current) => {
                          const next = new Set(current);
                          if (next.has(group.key)) next.delete(group.key);
                          else next.add(group.key);
                          return next;
                        });
                      }}
                    >
                      <span className="icon is-small">
                        <i
                          className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}
                        />
                      </span>
                      <span>
                        {t(
                          expanded
                            ? 'pages:instanceRuns.collapseBreakdown'
                            : 'pages:instanceRuns.breakdown',
                          { count: segments.length },
                        )}
                      </span>
                    </button>
                  )}
                </td>
                <td
                  className="instance-run-duration-cell"
                  data-label={t('pages:instanceRuns.duration')}
                  aria-label={t('pages:instanceRuns.duration')}
                >
                  {duration}
                  {groupBossKills.length > 1 && (
                    <div className="is-size-7 has-text-grey-light">
                      {groupBossKills[0].encounter?.name ??
                        `Encounter ${groupBossKills[0].encounterId}`}
                      {' → '}
                      {groupBossKills[groupBossKills.length - 1].encounter
                        ?.name ??
                        `Encounter ${groupBossKills[groupBossKills.length - 1].encounterId}`}
                      <span className="ml-2">
                        {format(startDate, 'HH:mm')}–{format(endDate, 'HH:mm')}
                      </span>
                    </div>
                  )}
                </td>
                <td
                  className="instance-run-bosses-cell"
                  data-label={t('pages:instanceRuns.bossesRecorded')}
                  aria-label={t('pages:instanceRuns.bossesRecorded')}
                  title={
                    lostValeComplete
                      ? t('pages:instanceRuns.lostValeCompletionTitle')
                      : t('pages:instanceRuns.bossesRecorded')
                  }
                >
                  {lostValeComplete
                    ? `${t('pages:instanceRuns.complete')} (${completedEncounterIds.size} / ${expectedEncounterCount})`
                    : expectedEncounterCount
                      ? `${completedEncounterIds.size} / ${expectedEncounterCount}`
                      : completedEncounterIds.size}
                </td>
                <td align="center" className="is-hidden-mobile">
                  {itemRatingMin}
                </td>
                <td align="center" className="is-hidden-mobile">
                  {itemRatingAverage.toFixed(0)}
                </td>
                <td align="center" className="is-hidden-mobile">
                  {itemRatingMax}
                </td>
                <td align="center" className="is-hidden-mobile">
                  {totalDeaths}
                </td>
                <td align="center" className="is-hidden-mobile">
                  {numTanks}
                </td>
                <td align="center" className="is-hidden-mobile">
                  {numHealers}
                </td>
                <td align="center" className="is-hidden-mobile">
                  {numDPS}
                </td>
                <td
                  className="instance-run-details-cell"
                  data-label={t('common:details')}
                  aria-label={t('common:details')}
                >
                  <Link
                    to={{
                      pathname: `/instance-run/${run.id}`,
                      search: `?runs=${encodeURIComponent(
                        segments.map((segment) => segment.id).join(','),
                      )}`,
                    }}
                    className="instance-run-action-link is-pulled-right"
                  >
                    {t('common:details')}
                  </Link>
                </td>
              </tr>,
            ];

            if (expanded) {
              rows.push(
                <tr
                  key={`${group.key}-breakdown`}
                  className="instance-run-breakdown-row"
                >
                  <td colSpan={12}>
                    <div className="table-container">
                      <table className="table is-fullwidth is-narrow instance-run-detail-table mb-0">
                        <thead>
                          <tr>
                            <th>{t('pages:instanceRuns.section')}</th>
                            <th>{t('pages:instanceRuns.startTime')}</th>
                            <th>{t('pages:instanceRuns.sectionDuration')}</th>
                            <th>{t('pages:instanceRuns.encounters')}</th>
                            <th>{t('pages:instanceRuns.bossesKilled')}</th>
                            <th>{t('pages:instanceRuns.firstBossKill')}</th>
                            <th>{t('pages:instanceRuns.lastBossKill')}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {segments.map((segment) => {
                            const segmentKills = getCompletedBossKills([
                              segment,
                            ]);
                            const segmentExpectedCount =
                              segment.instance.encounters?.length ??
                              segmentKills.length;
                            const segmentStart = new Date(segment.start);
                            const segmentDuration =
                              getBossKillSpan([segment]) ??
                              intervalToDuration({
                                start: segmentStart,
                                end: new Date(segment.end),
                              });

                            const firstKill = segmentKills[0];
                            const lastKill =
                              segmentKills[segmentKills.length - 1];

                            return (
                              <tr key={segment.id}>
                                <td
                                  data-label={t('pages:instanceRuns.section')}
                                  aria-label={t('pages:instanceRuns.section')}
                                >
                                  {segment.instance.name}
                                </td>
                                <td
                                  data-label={t('pages:instanceRuns.startTime')}
                                  aria-label={t('pages:instanceRuns.startTime')}
                                >
                                  <span style={{ whiteSpace: 'nowrap' }}>
                                    {format(segmentStart, 'yyyy-MM-dd HH:mm')}
                                  </span>
                                </td>
                                <td
                                  data-label={t('pages:instanceRuns.sectionDuration')}
                                  aria-label={t('pages:instanceRuns.sectionDuration')}
                                >
                                  {formatCompactDuration(segmentDuration)}
                                </td>
                                <td
                                  data-label={t('pages:instanceRuns.encounters')}
                                  aria-label={t('pages:instanceRuns.encounters')}
                                >
                                  {segmentKills.length} /{' '}
                                  {Math.max(
                                    segmentExpectedCount,
                                    segmentKills.length,
                                  )}
                                </td>
                                <td
                                  data-label={t('pages:instanceRuns.bossesKilled')}
                                  aria-label={t('pages:instanceRuns.bossesKilled')}
                                >
                                  {segmentKills.length ? (
                                    <ol className="instance-run-boss-list">
                                      {segmentKills.map((encounter) => (
                                        <li key={encounter.id}>
                                          <span>
                                            {encounter.encounter?.name ??
                                              `Encounter ${encounter.encounterId}`}
                                          </span>
                                          <time
                                            dateTime={new Date(
                                              encounter.end,
                                            ).toISOString()}
                                          >
                                            {format(
                                              new Date(encounter.end),
                                              'HH:mm',
                                            )}
                                          </time>
                                        </li>
                                      ))}
                                    </ol>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                                <td
                                  data-label={t('pages:instanceRuns.firstBossKill')}
                                  aria-label={t('pages:instanceRuns.firstBossKill')}
                                >
                                  {firstKill
                                    ? format(
                                        new Date(firstKill.end),
                                        'yyyy-MM-dd HH:mm',
                                      )
                                    : '—'}
                                </td>
                                <td
                                  data-label={t('pages:instanceRuns.lastBossKill')}
                                  aria-label={t('pages:instanceRuns.lastBossKill')}
                                >
                                  {lastKill
                                    ? format(
                                        new Date(lastKill.end),
                                        'yyyy-MM-dd HH:mm',
                                      )
                                    : '—'}
                                </td>
                                <td
                                  data-label={t('common:details')}
                                  aria-label={t('common:details')}
                                >
                                  <Link
                                    to={`/instance-run/${segment.id}`}
                                    className="instance-run-action-link"
                                  >
                                    {t('common:details')}
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>,
              );
            }

            return rows;
          })}
        </tbody>
      </table>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        onPerPageChange={setPerPage}
        refetch={refetch}
      />
    </>
  );
};
