import { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getInstanceEncounterRunsFilters } from '@/components/instance_statistics/InstanceEncounterRunsFilters';
import { gql, useQuery } from '@apollo/client';
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

export function InstanceEncounterStatistics({
  name,
  instanceId,
  encounterId,
}: {
  name: string;
  instanceId: number;
  encounterId: number;
}) {
  const [search] = useSearchParams();
  const filters = getInstanceEncounterRunsFilters(search);
  const { data, error, loading } = useQuery<Query>(
    INSTANCE_ENCOUNTER_STATISTICS,
    {
      variables: {
        where: {
          instanceId: { eq: instanceId },
          encounterId: { eq: encounterId },
          ...filters,
        },
      },
    },
  );

  if (loading || !data?.instanceEncounterRuns)
    return (
      <tr>
        <td>{name}</td>
        <td colSpan={3}>
          <progress className="progress" />
        </td>
      </tr>
    );
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data.instanceEncounterRuns.medianDuration === 0) {
    return null;
  }

  return (
    <tr>
      <td>{name}</td>
      <td>
        {formatDuration(
          intervalToDuration({
            start: new Date(0),
            end: new Date(data.instanceEncounterRuns.medianDuration),
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
}
