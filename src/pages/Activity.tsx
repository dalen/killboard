import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { INSTANCE_RUN_FAMILIES } from '@/components/instance_run/instanceRunFamilies';
import { formatKillTime, type KillTimeZoneMode } from '@/components/kill/killTime';
import type { InstanceRunFilterInput, Query } from '@/__generated__/graphql';
import type { ReactElement } from 'react';
import './Activity.scss';

const RECENT_ACTIVITY = gql`
  query GetRecentActivity(
    $from: DateTime!
    $first: Int!
    $runWhere: InstanceRunFilterInput!
    $includeKills: Boolean!
    $includeSkirmishes: Boolean!
    $includeInstanceRuns: Boolean!
  ) {
    kills(first: $first, where: { time: { gte: $from } })
      @include(if: $includeKills) {
      nodes {
        id
        time
        deathblow {
          name
        }
        victim {
          character {
            name
          }
        }
        scenario {
          name
        }
        position {
          zone {
            name
          }
        }
      }
    }
    skirmishes(first: $first, where: { startTime: { gte: $from } })
      @include(if: $includeSkirmishes) {
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
    instanceRuns(first: $first, where: $runWhere, order: { start: DESC })
      @include(if: $includeInstanceRuns) {
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
  includeKills: boolean;
  includeSkirmishes: boolean;
  includeInstanceRuns: boolean;
};
type ActivityPeriod = 'last30m' | 'last2h' | 'last24h' | 'last7d';
type ActivityKindFilter = 'all' | ActivityEntry['kind'];

const SEWER_INSTANCE_IDS = INSTANCE_RUN_FAMILIES.find(
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
  title: string;
  detail: string;
  href: string;
};

export const Activity = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages', 'components']);
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
  const variables = useMemo<RecentActivityVariables>(
    () => {
      const from = getPeriodStart(period).toISOString();
      return {
        from,
        first: 10,
        includeKills: activityKind === 'all' || activityKind === 'kill',
        includeSkirmishes:
          activityKind === 'all' || activityKind === 'skirmish',
        includeInstanceRuns:
          activityKind === 'all' || activityKind === 'instance',
        runWhere: {
          // Empty-run rows are useful for Sewers, but not for other dungeons.
          or: [
            { completedEncounters: { gte: 1 } },
            { instanceId: { in: SEWER_INSTANCE_IDS } },
          ],
          start: { gte: from },
        },
      };
    },
    [activityKind, period],
  );
  const { data, loading, error } = useQuery<
    RecentActivityData,
    RecentActivityVariables
  >(
    RECENT_ACTIVITY,
    { variables },
  );

  const entries = useMemo<ActivityEntry[]>(() => {
    const kills = (data?.kills?.nodes ?? []).map((kill) => ({
      id: kill.id,
      kind: 'kill' as const,
      time: kill.time,
      title: t('pages:activityPage.killSummary', {
        killer: kill.deathblow?.name ?? t('pages:activityPage.unknownPlayer'),
        victim: kill.victim.character?.name ?? t('pages:activityPage.unknownPlayer'),
      }),
      detail:
        kill.position.zone?.name ??
        kill.scenario?.name ??
        t('pages:activityPage.unknownLocation'),
      href: `/kill/${kill.id}`,
    }));
    const skirmishes = (data?.skirmishes?.nodes ?? []).map((skirmish) => ({
      id: skirmish.id,
      kind: 'skirmish' as const,
      time: skirmish.startTime,
      title:
        skirmish.scenario?.name ??
        skirmish.primaryZoneArea?.name ??
        skirmish.primaryZone?.name ??
        t('pages:activityPage.skirmish'),
      detail: t('pages:activityPage.skirmishSummary', {
        players: skirmish.numberOfPlayers,
        kills: skirmish.numberOfKills,
      }),
      href: `/skirmish/${skirmish.id}`,
    }));
    const instances = (data?.instanceRuns?.nodes ?? []).map((run) => ({
      id: run.id,
      kind: 'instance' as const,
      time: run.start,
      title: run.instance.name,
      detail: t('pages:activityPage.instanceSummary', {
        bosses: run.encounters.filter((encounter) => encounter.completed)
          .length,
        players: run.scoreboardEntries.length,
      }),
      href: `/instance-run/${run.id}`,
    }));

    return [...kills, ...skirmishes, ...instances].sort(
      (left, right) => Date.parse(right.time) - Date.parse(left.time),
    );
  }, [data, t]);

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
      <nav
        className="tabs is-boxed mb-4"
        aria-label={t('pages:killsPage.sections')}
      >
        <ul>
          <li>
            <Link to="/kills">{t('pages:killsPage.title')}</Link>
          </li>
          <li className="is-active">
            <Link to="/activity">{t('pages:activityPage.title')}</Link>
          </li>
        </ul>
      </nav>

      <section className="card mb-5" aria-labelledby="activity-page-title">
        <div className="card-content">
          <div className="activity-page-heading">
            <div>
              <h1 className="title is-3" id="activity-page-title">
                {t('pages:activityPage.title')}
              </h1>
              <p className="has-text-grey">
                {t('pages:activityPage.description')}
              </p>
            </div>
            <div className="activity-page-filters">
              <div className="field">
                <label className="label" htmlFor="activity-type">
                  {t('pages:activityPage.activityType')}
                </label>
                <div className="select">
                  <select
                    id="activity-type"
                    value={activityKind}
                    onChange={(event) =>
                      updateSearch(
                        'activityType',
                        event.target.value === 'all' ? '' : event.target.value,
                      )
                    }
                  >
                    {ACTIVITY_KIND_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option === 'all'
                          ? t('pages:activityPage.allActivityTypes')
                          : t(`pages:activityPage.types.${option}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="activity-period">
                  {t('pages:activityPage.period')}
                </label>
                <div className="select">
                  <select
                    id="activity-period"
                    value={period}
                    onChange={(event) =>
                      updateSearch('period', event.target.value)
                    }
                  >
                    {PERIOD_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {t(`components:killsFilters.${option}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="activity-time-zone">
                  {t('components:killsFilters.timeZone')}
                </label>
                <div className="select">
                  <select
                    id="activity-time-zone"
                    value={timeZoneMode}
                    onChange={(event) =>
                      updateSearch(
                        'timeZone',
                        event.target.value === 'local' ? 'local' : '',
                      )
                    }
                  >
                    <option value="altdorf">
                      {t('components:killsFilters.altdorfTime')}
                    </option>
                    <option value="local">
                      {t('components:killsFilters.computerTime')}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <p className="is-size-7 has-text-grey mt-4">
            {t('pages:activityPage.methodology')}
          </p>

          {loading && <progress className="progress mt-4" />}
          {error && <ErrorMessage name={error.name} message={error.message} />}
          {!loading && !error && entries.length === 0 && (
            <p className="has-text-grey mt-4">{t('common:noResults')}</p>
          )}
          {!loading && !error && entries.length > 0 && (
            <div className="activity-timeline mt-4">
              {entries.map((entry) => (
                <article className="activity-timeline-entry" key={`${entry.kind}-${entry.id}`}>
                  <time dateTime={entry.time}>
                    {formatKillTime(new Date(entry.time), timeZoneMode, 'full')}
                  </time>
                  <div className="activity-timeline-content">
                    <span className="tag is-dark">
                      {t(`pages:activityPage.types.${entry.kind}`)}
                    </span>
                    <Link to={entry.href} className="activity-timeline-title">
                      {entry.title}
                    </Link>
                    <span className="activity-timeline-detail">
                      {entry.detail}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
