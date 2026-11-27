import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import {
  getScenarioDateRange,
  getScenarioFilters,
} from '@/components/scenario/ScenarioFilters';
import { ScenarioListTable } from '@/components/scenario/ScenarioListTable';
import { QueryPagination } from '@/components/global/QueryPagination';

const SCENARIO_LIST = gql`
  query GetScenarioList(
    $where: ScenarioRecordFilterInput!
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
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
    orderWins: scenarios(
      where: { and: [$where, { winner: { eq: 0 } }] }
      first: 0
    ) {
      totalCount
    }
    destructionWins: scenarios(
      where: { and: [$where, { winner: { eq: 1 } }] }
      first: 0
    ) {
      totalCount
    }
  }
`;

const SCENARIO_AVERAGES = gql`
  query GetScenarioAverages($where: ScenarioRecordFilterInput!) {
    scenarios(where: $where, first: 0) {
      averageDuration
      averageKills
      averagePlayers
    }
  }
`;

type ScenarioListQuery = Query & {
  orderWins: { totalCount: number } | null;
  destructionWins: { totalCount: number } | null;
};

const formatOutcomeCount = (count: number): string =>
  new Intl.NumberFormat().format(count);

const getAverageDurationParts = (
  value: string,
): { hours: number; minutes: number; seconds: number } | null => {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/.exec(value);
  if (!match) {
    return null;
  }

  const totalSeconds = Math.round(
    Number(match[1] ?? 0) * 3600 +
      Number(match[2] ?? 0) * 60 +
      Number(match[3] ?? 0),
  );
  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    seconds,
  };
};

const hasBoundedDateRange = (
  search: URLSearchParams,
  defaultLast30Days: boolean,
): boolean => {
  const { from, through } = getScenarioDateRange(search, defaultLast30Days);
  if (!from || !through) {
    return false;
  }

  const start = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${through}T00:00:00.000Z`);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start.toISOString().slice(0, 10) !== from ||
    end.toISOString().slice(0, 10) !== through
  ) {
    return false;
  }

  const rangeDays = (end.getTime() - start.getTime()) / 86_400_000 + 1;
  return rangeDays > 0 && rangeDays <= 31;
};

export const ScenarioList = ({
  characterId,
  guildId,
  perPage: initialPerPage = 15,
  defaultLast30Days = true,
}: {
  characterId?: string;
  guildId?: string;
  perPage?: number;
  defaultLast30Days?: boolean;
}): React.ReactElement | null => {
  const [perPage, setPerPage] = useState(initialPerPage);
  const { t } = useTranslation(['common', 'components']);
  const [search] = useSearchParams();
  const scenarioFilters = getScenarioFilters(search, {
    characterId,
    defaultLast30Days,
    guildId,
  });
  const shouldLoadAverages = hasBoundedDateRange(search, defaultLast30Days);

  const { loading, error, data, refetch } = useQuery<ScenarioListQuery>(
    SCENARIO_LIST,
    {
      variables: {
        first: perPage,
        where: scenarioFilters,
      },
    },
  );
  const {
    data: averagesData,
    loading: averagesLoading,
    error: averagesError,
  } = useQuery<Query>(SCENARIO_AVERAGES, {
    variables: { where: scenarioFilters },
    skip: !shouldLoadAverages,
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  const scenarioResults = data?.scenarios;
  if (scenarioResults?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { nodes: scenarios, pageInfo, totalCount } = scenarioResults;
  const orderWins = data?.orderWins?.totalCount ?? 0;
  const destructionWins = data?.destructionWins?.totalCount ?? 0;
  const recordedWinnerCount = orderWins + destructionWins;
  const noRecordedWinnerCount = Math.max(0, totalCount - recordedWinnerCount);
  const averageResults = averagesData?.scenarios;
  const averageDurationParts =
    averageResults == null
      ? null
      : getAverageDurationParts(String(averageResults.averageDuration));
  const averageDuration =
    totalCount === 0 || averageResults == null
      ? '—'
      : averageDurationParts == null
        ? String(averageResults.averageDuration)
        : t(
            averageDurationParts.hours > 0
              ? 'components:scenarioList.scenarioDurationHour'
              : 'components:scenarioList.scenarioDuration',
            averageDurationParts,
          );
  const averageKills =
    totalCount === 0 || averageResults == null
      ? '—'
      : averageResults.averageKills.toFixed(1);
  const averagePlayers =
    totalCount === 0 || averageResults == null
      ? '—'
      : averageResults.averagePlayers.toFixed(1);
  return (
    <>
      <div className="mb-2">
        <p className="has-text-grey mb-0">
          {t('components:scenarioList.matchesFound', {
            count: totalCount,
          })}
        </p>
      </div>
      <section
        className="card scenario-outcome-summary mb-4"
        aria-labelledby="scenario-outcome-summary-title"
      >
        <div className="card-content">
          <div
            className="is-flex is-flex-wrap-wrap is-justify-content-space-between is-align-items-baseline mb-3"
            style={{ gap: '0.25rem 1rem' }}
          >
            <h2 className="title is-6 mb-0" id="scenario-outcome-summary-title">
              {t('components:scenarioList.recordedOutcomes')}
            </h2>
            <p className="is-size-7 has-text-grey mb-0">
              {t('components:scenarioList.recordedOutcomeSample', {
                count: formatOutcomeCount(recordedWinnerCount),
              })}
            </p>
          </div>
          <div className="columns is-mobile is-variable is-2 mb-0">
            <div className="column">
              <div className="scenario-outcome-summary__realm scenario-outcome-summary__realm--order">
                <p className="is-size-7 mb-1">
                  {t('components:scenarioList.orderWins')}
                </p>
                <p className="title is-4 mb-1">
                  {recordedWinnerCount > 0
                    ? `${(
                        (orderWins / recordedWinnerCount) *
                        100
                      ).toFixed(1)}%`
                    : '—'}
                </p>
                <p className="is-size-7 mb-0">
                  {t('components:scenarioList.winsCount', {
                    count: formatOutcomeCount(orderWins),
                  })}
                </p>
              </div>
            </div>
            <div className="column">
              <div className="scenario-outcome-summary__realm scenario-outcome-summary__realm--destruction">
                <p className="is-size-7 mb-1">
                  {t('components:scenarioList.destructionWins')}
                </p>
                <p className="title is-4 mb-1">
                  {recordedWinnerCount > 0
                    ? `${(
                        (destructionWins / recordedWinnerCount) *
                        100
                      ).toFixed(1)}%`
                    : '—'}
                </p>
                <p className="is-size-7 mb-0">
                  {t('components:scenarioList.winsCount', {
                    count: formatOutcomeCount(destructionWins),
                  })}
                </p>
              </div>
            </div>
          </div>
          {noRecordedWinnerCount > 0 && (
            <p className="is-size-7 has-text-grey mt-2 mb-0">
              {t('components:scenarioList.matchesWithoutRecordedWinner', {
                count: formatOutcomeCount(noRecordedWinnerCount),
              })}
            </p>
          )}
          <div className="scenario-outcome-summary__averages mt-4">
            <p className="is-size-7 has-text-grey mb-2">
              {t('components:scenarioList.matchAverages')}
            </p>
            {!shouldLoadAverages ? (
              <p className="is-size-7 has-text-grey mb-0">
                {t('components:scenarioList.averageDateRangeRequired')}
              </p>
            ) : averagesLoading ? (
              <progress
                className="progress is-small"
                aria-label={t('components:scenarioList.loadingAverages')}
              />
            ) : averagesError ? (
              <p className="is-size-7 has-text-grey mb-0">
                {t('components:scenarioList.averagesUnavailable')}
              </p>
            ) : (
              <div className="columns is-mobile is-variable is-2 mb-0">
                <div className="column">
                  <div className="scenario-outcome-summary__metric">
                    <p className="is-size-7 mb-1">
                      {t('components:scenarioList.averageDuration')}
                    </p>
                    <p className="has-text-weight-bold mb-0">{averageDuration}</p>
                  </div>
                </div>
                <div className="column">
                  <div className="scenario-outcome-summary__metric">
                    <p className="is-size-7 mb-1">
                      {t('components:scenarioList.averageKills')}
                    </p>
                    <p className="has-text-weight-bold mb-0">{averageKills}</p>
                  </div>
                </div>
                <div className="column">
                  <div className="scenario-outcome-summary__metric">
                    <p className="is-size-7 mb-1">
                      {t('components:scenarioList.averagePlayers')}
                    </p>
                    <p className="has-text-weight-bold mb-0">{averagePlayers}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <ScenarioListTable data={scenarios} />
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        onPerPageChange={setPerPage}
        refetch={refetch}
      />
    </>
  );
};
