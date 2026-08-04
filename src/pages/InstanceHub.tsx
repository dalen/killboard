import { gql } from '@apollo/client';
import { useApolloClient, useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import type { ReactElement } from 'react';
import clsx from 'clsx';
import {
  Archetype,
  Career,
  type InstanceRunFilterInput,
  type InstanceRunScoreboardEntryFragment,
  type Query,
} from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { CareerIcon } from '@/components/CareerIcon';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { SortConfigDirection, useSortableData } from '@/hooks/useSortableData';
import { parseFilterDate } from '@/components/scenario/ScenarioFilters';
import { INSTANCE_RUN_SCOREBOARD_FRAGMENT } from '@/components/instance_run/InstanceRunScoreboard';

// Inspired by maartenson.net's per-dungeon Runs/Characters/Leaderboards
// tabs. That site tracks its own historical data with hourly graphs and a
// date-compare tool, which would need its own scraper and years of
// storage to replicate. Simpler approach here: the API already supports
// filtering instanceRuns by instanceId AND by start date range, and
// returns each run's full scoreboard inline, so this page can page
// through the live API for whatever window is selected instead of
// standing up a new Worker/D1 cache. The default "Most recent 50" tab
// stays a single fast request; anything else (24h/7d/30d/90d/YTD/custom)
// walks the API in batches, the same trick already used by the Scenarios
// page's time-window loader.
const RUNS_TO_LOAD = 50;
const WINDOW_BATCH_SIZE = 50;
// Some instanceRuns rows never get a proper end timestamp written
// (abandoned/never-closed sessions); anything longer than this is treated as
// bad data rather than a real dungeon clear when averaging durations.
const MAX_PLAUSIBLE_DURATION_MS = 7 * 60 * 60 * 1000; // 7 hours

const INSTANCE_HUB_META = gql`
  query InstanceHubMeta($id: ID!) {
    instance(id: $id) {
      id
      name
    }
  }
`;

const INSTANCE_HUB_RUNS = gql`
  query InstanceHubRuns(
    $where: InstanceRunFilterInput!
    $first: Int
    $after: String
  ) {
    instanceRuns(
      where: $where
      first: $first
      after: $after
      order: { start: DESC }
    ) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        start
        end
        completed
        scoreboardEntries {
          ...InstanceRunScoreboardEntry
        }
      }
    }
  }
  ${INSTANCE_RUN_SCOREBOARD_FRAGMENT}
`;

// Every WAR career has an exact mirror in the other realm. There's no
// realm field on a scoreboard entry itself (only the character's guild
// has one, and not everyone is guilded), so this is a static lookup.
const ORDER_CAREERS = new Set<Career>([
  Career.Archmage,
  Career.BrightWizard,
  Career.Engineer,
  Career.IronBreaker,
  Career.KnightOfTheBlazingSun,
  Career.RunePriest,
  Career.ShadowWarrior,
  Career.Slayer,
  Career.SwordMaster,
  Career.WarriorPriest,
  Career.WhiteLion,
  Career.WitchHunter,
]);

type RangeKey = '24h' | '30d' | '7d' | '90d' | 'custom' | 'recent' | 'ytd';
type RealmFilter = 'all' | 'ORDER' | 'DESTRUCTION';
type RoleFilter = 'all' | Archetype;
type MetricKey = 'damage' | 'healing' | 'protection';

const careerRealm = (career: Career): 'ORDER' | 'DESTRUCTION' =>
  ORDER_CAREERS.has(career) ? 'ORDER' : 'DESTRUCTION';

interface HubRun {
  completed: boolean;
  end: string;
  id: string;
  scoreboardEntries: InstanceRunScoreboardEntryFragment[];
  start: string;
}

interface CharacterSummary {
  career: Career;
  id: string;
  lastRunStart: string;
  name: string;
  runCount: number;
  totalDamage: number;
  totalDeaths: number;
  totalHealing: number;
  totalProtection: number;
}

interface LeaderboardEntry {
  career: Career;
  characterId: string;
  level: number;
  name: string;
  renownRank: number;
  runId: string;
  value: number;
}

const summarizeCharacters = (runs: HubRun[]): CharacterSummary[] => {
  const byCharacter = new Map<string, CharacterSummary>();

  for (const run of runs) {
    for (const entry of run.scoreboardEntries) {
      const existing = byCharacter.get(entry.character.id);
      if (existing) {
        existing.runCount += 1;
        existing.totalDamage += Number(entry.damage);
        existing.totalHealing += Number(entry.healing);
        existing.totalProtection += Number(entry.protection);
        existing.totalDeaths += Number(entry.deaths);
        if (run.start > existing.lastRunStart) {
          existing.lastRunStart = run.start;
          existing.career = entry.character.career;
        }
      } else {
        byCharacter.set(entry.character.id, {
          career: entry.character.career,
          id: entry.character.id,
          lastRunStart: run.start,
          name: entry.character.name,
          runCount: 1,
          totalDamage: Number(entry.damage),
          totalDeaths: Number(entry.deaths),
          totalHealing: Number(entry.healing),
          totalProtection: Number(entry.protection),
        });
      }
    }
  }

  return [...byCharacter.values()].toSorted(
    (a, b) =>
      b.runCount - a.runCount || (a.lastRunStart < b.lastRunStart ? 1 : -1),
  );
};

// "Best performance" leaderboard: one row per character, their single
// highest value for the metric across loaded runs (not a sum) - matches
// how maartenson's Leaderboards tab reads.
const buildLeaderboard = ({
  runs,
  metric,
  role,
  realm,
}: {
  runs: HubRun[];
  metric: MetricKey;
  role: RoleFilter;
  realm: RealmFilter;
}): LeaderboardEntry[] => {
  const best = new Map<string, LeaderboardEntry>();

  for (const run of runs) {
    for (const entry of run.scoreboardEntries) {
      const matchesRole = role === 'all' || entry.archetype === role;
      const matchesRealm =
        realm === 'all' || careerRealm(entry.character.career) === realm;
      if (matchesRole && matchesRealm) {
        const value = Number(entry[metric]);
        const current = best.get(entry.character.id);
        if (!current || value > current.value) {
          best.set(entry.character.id, {
            career: entry.character.career,
            characterId: entry.character.id,
            level: Number(entry.level),
            name: entry.character.name,
            renownRank: Number(entry.renownRank),
            runId: run.id,
            value,
          });
        }
      }
    }
  }

  return [...best.values()].toSorted((a, b) => b.value - a.value);
};

const formatDurationBetween = (start: string, end: string): string =>
  formatDuration(
    intervalToDuration({ end: new Date(end), start: new Date(start) }),
  );

// Undefined start/end means "recent" mode (no date filter at all - handled
// by the fast single-request path instead of the windowed loader).
const getHubTimeWindow = (
  search: URLSearchParams,
): { end?: Date; start?: Date } | undefined => {
  const range = (search.get('range') as RangeKey | null) ?? 'recent';
  const now = new Date();
  now.setMinutes(Math.floor(now.getMinutes() / 5) * 5, 0, 0);

  switch (range) {
    case '24h': {
      return { end: now, start: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
    }
    case '7d': {
      return {
        end: now,
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      };
    }
    case '30d': {
      return {
        end: now,
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };
    }
    case '90d': {
      return {
        end: now,
        start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      };
    }
    case 'ytd': {
      return { end: now, start: new Date(now.getFullYear(), 0, 1) };
    }
    case 'custom': {
      const from = search.get('from');
      const to = search.get('to');
      return {
        end: to ? parseFilterDate(to, true) : now,
        start: from ? parseFilterDate(from, false) : undefined,
      };
    }
    default: {
      return undefined;
    }
  }
};

const buildRunsWhere = (
  instanceIdNum: number,
  window?: { end?: Date; start?: Date },
): InstanceRunFilterInput => ({
  instanceId: { eq: instanceIdNum },
  ...(window?.start || window?.end
    ? {
        start: {
          ...(window.start && !Number.isNaN(window.start.getTime())
            ? { gte: window.start.toISOString() }
            : {}),
          ...(window.end && !Number.isNaN(window.end.getTime())
            ? { lte: window.end.toISOString() }
            : {}),
        },
      }
    : {}),
});

const RANGE_LABEL_KEYS: Record<RangeKey, string> = {
  '24h': 'pages:instanceHub.range24h',
  '7d': 'pages:instanceHub.range7d',
  '30d': 'pages:instanceHub.range30d',
  '90d': 'pages:instanceHub.range90d',
  custom: 'pages:instanceHub.rangeCustom',
  recent: 'pages:instanceHub.rangeRecent',
  ytd: 'pages:instanceHub.rangeYtd',
};

export const InstanceHub = ({
  tab,
}: {
  tab: 'characters' | 'leaderboards' | 'runs';
}): ReactElement => {
  const { id } = useParams();
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;
  const client = useApolloClient();

  const { data: metaData } = useQuery<Query>(INSTANCE_HUB_META, {
    skip: !id,
    variables: { id },
  });
  const instanceName = metaData?.instance?.name;

  const range = (search.get('range') as RangeKey | null) ?? 'recent';
  const isWindowed = range !== 'recent';
  const timeWindow = getHubTimeWindow(search);
  const windowKey = `${range}|${search.get('from') ?? ''}|${search.get('to') ?? ''}`;

  const {
    data: recentData,
    loading: recentLoading,
    error: recentError,
  } = useQuery<Query>(INSTANCE_HUB_RUNS, {
    skip: !id || isWindowed,
    variables: {
      first: RUNS_TO_LOAD,
      where: buildRunsWhere(Number(id)),
    },
  });

  const [windowRuns, setWindowRuns] = useState<HubRun[]>([]);
  const [windowTotal, setWindowTotal] = useState(0);
  const [windowLoading, setWindowLoading] = useState(false);
  const [windowError, setWindowError] = useState<Error>();

  useEffect(() => {
    if (!isWindowed || !id) {
      setWindowRuns([]);
      setWindowTotal(0);
      setWindowLoading(false);
      setWindowError(undefined);
      return;
    }

    let cancelled = false;
    let total: number | undefined;
    const controller = new AbortController();
    const instanceIdNum = Number(id);
    const where = buildRunsWhere(instanceIdNum, timeWindow);

    // Cursors from this API are base64-encoded zero-based offsets, so an
    // arbitrary [start, start + count) window can be requested directly.
    const encodeOffset = (offset: number): string | undefined =>
      offset > 0 ? btoa(String(offset - 1)) : undefined;

    // A single malformed row nulls out the whole array it's in under
    // GraphQL's non-null propagation rules. Rather than losing an entire
    // batch when that happens, split the failing range in half and retry
    // each half until the bad row(s) are isolated.
    const fetchRange = async (
      start: number,
      count: number,
    ): Promise<{ nodes: HubRun[]; total: number }> => {
      if (count <= 0) {
        return { nodes: [], total: 0 };
      }
      const result = await client.query<Query>({
        context: { fetchOptions: { signal: controller.signal } },
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
        query: INSTANCE_HUB_RUNS,
        variables: { after: encodeOffset(start), first: count, where },
      });
      const connection = result.data?.instanceRuns;
      if (!connection) {
        return { nodes: [], total: 0 };
      }
      if (connection.nodes) {
        return {
          nodes: connection.nodes as HubRun[],
          total: connection.totalCount,
        };
      }
      if (count === 1) {
        return { nodes: [], total: connection.totalCount };
      }
      const half = Math.ceil(count / 2);
      const left = await fetchRange(start, half);
      const right = await fetchRange(start + half, count - half);
      return {
        nodes: [...left.nodes, ...right.nodes],
        total: left.total || right.total,
      };
    };

    const loadWindow = async (): Promise<void> => {
      setWindowRuns([]);
      setWindowTotal(0);
      setWindowError(undefined);
      setWindowLoading(true);
      let offset = 0;
      const accumulated: HubRun[] = [];

      try {
        do {
          const { nodes, total: batchTotal } = await fetchRange(
            offset,
            WINDOW_BATCH_SIZE,
          );
          accumulated.push(...nodes);
          offset += WINDOW_BATCH_SIZE;
          if (total === undefined) {
            total = batchTotal;
            if (!cancelled) {
              setWindowTotal(batchTotal);
            }
          }
          if (!cancelled) {
            setWindowRuns([...accumulated]);
          }
          if (total === undefined || offset >= total) {
            break;
          }
        } while (!cancelled);
      } catch (caughtError) {
        if (!cancelled && !controller.signal.aborted) {
          setWindowError(
            caughtError instanceof Error
              ? caughtError
              : new Error('Unable to load the selected time window.'),
          );
        }
      } finally {
        if (!cancelled) {
          setWindowLoading(false);
        }
      }
    };

    void loadWindow();
    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, id, isWindowed, windowKey]);

  const loading = isWindowed
    ? windowLoading && windowRuns.length === 0
    : recentLoading;
  const error = isWindowed ? windowError : recentError;
  const runs = (
    isWindowed ? windowRuns : (recentData?.instanceRuns?.nodes ?? [])
  ) as HubRun[];
  const totalCount = isWindowed
    ? windowTotal
    : (recentData?.instanceRuns?.totalCount ?? 0);

  const characters = useMemo(() => summarizeCharacters(runs), [runs]);
  const {
    items: sortedCharacters,
    requestSort: requestCharacterSort,
    sortConfig: characterSortConfig,
  } = useSortableData(characters, {
    direction: SortConfigDirection.descending,
    key: 'runCount',
  });
  const getCharacterSortClass = (key: string): string => {
    if (!characterSortConfig || characterSortConfig.key !== key) {
      return '';
    }
    return characterSortConfig.direction;
  };

  const metric = (search.get('metric') as MetricKey | null) ?? 'damage';
  const role = (search.get('role') as RoleFilter | null) ?? 'all';
  const realm = (search.get('realm') as RealmFilter | null) ?? 'all';
  const leaderboard = useMemo(
    () => buildLeaderboard({ metric, realm, role, runs }),
    [runs, metric, role, realm],
  );

  // Computed from the loaded batch (not the connection's all-history
  // averageDuration/averageDeaths fields) so this stays consistent with
  // whichever window is currently displayed. Some runs never get a proper
  // end timestamp written (abandoned/never-closed sessions) and can carry a
  // multi-day duration that would badly skew a plain average, so anything
  // over 7 hours - implausible for a real dungeon clear - is excluded and
  // counted separately.
  const durationStats = useMemo(() => {
    if (runs.length === 0) {
      return null;
    }
    const durationsMs = runs
      .map(
        (run) => new Date(run.end).getTime() - new Date(run.start).getTime(),
      )
      .filter((ms) => Number.isFinite(ms) && ms >= 0);
    const saneDurationsMs = durationsMs.filter(
      (ms) => ms <= MAX_PLAUSIBLE_DURATION_MS,
    );

    if (saneDurationsMs.length === 0) {
      return null;
    }

    return {
      excluded: durationsMs.length - saneDurationsMs.length,
      text: formatDuration(
        intervalToDuration({
          end: new Date(
            Math.round(
              saneDurationsMs.reduce((a, b) => a + b, 0) /
                saneDurationsMs.length,
            ),
          ),
          start: new Date(0),
        }),
      ),
    };
  }, [runs]);
  const averageDurationText = durationStats?.text ?? null;

  const averageDeaths =
    runs.length === 0
      ? null
      : (
          runs.reduce(
            (sum, run) =>
              sum +
              run.scoreboardEntries.reduce(
                (deaths, entry) => deaths + Number(entry.deaths),
                0,
              ),
            0,
          ) / runs.length
        ).toFixed(1);

  const setRange = (nextRange: RangeKey): void => {
    if (nextRange === 'custom') {
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      search.set('range', 'custom');
      search.set(
        'from',
        search.get('from') ?? sevenDaysAgo.toISOString().slice(0, 10),
      );
      search.set('to', search.get('to') ?? today.toISOString().slice(0, 10));
    } else {
      if (nextRange === 'recent') {
        search.delete('range');
      } else {
        search.set('range', nextRange);
      }
      search.delete('from');
      search.delete('to');
    }
    setSearch(search);
  };

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/instances">{t('common:instances')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/instance/${id}`}>
              {instanceName ?? t('pages:instanceHub.title')}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="tabs">
        <li className={tab === 'runs' ? 'is-active' : ''}>
          <Link to={`/instance/${id}`}>{t('pages:instanceHub.runsTab')}</Link>
        </li>
        <li className={tab === 'characters' ? 'is-active' : ''}>
          <Link to={`/instance/${id}/characters`}>
            {t('pages:instanceHub.charactersTab')}
          </Link>
        </li>
        <li className={tab === 'leaderboards' ? 'is-active' : ''}>
          <Link to={`/instance/${id}/leaderboards`}>
            {t('pages:instanceHub.leaderboardsTab')}
          </Link>
        </li>
      </div>

      <div className="filter-grid">
        <label>
          <span>{t('pages:instanceHub.time')}</span>
          <div className="select">
            <select
              value={range}
              onChange={(event) => {
                setRange(event.target.value as RangeKey);
              }}
            >
              <option value="recent">
                {t('pages:instanceHub.rangeRecent')}
              </option>
              <option value="24h">{t('pages:instanceHub.range24h')}</option>
              <option value="7d">{t('pages:instanceHub.range7d')}</option>
              <option value="30d">{t('pages:instanceHub.range30d')}</option>
              <option value="90d">{t('pages:instanceHub.range90d')}</option>
              <option value="ytd">{t('pages:instanceHub.rangeYtd')}</option>
              <option value="custom">
                {t('pages:instanceHub.rangeCustom')}
              </option>
            </select>
          </div>
        </label>
        {range === 'custom' && (
          <>
            <label>
              <span>{t('pages:instanceHub.startDate')}</span>
              <input
                className="input"
                type="date"
                value={(search.get('from') ?? '').slice(0, 10)}
                onChange={(event) => {
                  search.set('from', event.target.value);
                  setSearch(search);
                }}
              />
            </label>
            <label>
              <span>{t('pages:instanceHub.endDate')}</span>
              <input
                className="input"
                type="date"
                value={(search.get('to') ?? '').slice(0, 10)}
                onChange={(event) => {
                  search.set('to', event.target.value);
                  setSearch(search);
                }}
              />
            </label>
          </>
        )}
      </div>

      {loading && <progress className="progress" />}
      {!loading && error && (
        <ErrorMessage name={error.name} message={error.message} />
      )}
      {!loading && !error && runs.length === 0 && (
        <ErrorMessage customText={t('common:noResults')} />
      )}
      {!loading && !error && runs.length > 0 && (
        <>
          <p className="is-size-7 has-text-grey mb-4">
            {isWindowed
              ? t('pages:instanceHub.rangeRunsNote', {
                  count: runs.length,
                  rangeLabel: t(RANGE_LABEL_KEYS[range]),
                })
              : t('pages:instanceHub.recentRunsNote', { count: runs.length })}
            {isWindowed && windowLoading && (
              <>
                {' · '}
                {t('pages:instanceHub.gatheringRuns', {
                  loaded: runs.length,
                  total: windowTotal || '…',
                })}
              </>
            )}
          </p>

          {tab === 'runs' && (
            <>
              <div className="card mb-5">
                <div className="card-content">
                  <div className="columns">
                    <div className="column">
                      <strong>{t('pages:instanceHub.totalRuns')}</strong>
                      <p>{totalCount.toLocaleString()}</p>
                    </div>
                    <div className="column">
                      <strong>{t('pages:instanceRuns.averageDuration')}</strong>
                      <p>
                        {averageDurationText ??
                          t('pages:instanceRuns.averageDurationUnavailable')}
                      </p>
                      {durationStats != null && durationStats.excluded > 0 && (
                        <p className="is-size-7 has-text-grey">
                          {t('pages:instanceHub.durationOutliersExcluded', {
                            count: durationStats.excluded,
                          })}
                        </p>
                      )}
                    </div>
                    <div className="column">
                      <strong>{t('pages:instanceRuns.averageDeaths')}</strong>
                      <p>{averageDeaths}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-container">
                <table
                  className={clsx(
                    'table',
                    'is-striped',
                    'is-hoverable',
                    isMobile ? 'is-narrow' : 'is-fullwidth',
                  )}
                >
                  <thead>
                    <tr>
                      <th>{t('pages:instanceRuns.startTime')}</th>
                      <th>{t('pages:instanceRuns.duration')}</th>
                      <th>{t('pages:instanceHub.completed')}</th>
                      <th align="center">{t('pages:instanceRuns.deaths')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((run) => (
                      <tr key={run.id}>
                        <td>
                          <small>
                            {format(new Date(run.start), 'yyyy-MM-dd HH:mm')}
                          </small>
                        </td>
                        <td>{formatDurationBetween(run.start, run.end)}</td>
                        <td>
                          {run.completed
                            ? t('pages:instanceHub.completed')
                            : t('pages:instanceHub.notCompleted')}
                        </td>
                        <td align="center">
                          {run.scoreboardEntries
                            .map((entry) => Number(entry.deaths))
                            .reduce((a, b) => a + b, 0)}
                        </td>
                        <td>
                          <Link
                            to={`/instance-run/${run.id}`}
                            className="button is-primary p-2 is-pulled-right"
                          >
                            {t('common:details')}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'characters' && (
            <div className="table-container">
              <table
                className={clsx(
                  'table',
                  'is-striped',
                  'is-hoverable',
                  isMobile ? 'is-narrow' : 'is-fullwidth',
                )}
              >
                <thead className="is-relative">
                  <tr>
                    <th
                      className={clsx(
                        'is-clickable',
                        'has-text-link',
                        getCharacterSortClass('name'),
                      )}
                      onClick={() => requestCharacterSort('name')}
                    >
                      {t('pages:instanceHub.character')}
                    </th>
                    <th
                      className={clsx(
                        'is-clickable',
                        'has-text-link',
                        getCharacterSortClass('career'),
                      )}
                      onClick={() => requestCharacterSort('career')}
                    >
                      {t('pages:instanceHub.career')}
                    </th>
                    <th
                      align="right"
                      className={clsx(
                        'is-clickable',
                        'has-text-link',
                        getCharacterSortClass('runCount'),
                      )}
                      onClick={() => requestCharacterSort('runCount')}
                    >
                      {t('pages:instanceHub.runsCount')}
                    </th>
                    <th
                      className={clsx(
                        'is-clickable',
                        'has-text-link',
                        getCharacterSortClass('lastRunStart'),
                      )}
                      onClick={() => requestCharacterSort('lastRunStart')}
                    >
                      {t('pages:instanceHub.lastRun')}
                    </th>
                    <th
                      align="right"
                      className={clsx(
                        'is-clickable',
                        'has-text-link',
                        getCharacterSortClass('totalDamage'),
                      )}
                      onClick={() => requestCharacterSort('totalDamage')}
                    >
                      {t('pages:instanceHub.totalDamage')}
                    </th>
                    <th
                      align="right"
                      className={clsx(
                        'is-clickable',
                        'has-text-link',
                        getCharacterSortClass('totalHealing'),
                      )}
                      onClick={() => requestCharacterSort('totalHealing')}
                    >
                      {t('pages:instanceHub.totalHealing')}
                    </th>
                    <th
                      align="right"
                      className={clsx(
                        'is-clickable',
                        'has-text-link',
                        getCharacterSortClass('totalProtection'),
                      )}
                      onClick={() => requestCharacterSort('totalProtection')}
                    >
                      {t('pages:instanceHub.totalProtection')}
                    </th>
                    <th
                      align="right"
                      className={clsx(
                        'is-clickable',
                        'has-text-link',
                        getCharacterSortClass('totalDeaths'),
                      )}
                      onClick={() => requestCharacterSort('totalDeaths')}
                    >
                      {t('pages:instanceHub.totalDeaths')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCharacters.map((character) => (
                    <tr key={character.id}>
                      <td>
                        <Link to={`/character/${character.id}`}>
                          {character.name}
                        </Link>
                      </td>
                      <td>
                        <span className="icon-text">
                          <CareerIcon career={character.career} />
                          {t(`enums:career.${character.career}`)}
                        </span>
                      </td>
                      <td align="right">{character.runCount}</td>
                      <td>
                        <small>
                          {format(
                            new Date(character.lastRunStart),
                            'yyyy-MM-dd HH:mm',
                          )}
                        </small>
                      </td>
                      <td align="right">
                        {character.totalDamage.toLocaleString()}
                      </td>
                      <td align="right">
                        {character.totalHealing.toLocaleString()}
                      </td>
                      <td align="right">
                        {character.totalProtection.toLocaleString()}
                      </td>
                      <td align="right">{character.totalDeaths}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'leaderboards' && (
            <>
              <div className="filter-grid">
                <label>
                  <span>{t('pages:instanceHub.metric')}</span>
                  <div className="select">
                    <select
                      value={metric}
                      onChange={(event) => {
                        search.set('metric', event.target.value);
                        setSearch(search);
                      }}
                    >
                      <option value="damage">
                        {t('pages:instanceHub.damage')}
                      </option>
                      <option value="healing">
                        {t('pages:instanceHub.healing')}
                      </option>
                      <option value="protection">
                        {t('pages:instanceHub.protection')}
                      </option>
                    </select>
                  </div>
                </label>
                <label>
                  <span>{t('pages:instanceHub.role')}</span>
                  <div className="select">
                    <select
                      value={role}
                      onChange={(event) => {
                        search.set('role', event.target.value);
                        setSearch(search);
                      }}
                    >
                      <option value="all">{t('pages:instanceHub.any')}</option>
                      <option value={Archetype.Tank}>
                        {t('pages:instanceHub.tank')}
                      </option>
                      <option value={Archetype.Healer}>
                        {t('pages:instanceHub.healer')}
                      </option>
                      <option value={Archetype.MeleeDps}>
                        {t('pages:instanceHub.dps')}
                      </option>
                      <option value={Archetype.RangedDps}>
                        {t('pages:instanceHub.dps')}
                      </option>
                    </select>
                  </div>
                </label>
                <label>
                  <span>{t('pages:instanceHub.realm')}</span>
                  <div className="select">
                    <select
                      value={realm}
                      onChange={(event) => {
                        search.set('realm', event.target.value);
                        setSearch(search);
                      }}
                    >
                      <option value="all">{t('pages:instanceHub.any')}</option>
                      <option value="ORDER">{t('common:realmOrder')}</option>
                      <option value="DESTRUCTION">
                        {t('common:realmDestruction')}
                      </option>
                    </select>
                  </div>
                </label>
              </div>
              <div className="table-container">
                <table
                  className={clsx(
                    'table',
                    'is-striped',
                    'is-hoverable',
                    isMobile ? 'is-narrow' : 'is-fullwidth',
                  )}
                >
                  <thead>
                    <tr>
                      <th align="right">{t('pages:instanceHub.rank')}</th>
                      <th>{t('pages:instanceHub.character')}</th>
                      <th>{t('pages:instanceHub.career')}</th>
                      <th align="right">{t('pages:instanceHub.level')}</th>
                      <th align="right">{t(`pages:instanceHub.${metric}`)}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.characterId}>
                        <td align="right">{index + 1}</td>
                        <td>
                          <Link to={`/character/${entry.characterId}`}>
                            {entry.name}
                          </Link>
                        </td>
                        <td>
                          <span className="icon-text">
                            <CareerIcon career={entry.career} />
                            {t(`enums:career.${entry.career}`)}
                          </span>
                        </td>
                        <td align="right">
                          CR {entry.level} · RR {entry.renownRank}
                        </td>
                        <td align="right">{entry.value.toLocaleString()}</td>
                        <td>
                          <Link
                            to={`/instance-run/${entry.runId}`}
                            className="button is-primary p-2 is-pulled-right"
                          >
                            {t('pages:instanceHub.bestRun')}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
