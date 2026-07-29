import { type ReactElement, useEffect, useState } from 'react';
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

const getStandouts = ({
  career,
  limit,
  metric,
  role,
  scenarios,
  team,
}: {
  career: CareerFilter;
  limit: number;
  metric: RankingMetric;
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
      (left, right) =>
        right[metric] - left[metric] ||
        right.scenarios - left.scenarios ||
        right.kills - left.kills,
    )
    .slice(0, limit);
};

const StandoutTable = ({
  career,
  limit,
  metric,
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
    role,
    scenarios,
    team,
  });
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
          result = left[sortKey] - right[sortKey];
        }

        return (
          (sortDirection === 'asc' ? result : -result) ||
          left.name.localeCompare(right.name)
        );
      })
    : standouts;
  const wins = scenarios.filter((scenario) => scenario.winner === team).length;
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
                  <td align="right">{standout.kills}</td>
                  <td align="right">{compactNumber(standout.killDamage)}</td>
                  <td align="right">{compactNumber(standout.damage)}</td>
                  <td align="right">{standout.deathBlows}</td>
                  <td align="right">{compactNumber(standout.healing)}</td>
                  <td align="right">{compactNumber(standout.protection)}</td>
                  <td align="right">
                    {compactNumber(standout.objectiveScore)}
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
  const realm = realmFilters.includes(realmParam) ? realmParam : 'both';
  const role = roleFilters.includes(roleParam) ? roleParam : 'all';
  const career =
    careerParam === 'all' || Object.values(Career).includes(careerParam)
      ? careerParam
      : 'all';
  const metric = rankingMetrics.includes(metricParam) ? metricParam : 'overall';
  const limit = [5, 10, 25].includes(limitParam) ? limitParam : 5;
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

  return (
    <>
      <div className="scenario-standout-filters mb-3">
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
      <div className="scenario-ranking-note mb-3">
        <strong>How rankings work:</strong> totals cover the scenarios currently
        loaded above. Overall contribution combines a character&apos;s strongest
        combat or objective stat (65%), win rate (20%), and participation (15%).
        Open a player for averages and full-profile access.
      </div>
      <div className="scenario-standouts-grid mb-4">
        {realm !== 'destruction' && (
          <StandoutTable
            career={career}
            limit={limit}
            metric={metric}
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
              <StandoutTable
                career={career}
                limit={100}
                metric={metric}
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
