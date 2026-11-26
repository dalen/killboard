import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import {
  getInstanceEncounterRunsFilters,
  getPreviousInstanceEncounterRunsFilters,
} from '@/components/instance_statistics/InstanceEncounterRunsFilters';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { formatApiDuration } from '@/utils';
import { useSearchParams } from 'react-router';

const INSTANCE_ENCOUNTER_STATISTICS = gql`
  query GetInstanceEncounterStatistics(
    $where: InstanceEncounterRunFilterInput
    $previousWhere: InstanceEncounterRunFilterInput
    $comparePrevious: Boolean!
  ) {
    current: instanceEncounterRuns(where: $where, order: { start: DESC }) {
      totalCount
      completedCount
      medianDuration
      averageDuration
      medianDeaths
      averageDeaths
    }
    previous: instanceEncounterRuns(
      where: $previousWhere
      order: { start: DESC }
    ) @include(if: $comparePrevious) {
      totalCount
      completedCount
      medianDuration
    }
  }
`;

type EncounterStats = NonNullable<Query['instanceEncounterRuns']>;
type EncounterStatisticsData = {
  current: EncounterStats | null;
  previous?: Pick<
    EncounterStats,
    'totalCount' | 'completedCount' | 'medianDuration'
  > | null;
};

export const InstanceEncounterStatistics = ({
  name,
  instanceId,
  encounterId,
}: {
  name: string;
  instanceId: number;
  encounterId: number;
}) => {
  const { t } = useTranslation(['pages']);
  const [search] = useSearchParams();
  const filters = getInstanceEncounterRunsFilters(search);
  const previousFilters = getPreviousInstanceEncounterRunsFilters(search);
  const comparePrevious =
    search.get('compare') === 'previous' && previousFilters !== null;
  const baseWhere = {
    encounterId: { eq: encounterId },
    instanceId: { eq: instanceId },
  };
  const { data, error, loading } = useQuery<EncounterStatisticsData>(
    INSTANCE_ENCOUNTER_STATISTICS,
    {
      variables: {
        where: { ...baseWhere, ...filters },
        previousWhere: {
          ...baseWhere,
          ...(previousFilters ?? filters),
        },
        comparePrevious,
      },
    },
  );

  if (error) {
    return (
      <tr>
        <td colSpan={6}>
          <ErrorMessage name={error.name} message={error.message} />
        </td>
      </tr>
    );
  }

  if (loading || !data?.current) {
    return (
      <tr>
        <td>{name}</td>
        <td colSpan={5}>
          <progress className="progress" />
        </td>
      </tr>
    );
  }

  const current = data.current;
  const previous = comparePrevious ? data.previous : null;
  if (
    current.medianDuration === 'PT0S' &&
    (!previous || previous.medianDuration === 'PT0S')
  ) {
    return null;
  }

  return (
    <tr>
      <td>{name}</td>
      <td>{current.totalCount}</td>
      <td>{current.completedCount}</td>
      <td>
        {current.medianDuration === 'PT0S'
          ? '—'
          : formatApiDuration(current.medianDuration)}
        {previous && (
          <div className="is-size-7 has-text-grey-light">
            {previous.medianDuration === 'PT0S'
              ? t('instanceStatistics.previousNoRuns')
              : t('instanceStatistics.previousMedian', {
                  duration: formatApiDuration(previous.medianDuration),
                  count: previous.totalCount,
                })}
          </div>
        )}
      </td>
      <td>{current.medianDeaths}</td>
      <td>
        {Math.round(
          (current.averageDeaths + Number.EPSILON) * 100,
        ) / 100}
      </td>
    </tr>
  );
};
