import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getInstanceEncounterRunsFilters } from '@/components/instance_statistics/InstanceEncounterRunsFilters';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { formatDuration } from 'date-fns';
import { parseIsoDuration } from '@/utils';
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

  // Encounters with a sub-minute median duration are almost always trash
  // pulls or bugged/incomplete fights rather than real boss encounters -
  // leave them off the list entirely (this also covers the zero-duration
  // "no data" case).
  const medianDuration = parseIsoDuration(
    data.instanceEncounterRuns.medianDuration,
  );
  const medianDurationSeconds =
    (medianDuration.days ?? 0) * 86_400 +
    (medianDuration.hours ?? 0) * 3600 +
    (medianDuration.minutes ?? 0) * 60 +
    (medianDuration.seconds ?? 0);
  if (medianDurationSeconds < 60) {
    return null;
  }

  return (
    <tr>
      <td>{name}</td>
      <td>{formatDuration(medianDuration)}</td>
      <td>{data.instanceEncounterRuns.medianDeaths}</td>
      <td>
        {Math.round(
          (data.instanceEncounterRuns.averageDeaths + Number.EPSILON) * 100,
        ) / 100}
      </td>
    </tr>
  );
};
