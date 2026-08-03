import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router';
import { useMemo } from 'react';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import type { ReactElement } from 'react';
import clsx from 'clsx';
import {
  Archetype,
  Career,
  type InstanceRunScoreboardEntryFragment,
  type Query,
} from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { CareerIcon } from '@/components/CareerIcon';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { INSTANCE_RUN_SCOREBOARD_FRAGMENT } from '@/components/instance_run/InstanceRunScoreboard';

// Inspired by maartenson.net's per-dungeon Runs/Characters/Leaderboards
// tabs. That site tracks its own historical data with hourly graphs and a
// date-compare tool, which would need its own scraper and years of
// storage to replicate. Simpler approach here: the API already supports
// filtering instanceRuns by instanceId and returns each run's full
// scoreboard inline, so one request for the most recent RUNS_TO_LOAD runs
// is enough to derive all three tabs client-side. No new backend, cron,
// or cache.
const RUNS_TO_LOAD = 50;

const INSTANCE_HUB = gql`
  query InstanceHub($id: ID!, $instanceIdNum: UnsignedShort!, $first: Int) {
    instance(id: $id) {
      id
      name
    }
    instanceRuns(
      where: { instanceId: { eq: $instanceIdNum } }
      first: $first
      order: { start: DESC }
    ) {
      totalCount
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

  const { data, loading, error } = useQuery<Query>(INSTANCE_HUB, {
    skip: !id,
    variables: {
      first: RUNS_TO_LOAD,
      id,
      instanceIdNum: Number(id),
    },
  });

  const runs = (data?.instanceRuns?.nodes ?? []) as HubRun[];
  const instanceName = data?.instance?.name;

  const characters = useMemo(() => summarizeCharacters(runs), [runs]);

  const metric = (search.get('metric') as MetricKey | null) ?? 'damage';
  const role = (search.get('role') as RoleFilter | null) ?? 'all';
  const realm = (search.get('realm') as RealmFilter | null) ?? 'all';
  const leaderboard = useMemo(
    () => buildLeaderboard({ metric, realm, role, runs }),
    [runs, metric, role, realm],
  );

  // Computed from the loaded batch (not the connection's all-history
  // averageDuration/averageDeaths fields) so this stays consistent with
  // the "most recent N runs" framing above, and isn't skewed by the rare
  // run in the underlying data with a bogus multi-day end time.
  const averageDurationText = useMemo(() => {
    if (runs.length === 0) {
      return null;
    }
    const totalMs = runs.reduce(
      (sum, run) =>
        sum + (new Date(run.end).getTime() - new Date(run.start).getTime()),
      0,
    );
    return formatDuration(
      intervalToDuration({
        end: new Date(Math.round(totalMs / runs.length)),
        start: new Date(0),
      }),
    );
  }, [runs]);

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
            {t('pages:instanceHub.recentRunsNote', { count: runs.length })}
          </p>

          {tab === 'runs' && (
            <>
              <div className="card mb-5">
                <div className="card-content">
                  <div className="columns">
                    <div className="column">
                      <strong>{t('pages:instanceHub.totalRuns')}</strong>
                      <p>{data?.instanceRuns?.totalCount.toLocaleString()}</p>
                    </div>
                    <div className="column">
                      <strong>{t('pages:instanceRuns.averageDuration')}</strong>
                      <p>{averageDurationText}</p>
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
                <thead>
                  <tr>
                    <th>{t('pages:instanceHub.character')}</th>
                    <th>{t('pages:instanceHub.career')}</th>
                    <th align="right">{t('pages:instanceHub.runsCount')}</th>
                    <th>{t('pages:instanceHub.lastRun')}</th>
                    <th align="right">{t('pages:instanceHub.totalDamage')}</th>
                    <th align="right">{t('pages:instanceHub.totalHealing')}</th>
                    <th align="right">
                      {t('pages:instanceHub.totalProtection')}
                    </th>
                    <th align="right">{t('pages:instanceHub.totalDeaths')}</th>
                  </tr>
                </thead>
                <tbody>
                  {characters.map((character) => (
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
