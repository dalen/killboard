import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import type { Query } from '@/__generated__/graphql';
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
  const [resultLimit, setResultLimit] = useState(perPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const filterKey = search.toString();

  useEffect(() => {
    setResultLimit(perPage);
  }, [filterKey, perPage]);

  const { loading, error, data, refetch } = useQuery<Query>(SCENARIO_LIST, {
    variables: {
      first: loadMore ? resultLimit : perPage,
      where: getScenarioFilters(search, { characterId, guildId }),
    },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.scenarios?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const pageInfo = data?.scenarios?.pageInfo;
  const scenarios = data.scenarios.nodes;
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

  return (
    <>
      <div className="scenario-feed-toolbar mb-3">
        <div>
          <strong>{t('components:scenarioList.recentActivity')}</strong>
          <span>
            {format(earliestScenarioDate, 'MMM d, h:mm a')} –{' '}
            {format(latestScenarioDate, 'MMM d, h:mm a')}
          </span>
        </div>
        <button
          type="button"
          className="button is-small"
          onClick={() => refetch()}
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
          <span>{t('components:scenarioList.recentScenarios')}</span>
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
        <div>
          <span>
            <strong>{orderWins}</strong> Order wins
          </span>
          <span>
            <strong>{destructionWins}</strong> Destruction wins
          </span>
        </div>
        <div className="scenario-win-balance-bar">
          <span style={{ width: `${orderWinPercentage}%` }} />
        </div>
      </div>
      <ScenarioStandouts scenarios={scenarios} />
      <ScenarioListTable data={scenarios} />
      {loadMore ? (
        pageInfo.hasNextPage && (
          <div className="has-text-centered mt-4">
            <button
              type="button"
              className={`button is-primary ${loadingMore ? 'is-loading' : ''}`}
              disabled={loadingMore}
              onClick={async () => {
                const nextLimit = resultLimit + perPage;
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
      ) : (
        <QueryPagination
          pageInfo={pageInfo}
          perPage={perPage}
          refetch={refetch}
        />
      )}
    </>
  );
};
