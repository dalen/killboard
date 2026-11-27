import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { WarhammerKillTabs } from '@/components/global/WarhammerKillTabs';
import {
  WarhammerFilterPanel,
  WarhammerSelect,
} from '@/components/global/WarhammerFormControls';
import { CareerIcon } from '@/components/CareerIcon';
import { getCareerRealm } from '@/components/kill/careerRealm';
import type { Career } from '@/__generated__/graphql';
import { INSTANCE_RUN_FAMILIES } from '@/components/instance_run/instanceRunFamilies';
import {
  formatKillTime,
  type KillTimeZoneMode,
} from '@/components/kill/killTime';
import type { InstanceRunFilterInput, Query } from '@/__generated__/graphql';
import type { ReactElement, ReactNode } from 'react';
import './Activity.scss';

const RECENT_ACTIVITY = gql`
  query GetRecentActivity(
    $from: DateTime!
    $first: Int!
    $runWhere: InstanceRunFilterInput!
  ) {
    kills(first: $first, where: { time: { gte: $from } }) {
      totalCount
      nodes {
        id
        time
        deathblow {
          id
          name
          career
        }
        victim {
          character {
            id
            name
            career
          }
        }
        scenario {
          name
        }
        position {
          zoneId
          zone {
            name
          }
        }
      }
    }
    skirmishes(first: $first, where: { startTime: { gte: $from } }) {
      totalCount
      nodes {
        id
        startTime
        scenario {
          name
        }
        primaryZone {
          name
        }
        primaryZoneArea {
          name
        }
        numberOfPlayers
        numberOfKills
      }
    }
    instanceRuns(first: $first, where: $runWhere, order: { start: DESC }) {
      totalCount
      nodes {
        id
        start
        instance {
          name
        }
        encounters {
          completed
        }
        scoreboardEntries {
          character {
            id
          }
        }
      }
    }
  }
`;

type RecentActivityData = Pick<Query, 'kills' | 'skirmishes' | 'instanceRuns'>;
type RecentActivityVariables = {
  from: string;
  first: number;
  runWhere: InstanceRunFilterInput;
};
type ActivityPeriod = 'last30m' | 'last2h' | 'last24h' | 'last7d';
type ActivityKindFilter = 'all' | ActivityEntry['kind'];

const SEWER_INSTANCE_IDS =
  INSTANCE_RUN_FAMILIES.find(
    (family) => family.key === 'altdorf-sewers',
  )?.ids.map(Number) ?? [];

const PERIOD_OPTIONS: ActivityPeriod[] = [
  'last30m',
  'last2h',
  'last24h',
  'last7d',
];

const ACTIVITY_KIND_OPTIONS: ActivityKindFilter[] = [
  'all',
  'kill',
  'skirmish',
  'instance',
];

const getPeriodStart = (period: ActivityPeriod): Date => {
  const start = new Date();
  const milliseconds = {
    last30m: 30 * 60 * 1000,
    last2h: 2 * 60 * 60 * 1000,
    last24h: 24 * 60 * 60 * 1000,
    last7d: 7 * 24 * 60 * 60 * 1000,
  }[period];
  return new Date(start.getTime() - milliseconds);
};

type ActivityEntry = {
  id: string;
  kind: 'kill' | 'skirmish' | 'instance';
  time: string;
  title: ReactNode;
  detail: string;
  location: string;
  href: string;
  mapHref?: string;
};

const realmClass = (career?: Career): string =>
  career ? `is-${getCareerRealm(career)}` : '';

export const Activity = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages', 'components', 'enums']);
  const [search, setSearch] = useSearchParams();
  const selectedPeriod = search.get('period');
  const period: ActivityPeriod = PERIOD_OPTIONS.includes(
    selectedPeriod as ActivityPeriod,
  )
    ? (selectedPeriod as ActivityPeriod)
    : 'last24h';
  const selectedActivityKind = search.get('activityType');
  const activityKind: ActivityKindFilter = ACTIVITY_KIND_OPTIONS.includes(
    selectedActivityKind as ActivityKindFilter,
  )
    ? (selectedActivityKind as ActivityKindFilter)
    : 'all';
  const timeZoneMode: KillTimeZoneMode =
    search.get('timeZone') === 'local' ? 'local' : 'altdorf';
  const variables = useMemo<RecentActivityVariables>(() => {
    const from = getPeriodStart(period).toISOString();
    return {
      from,
      first: 10,
      runWhere: {
        // Empty-run rows are useful for Sewers, but not for other dungeons.
        or: [
          { completedEncounters: { gte: 1 } },
          { instanceId: { in: SEWER_INSTANCE_IDS } },
        ],
        start: { gte: from },
      },
    };
  }, [period]);
  const { data, loading, error } = useQuery<
    RecentActivityData,
    RecentActivityVariables
  >(RECENT_ACTIVITY, { variables });

  const entries = useMemo<ActivityEntry[]>(() => {
    const kills = (data?.kills?.nodes ?? []).map((kill) => ({
      id: kill.id,
      kind: 'kill' as const,
      time: kill.time,
      title: (
        <>
          {kill.deathblow && (
            <span
              className="activity-career-icon"
              title={t('pages:activityPage.killerCareer', {
                career: t(`enums:career.${kill.deathblow.career}`),
              })}
              aria-label={t('pages:activityPage.killerCareer', {
                career: t(`enums:career.${kill.deathblow.career}`),
              })}
            >
              <CareerIcon career={kill.deathblow.career} />
            </span>
          )}
          {kill.deathblow ? (
            <Link
              className={`activity-character ${realmClass(kill.deathblow.career)}`}
              to={`/character/${kill.deathblow.id}`}
            >
              {kill.deathblow.name}
            </Link>
          ) : (
            t('pages:activityPage.unknownPlayer')
          )}{' '}
          {t('pages:activityPage.killed')}{' '}
          {kill.victim.character && (
            <span
              className="activity-career-icon"
              title={t('pages:activityPage.victimCareer', {
                career: t(`enums:career.${kill.victim.character.career}`),
              })}
              aria-label={t('pages:activityPage.victimCareer', {
                career: t(`enums:career.${kill.victim.character.career}`),
              })}
            >
              <CareerIcon career={kill.victim.character.career} />
            </span>
          )}
          {kill.victim.character ? (
            <Link
              className={`activity-character ${realmClass(kill.victim.character.career)}`}
              to={`/character/${kill.victim.character.id}`}
            >
              {kill.victim.character.name}
            </Link>
          ) : (
            t('pages:activityPage.unknownPlayer')
          )}
        </>
      ),
      detail: '',
      location:
        kill.position.zone?.name ??
        kill.scenario?.name ??
        t('pages:activityPage.unknownLocation'),
      href: `/kill/${kill.id}`,
      mapHref:
        kill.position.zoneId != null && String(kill.position.zoneId) !== '0'
          ? `/zone_heatmap/${kill.position.zoneId}`
          : undefined,
    }));
    const skirmishes = (data?.skirmishes?.nodes ?? []).map((skirmish) => {
      const title = skirmish.scenario?.name ?? t('pages:activityPage.skirmish');
      const recordedLocation =
        skirmish.primaryZoneArea?.name ?? skirmish.primaryZone?.name ?? '';
      return {
        id: skirmish.id,
        kind: 'skirmish' as const,
        time: skirmish.startTime,
        title,
        detail: [
          t('pages:activityPage.skirmishPlayerCount', {
            count: skirmish.numberOfPlayers,
          }),
          t('pages:activityPage.skirmishKillCount', {
            count: skirmish.numberOfKills,
          }),
        ].join(' · '),
        location:
          recordedLocation === title
            ? ''
            : recordedLocation || t('pages:activityPage.unknownLocation'),
        href: `/skirmish/${skirmish.id}`,
      };
    });
    const instances = (data?.instanceRuns?.nodes ?? []).map((run) => ({
      id: run.id,
      kind: 'instance' as const,
      time: run.start,
      title: run.instance.name,
      detail: [
        t('pages:activityPage.instanceBossCount', {
          count: run.encounters.filter((encounter) => encounter.completed)
            .length,
        }),
        t('pages:activityPage.instancePlayerCount', {
          count: run.scoreboardEntries.length,
        }),
      ].join(' · '),
      location: t('pages:activityPage.unknownLocation'),
      href: `/instance-run/${run.id}`,
    }));

    return [...kills, ...skirmishes, ...instances]
      .filter((entry) => activityKind === 'all' || entry.kind === activityKind)
      .sort((left, right) => Date.parse(right.time) - Date.parse(left.time));
  }, [activityKind, data, t]);

  const updateSearch = (key: string, value: string) => {
    const next = new URLSearchParams(search);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearch(next);
  };

  return (
    <div className="container is-max-widescreen mt-2 activity-page">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/kills">{t('pages:killsPage.title')}</Link>
          </li>
          <li className="is-active">
            <Link to="/activity">{t('pages:activityPage.title')}</Link>
          </li>
        </ul>
      </nav>
      <WarhammerKillTabs active="activity" />

      <section
        className="warhammer-window-panel activity-panel"
        aria-labelledby="activity-page-title"
      >
        <div className="activity-page-heading">
          <div>
            <h1
              className="title is-3 is-family-secondary"
              id="activity-page-title"
            >
              {t('pages:activityPage.title')}
            </h1>
            <p className="has-text-grey">
              {t('pages:activityPage.description')}
            </p>
          </div>
          <WarhammerFilterPanel className="activity-filter-shell">
            <div className="warhammer-filter-grid activity-filter-grid activity-page-filters">
              <WarhammerSelect
                id="activity-type"
                label={t('pages:activityPage.activityType')}
                value={activityKind}
                options={ACTIVITY_KIND_OPTIONS.map((option) => ({
                  value: option,
                  label:
                    option === 'all'
                      ? t('pages:activityPage.allActivityTypes')
                      : t(`pages:activityPage.types.${option}`),
                }))}
                onChange={(value) =>
                  updateSearch('activityType', value === 'all' ? '' : value)
                }
              />
              <WarhammerSelect
                id="activity-period"
                label={t('pages:activityPage.period')}
                value={period}
                options={PERIOD_OPTIONS.map((option) => ({
                  value: option,
                  label: t(`components:killsFilters.${option}`),
                }))}
                onChange={(value) => updateSearch('period', value)}
              />
              <WarhammerSelect
                id="activity-time-zone"
                label={t('components:killsFilters.timeZone')}
                value={timeZoneMode}
                options={[
                  {
                    value: 'altdorf',
                    label: t('components:killsFilters.altdorfTime'),
                  },
                  {
                    value: 'local',
                    label: t('components:killsFilters.computerTime'),
                  },
                ]}
                onChange={(value) =>
                  updateSearch('timeZone', value === 'local' ? 'local' : '')
                }
              />
            </div>
          </WarhammerFilterPanel>
        </div>

        <p className="is-size-7 has-text-grey mt-4">
          {t('pages:activityPage.methodology')}
        </p>

        {!loading && !error && (
          <div
            className="activity-counts"
            aria-label={t('pages:activityPage.recordsInPeriod')}
          >
            <button
              type="button"
              className={`activity-count${activityKind === 'kill' ? ' is-selected' : ''}`}
              aria-pressed={activityKind === 'kill'}
              onClick={() =>
                updateSearch(
                  'activityType',
                  activityKind === 'kill' ? '' : 'kill',
                )
              }
            >
              <span>{t('pages:activityPage.types.kill')}</span>
              <strong>
                {t('pages:activityPage.countSummary', {
                  shown: data?.kills?.nodes?.length ?? 0,
                  total: (data?.kills?.totalCount ?? 0).toLocaleString(),
                })}
              </strong>
            </button>
            <button
              type="button"
              className={`activity-count${activityKind === 'skirmish' ? ' is-selected' : ''}`}
              aria-pressed={activityKind === 'skirmish'}
              onClick={() =>
                updateSearch(
                  'activityType',
                  activityKind === 'skirmish' ? '' : 'skirmish',
                )
              }
            >
              <span>{t('pages:activityPage.types.skirmish')}</span>
              <strong>
                {t('pages:activityPage.countSummary', {
                  shown: data?.skirmishes?.nodes?.length ?? 0,
                  total: (data?.skirmishes?.totalCount ?? 0).toLocaleString(),
                })}
              </strong>
            </button>
            <button
              type="button"
              className={`activity-count${activityKind === 'instance' ? ' is-selected' : ''}`}
              aria-pressed={activityKind === 'instance'}
              onClick={() =>
                updateSearch(
                  'activityType',
                  activityKind === 'instance' ? '' : 'instance',
                )
              }
            >
              <span>{t('pages:activityPage.types.instance')}</span>
              <strong>
                {t('pages:activityPage.countSummary', {
                  shown: data?.instanceRuns?.nodes?.length ?? 0,
                  total: (data?.instanceRuns?.totalCount ?? 0).toLocaleString(),
                })}
              </strong>
            </button>
          </div>
        )}

        {loading && <progress className="progress mt-4" />}
        {error && <ErrorMessage name={error.name} message={error.message} />}
        {!loading && !error && entries.length === 0 && (
          <p className="has-text-grey mt-4">{t('common:noResults')}</p>
        )}
        {!loading && !error && entries.length > 0 && (
          <div
            className="activity-log mt-3"
            role="table"
            aria-label={t('pages:activityPage.title')}
          >
            <div className="activity-log-header" role="row">
              <span role="columnheader">{t('pages:activityPage.time')}</span>
              <span role="columnheader">
                {t('pages:activityPage.activityType')}
              </span>
              <span role="columnheader">{t('pages:activityPage.event')}</span>
              <span role="columnheader">
                {t('pages:activityPage.location')}
              </span>
              <span role="columnheader">{t('pages:activityPage.details')}</span>
            </div>
            {entries.map((entry) => (
              <article
                className="activity-log-row"
                role="row"
                key={`${entry.kind}-${entry.id}`}
              >
                <time role="cell" dateTime={entry.time}>
                  {formatKillTime(new Date(entry.time), timeZoneMode, 'full')}
                </time>
                <span
                  role="cell"
                  className={`activity-kind activity-kind-${entry.kind}`}
                  title={t(`pages:activityPage.types.${entry.kind}`)}
                  aria-label={t(`pages:activityPage.types.${entry.kind}`)}
                >
                  <span className="is-sr-only">
                    {t(`pages:activityPage.types.${entry.kind}`)}
                  </span>
                  <img
                    src={
                      entry.kind === 'kill'
                        ? '/images/icons/rvr.png'
                        : entry.kind === 'skirmish'
                          ? '/images/icons/scenario.png'
                          : '/images/icons/quest_rvr.png'
                    }
                    alt=""
                  />
                </span>
                <div role="cell" className="activity-event">
                  <span className="activity-log-title">{entry.title}</span>
                  {entry.detail && <small>{entry.detail}</small>}
                </div>
                <span role="cell" className="activity-location">
                  {entry.mapHref ? (
                    <Link
                      to={entry.mapHref}
                      aria-label={t('pages:activityPage.openZoneHeatmap', {
                        zone: entry.location,
                      })}
                    >
                      {entry.location}
                    </Link>
                  ) : (
                    entry.location
                  )}
                </span>
                <Link
                  role="cell"
                  className="button is-small activity-details-link"
                  to={entry.href}
                >
                  {t('pages:activityPage.details')}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
