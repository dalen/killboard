import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import {
  format,
  formatDuration,
  formatISO,
  intervalToDuration,
} from 'date-fns';
import { Link, useParams, useSearchParams } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { Archetype } from '@/__generated__/graphql';
import {
  INSTANCE_RUN_SCOREBOARD_FRAGMENT,
  InstanceRunScoreboard,
} from '@/components/instance_run/InstanceRunScoreboard';
import clsx from 'clsx';
import type { InstanceRunQuery, Query } from '@/__generated__/graphql';
import type { ReactElement } from 'react';
import {
  getInstanceRunFamily,
  isLostValeComplete,
} from '@/components/instance_run/instanceRunFamilies';

const INSTANCE_FAMILY_RUNS = gql`
  query InstanceFamilyRuns(
    $familyIds: [ID!]!
    $startFrom: DateTime!
    $startTo: DateTime!
  ) {
    instanceRuns(
      first: 50
      where: {
        instanceId: { in: $familyIds }
        start: { gte: $startFrom, lte: $startTo }
      }
      order: { start: ASC }
    ) {
      nodes {
        id
        start
        end
        instance {
          name
          encounters {
            id
            name
          }
        }
        scoreboardEntries {
          character {
            id
          }
        }
        encounters {
          id
          start
          end
          completed
          instanceId
          encounterId
          scoreboardEntries {
            itemRating
            archetype
            deaths
          }
          encounter {
            name
          }
        }
      }
    }
  }
`;

const INSTANCE_RUN = gql`
  query InstanceRun($id: ID!, $runIds: [ID!]!) {
    instanceRun(id: $id) {
      id
      start
      end
      instance {
        id
        name
        encounters {
          id
          name
        }
      }
      scoreboardEntries {
        ...InstanceRunScoreboardEntry
      }
      encounters {
        id
        start
        end
        completed
        instanceId
        encounterId
        scoreboardEntries {
          itemRating
          archetype
          deaths
          damage
          healing
        }
        encounter {
          name
        }
      }
    }
    instanceRuns(first: 50, where: { id: { in: $runIds } }) {
      nodes {
        id
        start
        end
        instance {
          name
          encounters {
            id
            name
          }
        }
        scoreboardEntries {
          character {
            id
          }
        }
        encounters {
          id
          start
          end
          completed
          instanceId
          encounterId
          scoreboardEntries {
            itemRating
            archetype
            deaths
            damage
            healing
          }
          encounter {
            name
          }
        }
      }
    }
  }

  ${INSTANCE_RUN_SCOREBOARD_FRAGMENT}
`;

type InstanceRunDetailsQuery = InstanceRunQuery & Pick<Query, 'instanceRuns'>;

export const InstanceRun = (): ReactElement => {
  const { id } = useParams();
  const [search] = useSearchParams();
  const runIds = search
    .get('runs')
    ?.split(',')
    .map((runId) => runId.trim())
    .filter(Boolean);
  const groupedRunDetails = search.has('runs');
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<InstanceRunDetailsQuery>(
    INSTANCE_RUN,
    {
      variables: {
        id,
        runIds: runIds?.length ? runIds : id ? [id] : [],
      },
    },
  );
  const selectedRuns = data?.instanceRuns?.nodes ?? [];
  const instanceFamily = data?.instanceRun
    ? getInstanceRunFamily(data.instanceRun.instance.id)
    : undefined;
  const selectedStartTimes = selectedRuns.map((run) =>
    new Date(run.start).getTime(),
  );
  const selectedEndTimes = selectedRuns.map((run) =>
    new Date(run.end).getTime(),
  );
  const familySearchStart = selectedStartTimes.length
    ? Math.min(...selectedStartTimes) - 60 * 60 * 1000
    : 0;
  const familySearchEnd = selectedEndTimes.length
    ? Math.max(...selectedEndTimes) + 60 * 60 * 1000
    : 0;
  const {
    data: familyRunsData,
    error: familyRunsError,
    loading: familyRunsLoading,
  } = useQuery<Query>(INSTANCE_FAMILY_RUNS, {
    variables: {
      familyIds: instanceFamily?.ids ?? [],
      startFrom: new Date(familySearchStart).toISOString(),
      startTo: new Date(familySearchEnd).toISOString(),
    },
    skip: !groupedRunDetails || !instanceFamily || selectedRuns.length === 0,
  });
  if (
    loading ||
    !data?.instanceRun?.encounters ||
    !data.instanceRuns?.nodes ||
    (groupedRunDetails && familyRunsLoading)
  ) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (familyRunsError) {
    return (
      <ErrorMessage
        name={familyRunsError.name}
        message={familyRunsError.message}
      />
    );
  }

  const { instanceRun } = data;
  const sameParty = (left: string[], right: string[]) => {
    const rightRoster = new Set(right);
    const sharedCount = left.filter((characterId) =>
      rightRoster.has(characterId),
    ).length;
    const smallerRosterSize = Math.min(left.length, right.length);
    const largerRosterSize = Math.max(left.length, right.length);

    return (
      sharedCount >= 3 &&
      sharedCount / smallerRosterSize >= 0.75 &&
      sharedCount / largerRosterSize >= 0.5
    );
  };
  const relatedRuns = (familyRunsData?.instanceRuns?.nodes ?? []).filter(
    (candidate) => {
      const candidateRoster = candidate.scoreboardEntries.map(
        (entry) => entry.character.id,
      );
      const candidateStart = new Date(candidate.start).getTime();
      const candidateEnd = new Date(candidate.end).getTime();

      return selectedRuns.some((selected) => {
        const selectedRoster = selected.scoreboardEntries.map(
          (entry) => entry.character.id,
        );
        const selectedStart = new Date(selected.start).getTime();
        const selectedEnd = new Date(selected.end).getTime();

        return (
          sameParty(candidateRoster, selectedRoster) &&
          candidateStart <= selectedEnd + 60 * 60 * 1000 &&
          candidateEnd >= selectedStart - 60 * 60 * 1000
        );
      });
    },
  );
  const allRuns = [
    ...new Map(
      [...selectedRuns, ...relatedRuns].map((run) => [run.id, run]),
    ).values(),
  ];
  const allEncounters = allRuns
    .flatMap((run) =>
      run.encounters.map((encounter) => ({
        ...encounter,
        instanceRunId: run.id,
        sectionName: run.instance.name,
      })),
    )
    .filter((encounter) => !groupedRunDetails || encounter.completed)
    .sort(
      (left, right) =>
        new Date(left.end).getTime() - new Date(right.end).getTime(),
    );
  const expectedEncounterIds = new Set(
    allRuns.flatMap((run) =>
      (run.instance.encounters?.map((encounter) => encounter?.id) ?? []).filter(
        (id): id is string => Boolean(id),
      ),
    ),
  );
  const completedEncounterIds = new Set(
    allEncounters
      .filter((encounter) => encounter.completed)
      .map((encounter) => encounter.encounterId),
  );
  const expectedEncounterCount = Math.max(
    expectedEncounterIds.size,
    completedEncounterIds.size,
  );
  const lostValeComplete = isLostValeComplete(
    instanceRun.instance.id,
    allEncounters,
  );

  const instanceStartDate = new Date(instanceRun.start);
  const instanceEndDate = new Date(instanceRun.end);
  const firstBossKill = groupedRunDetails ? allEncounters[0] : undefined;
  const lastBossKill = groupedRunDetails
    ? allEncounters[allEncounters.length - 1]
    : undefined;
  const displayStartDate = firstBossKill
    ? new Date(firstBossKill.end)
    : instanceStartDate;
  const displayEndDate = lastBossKill
    ? new Date(lastBossKill.end)
    : instanceEndDate;
  const instanceDurationObject = intervalToDuration({
    end: displayEndDate,
    start: displayStartDate,
  });

  const instanceDuration = formatDuration(instanceDurationObject);
  const instanceItemRatings = instanceRun.scoreboardEntries.map(
    (e) => e.itemRating,
  );
  const instanceItemRatingMin = Math.min(...instanceItemRatings);
  const instanceItemRatingMax = Math.max(...instanceItemRatings);
  const instanceItemRatingAverage =
    instanceItemRatings.reduce((a, b) => a + b) / instanceItemRatings.length;
  const instanceNumTanks = instanceRun.scoreboardEntries.filter(
    (e) => e.archetype === Archetype.Tank,
  ).length;
  const instanceNumHealers = instanceRun.scoreboardEntries.filter(
    (e) => e.archetype === Archetype.Healer,
  ).length;
  const instanceNumDPS = instanceRun.scoreboardEntries.filter((e) =>
    [Archetype.MeleeDps, Archetype.RangedDps].includes(e.archetype),
  ).length;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/instance-runs/">{t('common:instanceRuns')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/instance-run/${id}`}>
              {t('pages:instanceRun.title', { id })}
            </Link>
          </li>
        </ul>
      </nav>

      <p className="is-size-4">
        <strong>
          {groupedRunDetails
            ? (instanceFamily?.name ?? instanceRun.instance?.name)
            : instanceRun.instance?.name}
        </strong>
      </p>
      <div className="card mb-5">
        <div className="card-content">
          <article className="media">
            <div className="media-content">
              <p>
                <strong>
                  {t(
                    groupedRunDetails
                      ? 'pages:instanceRuns.firstBossKill'
                      : 'pages:instanceRun.startTime',
                  )}
                </strong>{' '}
                {formatISO(displayStartDate, { representation: 'date' })}{' '}
                {format(displayStartDate, 'HH:mm')}
              </p>
              {groupedRunDetails && lastBossKill && (
                <p>
                  <strong>{t('pages:instanceRuns.lastBossKill')}</strong>{' '}
                  {format(new Date(lastBossKill.end), 'yyyy-MM-dd HH:mm')}
                </p>
              )}
              <p>
                <strong>{t('pages:instanceRun.duration')}</strong>{' '}
                {instanceDuration}
              </p>
              {groupedRunDetails && (
                <p>
                  <strong>{t('pages:instanceRuns.bossesRecorded')}</strong>{' '}
                  <span
                    title={
                      lostValeComplete
                        ? t('pages:instanceRuns.lostValeCompletionTitle')
                        : undefined
                    }
                  >
                    {lostValeComplete
                      ? `${t('pages:instanceRuns.complete')} (${completedEncounterIds.size} / ${expectedEncounterCount})`
                      : expectedEncounterCount
                        ? `${completedEncounterIds.size} / ${expectedEncounterCount}`
                        : completedEncounterIds.size}
                  </span>
                </p>
              )}
            </div>
            <div className="media-content">
              <p>
                <strong>{t('pages:instanceRun.itemRatingMin')}</strong>{' '}
                {instanceItemRatingMin}
              </p>
              <p>
                <strong>{t('pages:instanceRun.itemRatingAverage')}</strong>{' '}
                {instanceItemRatingAverage.toFixed(0)}
              </p>
              <p>
                <strong>{t('pages:instanceRun.itemRatingMax')}</strong>{' '}
                {instanceItemRatingMax}
              </p>
            </div>
            <div className="media-content">
              <p>
                <strong>{t('pages:instanceRun.numTanks')}</strong>{' '}
                {instanceNumTanks}
              </p>
              <p>
                <strong>{t('pages:instanceRun.numHealers')}</strong>{' '}
                {instanceNumHealers}
              </p>
              <p>
                <strong>{t('pages:instanceRun.numDps')}</strong>{' '}
                {instanceNumDPS}
              </p>
            </div>
          </article>
        </div>
      </div>

      <div className="table-container instance-run-detail-table">
        <table
          className={clsx(
            'table',
            'is-striped',
            'is-hoverable',
            'is-marginless',
            'is-fullwidth',
            'mb-5',
          )}
        >
          <thead>
            <tr>
              <th>{t('pages:instanceRuns.bossKillTime')}</th>
              <th>{t('pages:instanceRun.encounter')}</th>
              <th className="is-hidden-mobile">
                {t('pages:instanceRun.instance')}
              </th>
              <th>{t('pages:instanceRuns.sincePreviousBoss')}</th>
              <th>{t('pages:instanceRun.duration')}</th>
              <th className="is-hidden-mobile">
                {t('pages:instanceRun.itemRatingMin')}
              </th>
              <th className="is-hidden-mobile">
                {t('pages:instanceRun.itemRatingAverage')}
              </th>
              <th className="is-hidden-mobile">
                {t('pages:instanceRun.itemRatingMax')}
              </th>
              <th className="is-hidden-mobile">
                {t('pages:instanceRun.deaths')}
              </th>
              <th align="center" className="is-hidden-mobile">
                <span className="icon">
                  <img
                    src="/images/icons/protection.png"
                    width={28}
                    height={33}
                    alt={t('pages:instanceRun.numTanks') ?? ''}
                    title={t('pages:instanceRun.numTanks') ?? ''}
                  />
                </span>
              </th>
              <th align="center" className="is-hidden-mobile">
                <span className="icon">
                  <img
                    src="/images/icons/healing.png"
                    width={28}
                    height={28}
                    alt={t('pages:instanceRun.numHealers') ?? ''}
                    title={t('pages:instanceRun.numHealers') ?? ''}
                  />
                </span>
              </th>
              <th align="center" className="is-hidden-mobile">
                <span className="icon">
                  <img
                    src="/images/icons/damage.png"
                    width={30}
                    height={32}
                    alt={t('pages:instanceRun.numDps') ?? ''}
                    title={t('pages:instanceRun.numDps') ?? ''}
                  />
                </span>
              </th>
              <th>{t('common:details')}</th>
            </tr>
          </thead>
          <tbody>
            {allEncounters.map((instanceEncounterRun, encounterIndex) => {
              const startDate = new Date(instanceEncounterRun.start);
              const endDate = new Date(instanceEncounterRun.end);
              const durationObject = intervalToDuration({
                end: endDate,
                start: startDate,
              });

              const duration = formatDuration(durationObject);
              const previousEncounter = groupedRunDetails
                ? allEncounters[encounterIndex - 1]
                : undefined;
              const timeSincePrevious = previousEncounter
                ? formatDuration(
                    intervalToDuration({
                      start: new Date(previousEncounter.end),
                      end: endDate,
                    }),
                  )
                : '—';
              const itemRatings = instanceEncounterRun.scoreboardEntries.map(
                (e) => e.itemRating,
              );
              const itemRatingMin = Math.min(...itemRatings);
              const itemRatingMax = Math.max(...itemRatings);
              const itemRatingAverage =
                itemRatings.reduce((a, b) => a + b) / itemRatings.length;
              const numTanks = instanceEncounterRun.scoreboardEntries.filter(
                (e) => e.archetype === Archetype.Tank,
              ).length;
              const numHealers = instanceEncounterRun.scoreboardEntries.filter(
                (e) => e.archetype === Archetype.Healer,
              ).length;
              const numDPS = instanceEncounterRun.scoreboardEntries.filter(
                (e) =>
                  [Archetype.MeleeDps, Archetype.RangedDps].includes(
                    e.archetype,
                  ),
              ).length;

              return (
                <tr key={instanceEncounterRun.id}>
                  <td>
                    <small>
                      <time
                        dateTime={endDate.toISOString()}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {format(endDate, 'yyyy-MM-dd HH:mm')}
                      </time>
                    </small>
                  </td>
                  <td>
                    {' '}
                    {instanceEncounterRun.completed ? (
                      <span className="icon-text">
                        <span className="icon">
                          <i className="fas fa-star mr-2 has-text-warning" />
                        </span>
                        {instanceEncounterRun.encounter?.name}
                      </span>
                    ) : (
                      <span className="icon-text">
                        <span className="icon">
                          <i className="fa-solid fa-circle-exclamation  mr-2 has-text-danger" />
                        </span>
                        {instanceEncounterRun.encounter?.name}
                      </span>
                    )}
                    <small className="has-text-grey-light instance-run-mobile-section">
                      {instanceEncounterRun.sectionName}
                    </small>
                  </td>
                  <td className="is-hidden-mobile">
                    {instanceEncounterRun.sectionName}
                  </td>
                  <td>{timeSincePrevious}</td>
                  <td>
                    <small>{duration}</small>
                  </td>
                  <td align="center" className="is-hidden-mobile">
                    {instanceEncounterRun.scoreboardEntries
                      .map((e) => e.deaths)
                      .reduce((a, b) => a + b, 0)}
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
                    {numTanks}
                  </td>
                  <td align="center" className="is-hidden-mobile">
                    {numHealers}
                  </td>
                  <td align="center" className="is-hidden-mobile">
                    {numDPS}
                  </td>
                  <td>
                    <Link
                      to={`/instance-run/${instanceEncounterRun.instanceRunId}/${instanceEncounterRun.id}`}
                      className="instance-run-action-link is-pulled-right"
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

      <InstanceRunScoreboard entries={data.instanceRun.scoreboardEntries} />
    </div>
  );
};
