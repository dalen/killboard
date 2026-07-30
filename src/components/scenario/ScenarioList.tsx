import { gql } from '@apollo/client';
import { useApolloClient, useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import type { Query, ScenarioRecord } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getScenarioFilters } from '@/components/scenario/ScenarioFilters';
import { ScenarioListTable } from '@/components/scenario/ScenarioListTable';
import { QueryPagination } from '@/components/global/QueryPagination';
import { ScenarioStandouts } from '@/components/scenario/ScenarioStandouts';

const SCENARIO_LIST = gql`
  query GetScenarioList(
    $where: ScenarioRecordFilterInput
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    scenarios(
      where: $where
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      totalCount
      nodes {
        id
        scenario {
          id
          name
        }
        startTime
        endTime
        winner
        points
        wasSurrender
        tier
        queueType
        numPlayers
        numDeaths
        scoreboardEntries {
          character {
            id
            name
            career
          }
          guild {
            id
            name
          }
          team
          level
          renownRank
          kills
          deathBlows
          deaths
          damage
          killDamage
          healing
          protection
          objectiveScore
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const ScenarioList = ({
  characterId,
  guildId,
  loadMore = false,
  perPage = 15,
}: {
  characterId?: string;
  guildId?: string;
  loadMore?: boolean;
  perPage?: number;
}): React.ReactElement | null => {
  const { t } = useTranslation(['common', 'components']);
  const [search] = useSearchParams();
  const range = search.get('range') ?? 'recent';
  const isFullWindow = range !== 'recent';
  const [resultLimit, setResultLimit] = useState(perPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [windowScenarios, setWindowScenarios] = useState<ScenarioRecord[]>([]);
  const [windowTotal, setWindowTotal] = useState(0);
  const [windowLoading, setWindowLoading] = useState(false);
  const [windowError, setWindowError] = useState<Error>();
  const [reloadToken, setReloadToken] = useState(0);
  const filterKey = search.toString();
  const client = useApolloClient();
  const where = getScenarioFilters(search, { characterId, guildId });

  useEffect(() => {
    setResultLimit(perPage);
  }, [filterKey, perPage]);

  const {
    loading: recentLoading,
    error: recentError,
    data,
    refetch,
  } = useQuery<Query>(SCENARIO_LIST, {
    skip: isFullWindow,
    variables: {
      first: perPage,
      where,
    },
  });

  useEffect(() => {
    if (!isFullWindow) {
      setWindowScenarios([]);
      setWindowTotal(0);
      setWindowLoading(false);
      setWindowError(undefined);
      return;
    }

    let cancelled = false;
    const loadWindow = async (): Promise<void> => {
      setWindowScenarios([]);
      setWindowTotal(0);
      setWindowError(undefined);
      setWindowLoading(true);
      let after: string | undefined;
      const accumulated: ScenarioRecord[] = [];

      try {
        do {
          const result = await client.query<Query>({
            fetchPolicy: 'network-only',
            query: SCENARIO_LIST,
            variables: {
              after,
              first: 50,
              where,
            },
          });
          const connection = result.data?.scenarios;
          if (!connection) {
            break;
          }

          accumulated.push(...(connection.nodes ?? []));
          after = connection.pageInfo.endCursor ?? undefined;
          if (!cancelled) {
            setWindowTotal(connection.totalCount);
            setWindowScenarios([...accumulated]);
          }

          if (!connection.pageInfo.hasNextPage || !after) {
            break;
          }
        } while (!cancelled);
      } catch (caughtError) {
        if (!cancelled) {
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
    };
  }, [client, filterKey, isFullWindow, reloadToken]);

  const loading = isFullWindow ? windowLoading : recentLoading;
  const error = isFullWindow ? windowError : recentError;
  const scenarios = isFullWindow
    ? windowScenarios
    : (data?.scenarios?.nodes ?? []);
  const pageInfo = data?.scenarios?.pageInfo;

  if (loading && scenarios.length === 0) {
    return (
      <>
        <ScenarioStandouts scenarios={[]} />
        <div className="scenario-window-loading">
          <progress className="progress is-small is-primary" />
          <strong>Gathering the complete selected time window…</strong>
          <span>
            Player scoreboards are loaded in batches so the final leaderboard is
            exact.
          </span>
        </div>
      </>
    );
  }
  if (recentLoading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (!isFullWindow && data?.scenarios?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  if (scenarios.length === 0) {
    return (
      <>
        <ScenarioStandouts scenarios={[]} />
        <ErrorMessage customText={t('common:notFound')} />
      </>
    );
  }
  const scenarioDates = scenarios.flatMap((scenario) => [
    new Date(scenario.startTime),
    new Date(scenario.endTime),
  ]);
  const earliestScenarioDate = new Date(
    Math.min(...scenarioDates.map((date) => date.getTime())),
  );
  const latestScenarioDate = new Date(
    Math.max(...scenarioDates.map((date) => date.getTime())),
  );
  const orderWins = scenarios.filter(
    (scenario) => scenario.winner === 0,
  ).length;
  const destructionWins = scenarios.filter(
    (scenario) => scenario.winner === 1,
  ).length;
  const decidedScenarios = orderWins + destructionWins;
  const orderWinPercentage =
    decidedScenarios === 0 ? 50 : (orderWins / decidedScenarios) * 100;
  const averagePlayers =
    scenarios.reduce((total, scenario) => total + scenario.numPlayers, 0) /
    scenarios.length;
  const averageDurationSeconds =
    scenarios.reduce(
      (total, scenario) =>
        total +
        (new Date(scenario.endTime).getTime() -
          new Date(scenario.startTime).getTime()) /
          1000,
      0,
    ) / scenarios.length;
  const rangeLabels: Record<string, string> = {
    recent: 'most recent matches',
    '24h': 'matches · complete last 24 hours',
    '7d': 'matches · complete last 7 days',
    '30d': 'matches · complete last 30 days',
    '90d': 'matches · complete last 90 days',
    ytd: 'matches · complete year to date',
    custom: 'matches · complete custom dates',
  };
  const visibleScenarios =
    loadMore && isFullWindow ? scenarios.slice(0, resultLimit) : scenarios;

  return (
    <>
      <div className="scenario-feed-toolbar mb-3">
        <div>
          <strong>{t('components:scenarioList.recentActivity')}</strong>
          <span>
            {format(earliestScenarioDate, 'MMM d, h:mm a')} –{' '}
            {format(latestScenarioDate, 'MMM d, h:mm a')}
            {loading && ` · gathering ${scenarios.length} of ${windowTotal || '…'}`}
          </span>
        </div>
        <button
          type="button"
          className="button is-small"
          onClick={() => {
            if (isFullWindow) {
              setReloadToken((current) => current + 1);
            } else {
              void refetch();
            }
          }}
        >
          <span className="icon is-small">
            <i className="fas fa-rotate-right" aria-hidden="true" />
          </span>
          <span>{t('components:scenarioList.refresh')}</span>
        </button>
      </div>
      <div className="scenario-list-summary">
        <div>
          <strong>{scenarios.length}</strong>
          <span>
            {loading
              ? `gathering ${scenarios.length} of ${windowTotal || '…'}`
              : (rangeLabels[range] ?? 'matches')}
          </span>
        </div>
        <div>
          <strong>{averagePlayers.toFixed(1)}</strong>
          <span>{t('components:scenarioList.averagePlayers')}</span>
        </div>
        <div>
          <strong>
            {Math.floor(averageDurationSeconds / 60)}m{' '}
            {Math.round(averageDurationSeconds % 60)}s
          </strong>
          <span>{t('components:scenarioList.averageDuration')}</span>
        </div>
      </div>
      <div className="scenario-win-balance mb-4">
        <div className="scenario-win-balance-totals">
          <span>
            <strong>{orderWins.toLocaleString()}</strong> Order wins
          </span>
          <span>
            <strong>{destructionWins.toLocaleString()}</strong> Destruction wins
          </span>
        </div>
        <div className="scenario-win-balance-bar">
          <span style={{ width: `${orderWinPercentage}%` }} />
          <div
            className="scenario-win-balance-junction"
            style={{ left: `${orderWinPercentage}%` }}
          >
            <strong className="scenario-win-rate-order">
              {orderWinPercentage.toFixed(1)}%
            </strong>
            <strong className="scenario-win-rate-destruction">
              {(100 - orderWinPercentage).toFixed(1)}%
            </strong>
          </div>
        </div>
      </div>
      {loading && (
        <div className="scenario-window-progress mb-3">
          <progress
            className="progress is-small is-primary"
            value={scenarios.length}
            max={windowTotal || undefined}
          />
          Calculating the full {range === 'ytd' ? 'year-to-date' : range}{' '}
          leaderboard: {scenarios.length}
          {windowTotal ? ` of ${windowTotal}` : ''} matches gathered.
        </div>
      )}
      <ScenarioStandouts scenarios={scenarios} />
      <ScenarioListTable data={visibleScenarios} />
      {loadMore ? (
        ((isFullWindow && resultLimit < scenarios.length) ||
          (!isFullWindow && pageInfo?.hasNextPage)) && (
          <div className="has-text-centered mt-4">
            <button
              type="button"
              className={`button is-primary ${loadingMore ? 'is-loading' : ''}`}
              disabled={loadingMore}
              onClick={async () => {
                const nextLimit = resultLimit + perPage;
                if (isFullWindow) {
                  setResultLimit(nextLimit);
                  return;
                }
                setLoadingMore(true);
                try {
                  await refetch({
                    first: nextLimit,
                    where: getScenarioFilters(search, { characterId, guildId }),
                  });
                  setResultLimit(nextLimit);
                } finally {
                  setLoadingMore(false);
                }
              }}
            >
              {t('components:scenarioList.showMore')}
            </button>
          </div>
        )
      ) : !isFullWindow && pageInfo ? (
        <QueryPagination
          pageInfo={pageInfo}
          perPage={perPage}
          refetch={refetch}
        />
      ) : null}
    </>
  );
};
