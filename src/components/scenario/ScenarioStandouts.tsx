import { type ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Career, type ScenarioRecord } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import {
  type ScenarioRole,
  scenarioCareerName,
  scenarioCareerRoles,
  scenarioRoleOrder,
} from '@/components/scenario/scenarioRoles';
import { assetUrl } from '@/utils';

type RealmFilter = 'both' | 'order' | 'destruction';
type RoleFilter = 'all' | ScenarioRole;
type CareerFilter = 'all' | Career;
type RankingMode = 'totals' | 'average';
type TableSortKey =
  | 'overall'
  | 'career'
  | 'name'
  | 'scenarios'
  | 'wins'
  | 'winRate'
  | 'kills'
  | 'killDamage'
  | 'damage'
  | 'deathBlows'
  | 'healing'
  | 'protection'
  | 'objectiveScore';
type RankingMetric =
  | 'overall'
  | 'wins'
  | 'winRate'
  | 'kills'
  | 'killDamage'
  | 'damage'
  | 'deathBlows'
  | 'healing'
  | 'protection'
  | 'objectiveScore';

interface Standout {
  career: Career;
  characterId: string;
  damage: number;
  deathBlows: number;
  healing: number;
  killDamage: number;
  kills: number;
  name: string;
  objectiveScore: number;
  overall: number;
  protection: number;
  scenarios: number;
  winRate: number;
  wins: number;
}

const metricLabels: Record<RankingMetric, string> = {
  overall: 'Overall contribution',
  wins: 'Wins',
  winRate: 'Win rate',
  kills: 'Kills',
  killDamage: 'Kill damage',
  damage: 'Damage',
  deathBlows: 'Death blows',
  healing: 'Healing',
  protection: 'Protection',
  objectiveScore: 'Objective score',
};

const rankingMetrics = Object.keys(metricLabels) as RankingMetric[];
const realmFilters: RealmFilter[] = ['both', 'order', 'destruction'];
const roleFilters: RoleFilter[] = ['all', ...scenarioRoleOrder];

const compactNumber = (value: number): string =>
  new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
    notation: 'compact',
  }).format(value);

const dateInputValue = (date: Date): string => {
  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60 * 1000,
  );
  return offsetDate.toISOString().slice(0, 10);
};

const getStandouts = ({
  career,
  limit,
  metric,
  minimumScenarios,
  mode,
  role,
  scenarios,
  team,
}: {
  career: CareerFilter;
  limit: number;
  metric: RankingMetric;
  minimumScenarios: number;
  mode: RankingMode;
  role: RoleFilter;
  scenarios: ScenarioRecord[];
  team: number;
}): Standout[] => {
  const characters = new Map<string, Omit<Standout, 'overall' | 'winRate'>>();

  for (const scenario of scenarios) {
    for (const entry of scenario.scoreboardEntries) {
      if (entry.team === team) {
        const current = characters.get(entry.character.id) ?? {
          career: entry.character.career,
          characterId: entry.character.id,
          damage: 0,
          deathBlows: 0,
          healing: 0,
          killDamage: 0,
          kills: 0,
          name: entry.character.name,
          objectiveScore: 0,
          protection: 0,
          scenarios: 0,
          wins: 0,
        };

        current.damage += entry.damage;
        current.deathBlows += entry.deathBlows;
        current.healing += entry.healing;
        current.killDamage += entry.killDamage;
        current.kills += entry.kills;
        current.objectiveScore += entry.objectiveScore;
        current.protection += entry.protection;
        current.scenarios += 1;
        current.wins += scenario.winner === team ? 1 : 0;
        characters.set(entry.character.id, current);
      }
    }
  }

  const values = [...characters.values()].filter(
    (value) =>
      value.scenarios >= minimumScenarios &&
      (role === 'all' || scenarioCareerRoles[value.career] === role) &&
      (career === 'all' || value.career === career),
  );
  const maximums = {
    damage: Math.max(...values.map((value) => value.damage), 1),
    healing: Math.max(...values.map((value) => value.healing), 1),
    killDamage: Math.max(...values.map((value) => value.killDamage), 1),
    objectiveScore: Math.max(...values.map((value) => value.objectiveScore), 1),
    protection: Math.max(...values.map((value) => value.protection), 1),
  };

  return values
    .map((value) => {
      const primaryContribution = Math.max(
        value.damage / maximums.damage,
        value.healing / maximums.healing,
        value.killDamage / maximums.killDamage,
        value.objectiveScore / maximums.objectiveScore,
        value.protection / maximums.protection,
      );
      const winRate = value.wins / value.scenarios;

      return Object.assign(value, {
        overall:
          primaryContribution * 0.65 +
          winRate * 0.2 +
          (value.scenarios / scenarios.length) * 0.15,
        winRate,
      });
    })
    .toSorted(
      (left, right) => {
        const metricValue = (standout: Standout): number => {
          if (
            mode === 'average' &&
            !['overall', 'scenarios', 'wins', 'winRate'].includes(metric)
          ) {
            return standout[metric] / standout.scenarios;
          }
          return standout[metric];
        };

        return (
          metricValue(right) - metricValue(left) ||
        right.scenarios - left.scenarios ||
          right.kills - left.kills
        );
      },
    )
    .slice(0, limit);
};

interface ScenarioBreakdownEntry {
  averageDurationSeconds: number;
  averagePlayers: number;
  destructionWins: number;
  id: string;
  matches: ScenarioRecord[];
  name: string;
  orderWins: number;
  topPlayer?: Standout;
}

const ScenarioBreakdown = ({
  scenarios,
}: {
  scenarios: ScenarioRecord[];
}): ReactElement => {
  const [expandedScenarioId, setExpandedScenarioId] = useState<string>();
  const breakdown = useMemo(() => {
    const grouped = new Map<
      string,
      {
        durationSeconds: number;
        id: string;
        matches: ScenarioRecord[];
        name: string;
        orderWins: number;
        destructionWins: number;
        players: number;
      }
    >();

    for (const scenario of scenarios) {
      const key = scenario.scenario.id;
      const current = grouped.get(key) ?? {
        destructionWins: 0,
        durationSeconds: 0,
        id: key,
        matches: [],
        name: scenario.scenario.name,
        orderWins: 0,
        players: 0,
      };
      current.matches.push(scenario);
      current.players += scenario.numPlayers;
      current.durationSeconds += Math.max(
        0,
        (new Date(scenario.endTime).getTime() -
          new Date(scenario.startTime).getTime()) /
          1000,
      );
      if (scenario.winner === 0) {
        current.orderWins += 1;
      } else if (scenario.winner === 1) {
        current.destructionWins += 1;
      }
      grouped.set(key, current);
    }

    return [...grouped.values()]
      .map((group): ScenarioBreakdownEntry => {
        const topPlayers = [
          ...getStandouts({
            career: 'all',
            limit: 1,
            metric: 'overall',
            minimumScenarios: 1,
            mode: 'totals',
            role: 'all',
            scenarios: group.matches,
            team: 0,
          }),
          ...getStandouts({
            career: 'all',
            limit: 1,
            metric: 'overall',
            minimumScenarios: 1,
            mode: 'totals',
            role: 'all',
            scenarios: group.matches,
            team: 1,
          }),
        ].toSorted(
          (left, right) =>
            right.overall - left.overall ||
            right.scenarios - left.scenarios ||
            right.kills - left.kills,
        );

        return {
          averageDurationSeconds:
            group.durationSeconds / Math.max(group.matches.length, 1),
          averagePlayers: group.players / Math.max(group.matches.length, 1),
          destructionWins: group.destructionWins,
          id: group.id,
          matches: group.matches.toSorted(
            (left, right) =>
              new Date(right.startTime).getTime() -
              new Date(left.startTime).getTime(),
          ),
          name: group.name,
          orderWins: group.orderWins,
          topPlayer: topPlayers[0],
        };
      })
      .toSorted(
        (left, right) =>
          right.matches.length - left.matches.length ||
          left.name.localeCompare(right.name),
      );
  }, [scenarios]);

  if (breakdown.length === 0) {
    return <></>;
  }

  return (
    <section className="scenario-breakdown mb-4">
      <header>
        <div>
          <h2>Scenario Breakdown</h2>
          <p>Activity and realm balance for the selected time window.</p>
        </div>
        <span>{breakdown.length} scenarios played</span>
      </header>
      <div className="scenario-breakdown-table-wrap">
        <table className="table is-fullwidth scenario-breakdown-table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Matches</th>
              <th>Order</th>
              <th>Destruction</th>
              <th>Avg. players</th>
              <th>Avg. duration</th>
              <th>Top contributor</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((entry) => {
              const completedMatches =
                entry.orderWins + entry.destructionWins;
              const orderRate =
                completedMatches > 0
                  ? Math.round((entry.orderWins / completedMatches) * 100)
                  : 0;
              const destructionRate =
                completedMatches > 0
                  ? Math.round((entry.destructionWins / completedMatches) * 100)
                  : 0;
              const isExpanded = expandedScenarioId === entry.id;

              return (
                <ScenarioBreakdownRows
                  key={entry.id}
                  destructionRate={destructionRate}
                  entry={entry}
                  isExpanded={isExpanded}
                  orderRate={orderRate}
                  onToggle={() => {
                    setExpandedScenarioId(isExpanded ? undefined : entry.id);
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const ScenarioBreakdownRows = ({
  destructionRate,
  entry,
  isExpanded,
  onToggle,
  orderRate,
}: {
  destructionRate: number;
  entry: ScenarioBreakdownEntry;
  isExpanded: boolean;
  onToggle: () => void;
  orderRate: number;
}): ReactElement => {
  const durationMinutes = Math.floor(entry.averageDurationSeconds / 60);
  const durationSeconds = Math.round(entry.averageDurationSeconds % 60);

  return (
    <>
      <tr>
        <td>
          <button
            type="button"
            className="scenario-breakdown-toggle"
            aria-expanded={isExpanded}
            onClick={onToggle}
          >
            <i
              className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}
              aria-hidden="true"
            />
            {entry.name}
          </button>
        </td>
        <td>{entry.matches.length}</td>
        <td className="scenario-breakdown-order">
          {orderRate}% <small>({entry.orderWins})</small>
        </td>
        <td className="scenario-breakdown-destruction">
          {destructionRate}% <small>({entry.destructionWins})</small>
        </td>
        <td>{entry.averagePlayers.toFixed(1)}</td>
        <td>
          {durationMinutes}m {durationSeconds}s
        </td>
        <td>
          {entry.topPlayer ? (
            <Link to={`/character/${entry.topPlayer.characterId}`}>
              {entry.topPlayer.name}
            </Link>
          ) : (
            '—'
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr className="scenario-breakdown-matches">
          <td colSpan={7}>
            <div>
              {entry.matches.slice(0, 50).map((match) => (
                <Link key={match.id} to={`/scenario/${match.id}`}>
                  <span>
                    {new Date(match.startTime).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                  <strong>
                    {match.winner === 0
                      ? 'Order'
                      : match.winner === 1
                        ? 'Destruction'
                        : 'Draw'}
                  </strong>
                  <span>{match.numPlayers} players</span>
                </Link>
              ))}
              {entry.matches.length > 50 && (
                <p>
                  Showing the 50 most recent of {entry.matches.length} matches.
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const StandoutTable = ({
  career,
  limit,
  metric,
  minimumScenarios,
  mode,
  realm,
  role,
  scenarios,
  sortable = false,
  team,
  onExpand,
  onSelectPlayer,
}: {
  career: CareerFilter;
  limit: number;
  metric: RankingMetric;
  minimumScenarios: number;
  mode: RankingMode;
  realm: 'Order' | 'Destruction';
  role: RoleFilter;
  scenarios: ScenarioRecord[];
  sortable?: boolean;
  team: number;
  onExpand?: () => void;
  onSelectPlayer?: (standout: Standout, realm: 'Order' | 'Destruction') => void;
}): ReactElement => {
  const [sortKey, setSortKey] = useState<TableSortKey>(metric);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const standouts = getStandouts({
    career,
    limit,
    metric,
    minimumScenarios,
    mode,
    role,
    scenarios,
    team,
  });
  const sortableValue = (standout: Standout, key: TableSortKey): number => {
    const value = standout[key];
    if (
      typeof value === 'number' &&
      mode === 'average' &&
      !['overall', 'scenarios', 'wins', 'winRate'].includes(key)
    ) {
      return value / standout.scenarios;
    }
    return typeof value === 'number' ? value : 0;
  };
  const sortedStandouts = sortable
    ? standouts.toSorted((left, right) => {
        let result = 0;
        if (sortKey === 'name') {
          result = left.name.localeCompare(right.name);
        } else if (sortKey === 'career') {
          result = scenarioCareerName(left.career).localeCompare(
            scenarioCareerName(right.career),
          );
        } else {
          result =
            sortableValue(left, sortKey) - sortableValue(right, sortKey);
        }

        return (
          (sortDirection === 'asc' ? result : -result) ||
          left.name.localeCompare(right.name)
        );
      })
    : standouts;
  const wins = scenarios.filter((scenario) => scenario.winner === team).length;
  const contributionValue = (value: number, standout: Standout): number =>
    mode === 'average' ? value / standout.scenarios : value;
  const sortBy = (key: TableSortKey): void => {
    if (key === sortKey) {
      setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDirection(key === 'name' || key === 'career' ? 'asc' : 'desc');
    }
  };
  const heading = (
    label: string,
    key: TableSortKey,
    ariaLabel = label,
  ): ReactElement =>
    sortable ? (
      <button
        type="button"
        className="scenario-standouts-sort"
        aria-label={`Sort by ${ariaLabel}`}
        onClick={() => {
          sortBy(key);
        }}
      >
        {label}
        {sortKey === key && (
          <i
            aria-hidden="true"
            className={`fas fa-caret-${
              sortDirection === 'asc' ? 'up' : 'down'
            }`}
          />
        )}
      </button>
    ) : (
      <>{label}</>
    );

  return (
    <section className={`scenario-standouts scenario-standouts-team-${team}`}>
      <header>
        <img
          src={assetUrl(`/images/icons/scenario/${
            team === 0 ? 'order' : 'destruction'
          }.png`)}
          width={42}
          height={42}
          alt={realm}
        />
        <div>
          <strong>{realm} Standouts</strong>
          <span>
            {scenarios.length} scenarios · {wins} wins ·{' '}
            {scenarios.length - wins} losses · ranked by {metricLabels[metric]}
            {mode === 'average' ? ' per scenario' : ''}
          </span>
        </div>
        {onExpand && (
          <button
            type="button"
            className="button is-small scenario-standouts-expand"
            title={`Open ${realm} Top 100`}
            aria-label={`Open ${realm} Top 100`}
            onClick={onExpand}
          >
            <span className="icon">
              <i className="fas fa-up-right-and-down-left-from-center" />
            </span>
          </button>
        )}
      </header>
      {standouts.length === 0 ? (
        <p className="has-text-centered p-4">
          No matching characters in this scenario window.
        </p>
      ) : (
        <div className="table-container">
          <table className="table is-fullwidth is-narrow">
            <thead>
              <tr>
                <th aria-label="Career">{heading('', 'career', 'career')}</th>
                <th>{heading('Character', 'name')}</th>
                <th align="right">{heading('SC', 'scenarios', 'scenarios')}</th>
                <th align="right">{heading('W', 'wins', 'wins')}</th>
                <th align="right">{heading('WR', 'winRate', 'win rate')}</th>
                <th align="right">{heading('Kills', 'kills')}</th>
                <th align="right">
                  {heading('KDmg', 'killDamage', 'kill damage')}
                </th>
                <th align="right">{heading('Dmg', 'damage', 'damage')}</th>
                <th align="right">
                  {heading('DB', 'deathBlows', 'death blows')}
                </th>
                <th align="right">{heading('Heals', 'healing', 'healing')}</th>
                <th align="right">
                  {heading('Prot', 'protection', 'protection')}
                </th>
                <th align="right">
                  {heading('Obj', 'objectiveScore', 'objective score')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStandouts.map((standout) => (
                <tr key={standout.characterId}>
                  <td>
                    <CareerIcon career={standout.career} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="scenario-player-link"
                      onClick={() => {
                        onSelectPlayer?.(standout, realm);
                      }}
                    >
                      {standout.name}
                    </button>
                  </td>
                  <td align="right">{standout.scenarios}</td>
                  <td align="right">{standout.wins}</td>
                  <td align="right">{Math.round(standout.winRate * 100)}%</td>
                  <td align="right">
                    {compactNumber(contributionValue(standout.kills, standout))}
                  </td>
                  <td align="right">
                    {compactNumber(
                      contributionValue(standout.killDamage, standout),
                    )}
                  </td>
                  <td align="right">
                    {compactNumber(
                      contributionValue(standout.damage, standout),
                    )}
                  </td>
                  <td align="right">
                    {compactNumber(
                      contributionValue(standout.deathBlows, standout),
                    )}
                  </td>
                  <td align="right">
                    {compactNumber(
                      contributionValue(standout.healing, standout),
                    )}
                  </td>
                  <td align="right">
                    {compactNumber(
                      contributionValue(standout.protection, standout),
                    )}
                  </td>
                  <td align="right">
                    {compactNumber(
                      contributionValue(standout.objectiveScore, standout),
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export const ScenarioStandouts = ({
  scenarios,
}: {
  scenarios: ScenarioRecord[];
}): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();
  const realmParam = searchParams.get('lbRealm') as RealmFilter;
  const roleParam = searchParams.get('lbRole') as RoleFilter;
  const careerParam = searchParams.get('lbCareer') as CareerFilter;
  const metricParam = searchParams.get('lbMetric') as RankingMetric;
  const limitParam = Number(searchParams.get('lbLimit'));
  const minimumScenariosParam = Number(searchParams.get('lbMin'));
  const modeParam = searchParams.get('lbMode') as RankingMode;
  const queueType = searchParams.get('queue_type') ?? 'all';
  const tier = searchParams.get('tier') ?? 'all';
  const range = searchParams.get('range') ?? '1h';
  const realm = realmFilters.includes(realmParam) ? realmParam : 'both';
  const role = roleFilters.includes(roleParam) ? roleParam : 'all';
  const career =
    careerParam === 'all' || Object.values(Career).includes(careerParam)
      ? careerParam
      : 'all';
  const metric = rankingMetrics.includes(metricParam) ? metricParam : 'overall';
  const limit = [5, 10, 25].includes(limitParam) ? limitParam : 5;
  const minimumScenarios = [1, 3, 10, 25].includes(minimumScenariosParam)
    ? minimumScenariosParam
    : 1;
  const mode: RankingMode = modeParam === 'average' ? 'average' : 'totals';
  const [expandedTeam, setExpandedTeam] = useState<number>();
  const [selectedPlayer, setSelectedPlayer] = useState<{
    realm: 'Order' | 'Destruction';
    standout: Standout;
  }>();
  const [shareStatus, setShareStatus] = useState('');

  const updateParams = (updates: Record<string, string | undefined>): void => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedTeam(undefined);
        setSelectedPlayer(undefined);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const careerOptions = Object.values(Career).filter(
    (careerOption) =>
      role === 'all' || scenarioCareerRoles[careerOption] === role,
  );
  const queueTypeLabels: Record<string, string> = {
    all: 'All types',
    standard: 'Standard',
    solo: 'Random Scenarios',
    city_siege: 'City Siege',
    group_challenge: 'Group Challenge',
  };
  const tierLabels: Record<string, string> = {
    all: 'All tiers',
    '1': 'Tier 1',
    '3': 'Tier 2–3',
    '4': 'Tier 4',
  };
  const rangeLabels: Record<string, string> = {
    recent: 'Most recent',
    '1h': 'Last hour',
    '24h': 'Last 24 hours',
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    ytd: 'Year to date',
    custom: 'Custom dates',
  };

  return (
    <>
      <div className="scenario-standout-filters mb-3">
        <label>
          <span>Type</span>
          <select
            value={queueType}
            onChange={(event) => {
              updateParams({
                queue_type:
                  event.target.value === 'all'
                    ? undefined
                    : event.target.value,
              });
            }}
          >
            <option value="all">All types</option>
            <option value="standard">Standard</option>
            <option value="solo">Random Scenario</option>
            <option value="city_siege">City Siege</option>
            <option value="group_challenge">Group Challenge</option>
          </select>
        </label>
        <label>
          <span>Tier</span>
          <select
            value={tier}
            onChange={(event) => {
              updateParams({
                tier:
                  event.target.value === 'all'
                    ? undefined
                    : event.target.value,
              });
            }}
          >
            <option value="all">All tiers</option>
            <option value="1">Tier 1</option>
            <option value="3">Tier 2–3</option>
            <option value="4">Tier 4</option>
          </select>
        </label>
        <label>
          <span>Time</span>
          <select
            value={range}
            onChange={(event) => {
              const nextRange = event.target.value;
              if (nextRange === 'custom') {
                const today = new Date();
                const sevenDaysAgo = new Date(
                  today.getTime() - 7 * 24 * 60 * 60 * 1000,
                );
                updateParams({
                  from: searchParams.get('from') ?? dateInputValue(sevenDaysAgo),
                  range: 'custom',
                  to: searchParams.get('to') ?? dateInputValue(today),
                });
              } else {
                updateParams({
                  from: undefined,
                  range: nextRange === '1h' ? undefined : nextRange,
                  to: undefined,
                });
              }
            }}
          >
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="ytd">Year to date</option>
            <option value="custom">Custom dates</option>
          </select>
        </label>
        {range === 'custom' && (
          <>
            <label>
              <span>Start</span>
              <input
                type="date"
                value={searchParams.get('from') ?? ''}
                onChange={(event) => {
                  updateParams({ from: event.target.value || undefined });
                }}
              />
            </label>
            <label>
              <span>End</span>
              <input
                type="date"
                value={searchParams.get('to') ?? ''}
                onChange={(event) => {
                  updateParams({ to: event.target.value || undefined });
                }}
              />
            </label>
          </>
        )}
        <label>
          <span>Realm</span>
          <select
            value={realm}
            onChange={(event) => {
              updateParams({
                lbRealm:
                  event.target.value === 'both'
                    ? undefined
                    : event.target.value,
              });
            }}
          >
            <option value="both">Both realms</option>
            <option value="order">Order</option>
            <option value="destruction">Destruction</option>
          </select>
        </label>
        <label>
          <span>Role</span>
          <select
            value={role}
            onChange={(event) => {
              updateParams({
                lbCareer: undefined,
                lbRole:
                  event.target.value === 'all' ? undefined : event.target.value,
              });
            }}
          >
            <option value="all">All roles</option>
            {scenarioRoleOrder.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Career</span>
          <select
            value={career}
            onChange={(event) => {
              updateParams({
                lbCareer:
                  event.target.value === 'all' ? undefined : event.target.value,
              });
            }}
          >
            <option value="all">All careers</option>
            {careerOptions.map((careerOption) => (
              <option key={careerOption} value={careerOption}>
                {scenarioCareerName(careerOption)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Rank by</span>
          <select
            value={metric}
            onChange={(event) => {
              updateParams({
                lbMetric:
                  event.target.value === 'overall'
                    ? undefined
                    : event.target.value,
              });
            }}
          >
            {Object.entries(metricLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Results</span>
          <select
            value={limit}
            onChange={(event) => {
              updateParams({
                lbLimit:
                  event.target.value === '5' ? undefined : event.target.value,
              });
            }}
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={25}>Top 25</option>
          </select>
        </label>
        <label>
          <span>Minimum scenarios</span>
          <select
            value={minimumScenarios}
            onChange={(event) => {
              updateParams({
                lbMin:
                  event.target.value === '1'
                    ? undefined
                    : event.target.value,
              });
            }}
          >
            <option value={1}>1+</option>
            <option value={3}>3+</option>
            <option value={10}>10+</option>
            <option value={25}>25+</option>
          </select>
        </label>
        <div className="scenario-standout-actions">
          <span>Share view</span>
          <button
            type="button"
            className="button is-small"
            onClick={() => {
              void navigator.clipboard
                .writeText(window.location.href)
                .then(() => {
                  setShareStatus('Link copied');
                  window.setTimeout(() => {
                    setShareStatus('');
                  }, 1800);
                })
                .catch(() => {
                  setShareStatus('Copy failed');
                });
            }}
          >
            <span className="icon">
              <i className="fas fa-link" />
            </span>
            <span>{shareStatus || 'Copy link'}</span>
          </button>
        </div>
      </div>
      <div className="scenario-active-filters mb-3">
        <span>
          <strong>{rangeLabels[range] ?? 'Most recent'}</strong> ·{' '}
          {tierLabels[tier] ?? 'All tiers'} ·{' '}
          {queueTypeLabels[queueType] ?? 'All types'} ·{' '}
          {scenarios.length.toLocaleString()} matches
        </span>
        <button
          type="button"
          className="button is-small"
          onClick={() => {
            const next = new URLSearchParams(searchParams);
            [
              'queue_type',
              'tier',
              'range',
              'from',
              'to',
              'lbRealm',
              'lbRole',
              'lbCareer',
              'lbMetric',
              'lbLimit',
              'lbMin',
              'lbMode',
            ].forEach((key) => {
              next.delete(key);
            });
            setSearchParams(next, { replace: true });
          }}
        >
          <span className="icon">
            <i className="fas fa-arrow-rotate-left" />
          </span>
          <span>Reset filters</span>
        </button>
      </div>
      <div className="scenario-ranking-note mb-3">
        <strong>How rankings work:</strong> totals cover the scenarios currently
        loaded on this page. Overall contribution combines a character&apos;s strongest
        combat or objective stat (65%), win rate (20%), and participation (15%).
        Open a player for averages and full-profile access. Longer time windows
        remain responsive by loading matches in batches; use Show more scenarios
        to expand the analysis.
      </div>
      <div className="scenario-standouts-grid mb-4">
        {realm !== 'destruction' && (
          <StandoutTable
            career={career}
            limit={limit}
            metric={metric}
            minimumScenarios={minimumScenarios}
            mode={mode}
            realm="Order"
            role={role}
            scenarios={scenarios}
            team={0}
            onExpand={() => {
              setExpandedTeam(0);
            }}
            onSelectPlayer={(standout, selectedRealm) => {
              setSelectedPlayer({ realm: selectedRealm, standout });
            }}
          />
        )}
        {realm !== 'order' && (
          <StandoutTable
            career={career}
            limit={limit}
            metric={metric}
            minimumScenarios={minimumScenarios}
            mode={mode}
            realm="Destruction"
            role={role}
            scenarios={scenarios}
            team={1}
            onExpand={() => {
              setExpandedTeam(1);
            }}
            onSelectPlayer={(standout, selectedRealm) => {
              setSelectedPlayer({ realm: selectedRealm, standout });
            }}
          />
        )}
      </div>
      <ScenarioBreakdown scenarios={scenarios} />
      {expandedTeam !== undefined && (
        <div className="modal is-active scenario-standouts-modal">
          <button
            type="button"
            className="modal-background"
            aria-label="Close expanded standouts"
            onClick={() => {
              setExpandedTeam(undefined);
            }}
          />
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label={`Expanded ${
              expandedTeam === 0 ? 'Order' : 'Destruction'
            } Standouts`}
          >
            <button
              type="button"
              className="delete scenario-standouts-modal-close"
              aria-label="Close"
              onClick={() => {
                setExpandedTeam(undefined);
              }}
            />
            <header className="modal-card-head">
              <div>
                <p className="modal-card-title">
                  {expandedTeam === 0 ? 'Order' : 'Destruction'} Top 100
                </p>
                <p>
                  {role === 'all' ? 'All roles' : role} ·{' '}
                  {career === 'all'
                    ? 'All careers'
                    : scenarioCareerName(career)}{' '}
                  · {metricLabels[metric]}
                </p>
              </div>
            </header>
            <section className="modal-card-body">
              <div className="scenario-modal-filters mb-3">
                <label>
                  <span>Role</span>
                  <select
                    value={role}
                    onChange={(event) => {
                      updateParams({
                        lbCareer: undefined,
                        lbRole:
                          event.target.value === 'all'
                            ? undefined
                            : event.target.value,
                      });
                    }}
                  >
                    <option value="all">All roles</option>
                    {scenarioRoleOrder.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Career</span>
                  <select
                    value={career}
                    onChange={(event) => {
                      updateParams({
                        lbCareer:
                          event.target.value === 'all'
                            ? undefined
                            : event.target.value,
                      });
                    }}
                  >
                    <option value="all">All careers</option>
                    {careerOptions.map((careerOption) => (
                      <option key={careerOption} value={careerOption}>
                        {scenarioCareerName(careerOption)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Rank by</span>
                  <select
                    value={metric}
                    onChange={(event) => {
                      updateParams({
                        lbMetric:
                          event.target.value === 'overall'
                            ? undefined
                            : event.target.value,
                      });
                    }}
                  >
                    {Object.entries(metricLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Minimum scenarios</span>
                  <select
                    value={minimumScenarios}
                    onChange={(event) => {
                      updateParams({
                        lbMin:
                          event.target.value === '1'
                            ? undefined
                            : event.target.value,
                      });
                    }}
                  >
                    <option value={1}>1+</option>
                    <option value={3}>3+</option>
                    <option value={10}>10+</option>
                    <option value={25}>25+</option>
                  </select>
                </label>
                <label>
                  <span>Numbers shown</span>
                  <select
                    value={mode}
                    onChange={(event) => {
                      updateParams({
                        lbMode:
                          event.target.value === 'totals'
                            ? undefined
                            : event.target.value,
                      });
                    }}
                  >
                    <option value="totals">Totals</option>
                    <option value="average">Per scenario</option>
                  </select>
                </label>
              </div>
              <StandoutTable
                career={career}
                limit={100}
                metric={metric}
                minimumScenarios={minimumScenarios}
                mode={mode}
                realm={expandedTeam === 0 ? 'Order' : 'Destruction'}
                role={role}
                scenarios={scenarios}
                sortable
                team={expandedTeam}
                onSelectPlayer={(standout, selectedRealm) => {
                  setSelectedPlayer({ realm: selectedRealm, standout });
                }}
              />
            </section>
          </div>
        </div>
      )}
      {selectedPlayer && (
        <div className="modal is-active scenario-player-modal">
          <button
            type="button"
            className="modal-background"
            aria-label="Close player summary"
            onClick={() => {
              setSelectedPlayer(undefined);
            }}
          />
          <div className="modal-card" role="dialog" aria-modal="true">
            <button
              type="button"
              className="delete scenario-standouts-modal-close"
              aria-label="Close"
              onClick={() => {
                setSelectedPlayer(undefined);
              }}
            />
            <header className="modal-card-head">
              <div className="scenario-player-heading">
                <CareerIcon career={selectedPlayer.standout.career} />
                <div>
                  <p className="modal-card-title">
                    {selectedPlayer.standout.name}
                  </p>
                  <p>
                    {selectedPlayer.realm} ·{' '}
                    {scenarioCareerName(selectedPlayer.standout.career)} ·
                    current activity window
                  </p>
                </div>
              </div>
            </header>
            <section className="modal-card-body">
              <div className="scenario-player-stats">
                <div>
                  <strong>{selectedPlayer.standout.scenarios}</strong>
                  <span>Scenarios</span>
                </div>
                <div>
                  <strong>
                    {Math.round(selectedPlayer.standout.winRate * 100)}%
                  </strong>
                  <span>Win rate</span>
                </div>
                <div>
                  <strong>{selectedPlayer.standout.kills}</strong>
                  <span>Kills</span>
                </div>
                <div>
                  <strong>{selectedPlayer.standout.deathBlows}</strong>
                  <span>Death blows</span>
                </div>
                <div>
                  <strong>{compactNumber(selectedPlayer.standout.damage)}</strong>
                  <span>Total damage</span>
                </div>
                <div>
                  <strong>{compactNumber(selectedPlayer.standout.healing)}</strong>
                  <span>Total healing</span>
                </div>
                <div>
                  <strong>
                    {compactNumber(selectedPlayer.standout.protection)}
                  </strong>
                  <span>Total protection</span>
                </div>
                <div>
                  <strong>
                    {compactNumber(selectedPlayer.standout.objectiveScore)}
                  </strong>
                  <span>Objective score</span>
                </div>
              </div>
              <div className="scenario-player-averages">
                Per scenario: {compactNumber(
                  selectedPlayer.standout.damage /
                    selectedPlayer.standout.scenarios,
                )}{' '}
                damage ·{' '}
                {compactNumber(
                  selectedPlayer.standout.healing /
                    selectedPlayer.standout.scenarios,
                )}{' '}
                healing ·{' '}
                {compactNumber(
                  selectedPlayer.standout.protection /
                    selectedPlayer.standout.scenarios,
                )}{' '}
                protection
              </div>
              <Link
                className="button is-primary mt-4"
                to={`/character/${selectedPlayer.standout.characterId}`}
              >
                Open full character profile
              </Link>
            </section>
          </div>
        </div>
      )}
    </>
  );
};
