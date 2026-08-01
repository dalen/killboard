import { gql } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import { type ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  type Career,
  type Kill,
  type Query,
  type ScenarioRecord,
} from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';

const CHARACTER_SCENARIO_DEATHS = gql`
  query GetCharacterScenarioDeaths(
    $where: KillFilterInput
    $first: Int
    $after: String
  ) {
    kills(where: $where, first: $first, after: $after) {
      nodes {
        id
        deathblow {
          id
          name
          career
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface ConnectionPlayer {
  career: Career;
  id: string;
  losses: number;
  matches: number;
  name: string;
  wins: number;
}

const dateInputValue = (date: Date): string => {
  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60 * 1000,
  );
  return offsetDate.toISOString().slice(0, 10);
};

const ConnectionTable = ({
  emptyText,
  killsOnly = false,
  players,
  title,
}: {
  emptyText: string;
  killsOnly?: boolean;
  players: ConnectionPlayer[];
  title: string;
}): ReactElement => (
  <section className="character-scenario-connection">
    <header>
      <h2>{title}</h2>
      <span>{players.length} players</span>
    </header>
    {players.length === 0 ? (
      <p className="has-text-centered p-4">{emptyText}</p>
    ) : (
      <div className="table-container">
        <table className="table is-fullwidth is-narrow">
          <thead>
            <tr>
              <th aria-label="Career" />
              <th>Character</th>
              <th align="right">{killsOnly ? 'Killing blows' : 'Matches'}</th>
              {!killsOnly && (
                <>
                  <th align="right">W</th>
                  <th align="right">L</th>
                  <th align="right">WR</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {players.slice(0, 10).map((player) => (
              <tr key={player.id}>
                <td>
                  <CareerIcon career={player.career} />
                </td>
                <td>
                  <Link to={`/character/${player.id}`}>{player.name}</Link>
                </td>
                <td align="right">{player.matches}</td>
                {!killsOnly && (
                  <>
                    <td align="right">{player.wins}</td>
                    <td align="right">{player.losses}</td>
                    <td align="right">
                      {Math.round((player.wins / player.matches) * 100)}%
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export const CharacterScenarioConnections = ({
  characterId,
  scenarios,
}: {
  characterId: string;
  scenarios: ScenarioRecord[];
}): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();
  const client = useApolloClient();
  const [deathblows, setDeathblows] = useState<Kill[]>([]);
  const [deathblowsLoading, setDeathblowsLoading] = useState(false);
  const queueType = searchParams.get('queue_type') ?? 'all';
  const tier = searchParams.get('tier') ?? 'all';
  const range = searchParams.get('range') ?? 'recent';
  const scenarioIds = scenarios.map((scenario) => scenario.id);
  const scenarioIdsKey = scenarioIds.join(',');

  const updateParams = (updates: Record<string, string | undefined>): void => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }
    next.delete('lbRealm');
    next.delete('lbRole');
    next.delete('lbCareer');
    next.delete('lbMetric');
    next.delete('lbLimit');
    next.delete('lbMin');
    next.delete('lbMode');
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    let cancelled = false;
    const loadDeathblows = async (): Promise<void> => {
      setDeathblows([]);
      if (scenarioIds.length === 0) {
        return;
      }
      setDeathblowsLoading(true);
      const loaded: Kill[] = [];
      try {
        for (let index = 0; index < scenarioIds.length; index += 100) {
          const instanceIds = scenarioIds.slice(index, index + 100);
          let after: string | undefined;
          do {
            const result = await client.query<Query>({
              fetchPolicy: 'network-only',
              query: CHARACTER_SCENARIO_DEATHS,
              variables: {
                after,
                first: 50,
                where: {
                  instanceId: { in: instanceIds },
                  victimCharacterId: { eq: characterId },
                },
              },
            });
            const connection = result.data?.kills;
            loaded.push(...(connection?.nodes ?? []));
            after = connection?.pageInfo.endCursor ?? undefined;
            if (!connection?.pageInfo.hasNextPage || !after) {
              break;
            }
          } while (!cancelled);
          if (cancelled) {
            break;
          }
        }
        if (!cancelled) {
          setDeathblows(loaded);
        }
      } finally {
        if (!cancelled) {
          setDeathblowsLoading(false);
        }
      }
    };
    void loadDeathblows();
    return () => {
      cancelled = true;
    };
  }, [characterId, client, scenarioIdsKey]);

  const { opponents, teammates } = useMemo(() => {
    const teammateMap = new Map<string, ConnectionPlayer>();
    const opponentMap = new Map<string, ConnectionPlayer>();

    for (const scenario of scenarios) {
      const ownEntry = scenario.scoreboardEntries.find(
        (entry) => entry.character.id === characterId,
      );
      if (!ownEntry) {
        continue;
      }
      const won = scenario.winner === ownEntry.team;
      for (const entry of scenario.scoreboardEntries) {
        if (entry.character.id === characterId) {
          continue;
        }
        const target = entry.team === ownEntry.team ? teammateMap : opponentMap;
        const current = target.get(entry.character.id) ?? {
          career: entry.character.career,
          id: entry.character.id,
          losses: 0,
          matches: 0,
          name: entry.character.name,
          wins: 0,
        };
        current.matches += 1;
        current.wins += won ? 1 : 0;
        current.losses += won ? 0 : 1;
        target.set(entry.character.id, current);
      }
    }
    const sortPlayers = (players: ConnectionPlayer[]) =>
      players.toSorted(
        (left, right) =>
          right.matches - left.matches ||
          right.wins - left.wins ||
          left.name.localeCompare(right.name),
      );
    return {
      opponents: sortPlayers([...opponentMap.values()]),
      teammates: sortPlayers([...teammateMap.values()]),
    };
  }, [characterId, scenarios]);

  const killers = useMemo(() => {
    const players = new Map<string, ConnectionPlayer>();
    for (const kill of deathblows) {
      if (!kill.deathblow) {
        continue;
      }
      const current = players.get(kill.deathblow.id) ?? {
        career: kill.deathblow.career,
        id: kill.deathblow.id,
        losses: 0,
        matches: 0,
        name: kill.deathblow.name,
        wins: 0,
      };
      current.matches += 1;
      current.losses += 1;
      players.set(kill.deathblow.id, current);
    }
    return [...players.values()].toSorted(
      (left, right) =>
        right.matches - left.matches || left.name.localeCompare(right.name),
    );
  }, [deathblows]);

  return (
    <>
      <div className="character-scenario-filters mb-3">
        <label>
          <span>Type</span>
          <div className="select">
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
          </div>
        </label>
        <label>
          <span>Tier</span>
          <div className="select">
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
          </div>
        </label>
        <label>
          <span>Time</span>
          <div className="select">
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
                    from:
                      searchParams.get('from') ?? dateInputValue(sevenDaysAgo),
                    range: 'custom',
                    to: searchParams.get('to') ?? dateInputValue(today),
                  });
                } else {
                  updateParams({
                    from: undefined,
                    range: nextRange === 'recent' ? undefined : nextRange,
                    to: undefined,
                  });
                }
              }}
            >
              <option value="recent">Most recent</option>
              <option value="1h">Last hour</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="ytd">Year to date</option>
              <option value="custom">Custom dates</option>
            </select>
          </div>
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
        <button
          type="button"
          className="button is-small"
          onClick={() => {
            const next = new URLSearchParams();
            setSearchParams(next, { replace: true });
          }}
        >
          <i className="fas fa-arrow-rotate-left" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>
      <div className="character-scenario-connections mb-4">
        <ConnectionTable
          emptyText="No teammates found in this scenario window."
          players={teammates}
          title="Most Played With"
        />
        <ConnectionTable
          emptyText="No opponents found in this scenario window."
          players={opponents}
          title="Most Faced"
        />
        <ConnectionTable
          emptyText={
            deathblowsLoading
              ? 'Loading scenario deaths…'
              : 'No killing blows found in this scenario window.'
          }
          killsOnly
          players={killers}
          title="Killed You Most"
        />
      </div>
    </>
  );
};
