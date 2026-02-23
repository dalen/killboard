import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getInstanceEncounterRunsFilters } from '@/components/instance_statistics/InstanceEncounterRunsFilters';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { formatDuration, intervalToDuration } from 'date-fns';
import { useSearchParams } from 'react-router';

const INSTANCE_ENCOUNTER_STATISTICS = gql`
  query GetInstanceEncounterStatistics(
    $where: InstanceEncounterRunFilterInput
  ) {
    instanceEncounterRuns(where: $where, order: { start: DESC }) {
      medianDuration
      averageDuration
      medianDeaths
      averageDeaths
    }
  }
`;

export const InstanceEncounterStatistics = ({
  name,
  instanceId,
  encounterId,
}: {
  name: string;
  instanceId: number;
  encounterId: number;
}) => {
  const [search] = useSearchParams();
  const filters = getInstanceEncounterRunsFilters(search);
  const { data, error, loading } = useQuery<Query>(
    INSTANCE_ENCOUNTER_STATISTICS,
    {
      variables: {
        where: {
          encounterId: { eq: encounterId },
          instanceId: { eq: instanceId },
          ...filters,
        },
      },
    },
  );

  if (loading || !data?.instanceEncounterRuns) {
    return (
      <tr>
        <td>{name}</td>
        <td colSpan={3}>
          <progress className="progress" />
        </td>
      </tr>
    );
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  if (data.instanceEncounterRuns.medianDuration === 0) {
    return null;
  }

  return (
    <tr>
      <td>{name}</td>
      <td>
        {formatDuration(
          intervalToDuration({
            end: new Date(data.instanceEncounterRuns.medianDuration),
            start: new Date(0),
          }),
        )}
      </td>
      <td>{data.instanceEncounterRuns.medianDeaths}</td>
      <td>
        {Math.round(
          (data.instanceEncounterRuns.averageDeaths + Number.EPSILON) * 100,
        ) / 100}
      </td>
    </tr>
  );
};
