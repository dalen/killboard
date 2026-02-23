import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getScenarioFilters } from '@/components/scenario/ScenarioFilters';
import { ScenarioListTable } from '@/components/scenario/ScenarioListTable';
import { QueryPagination } from '@/components/global/QueryPagination';

const SCENARIO_LIST = gql`
  query GetScenarioList(
    $characterId: ID
    $guildId: ID
    $queueType: ScenarioQueueType
    $premadeOnly: Boolean
    $where: ScenarioRecordFilterInput
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    scenarios(
      characterId: $characterId
      guildId: $guildId
      queueType: $queueType
      premadeOnly: $premadeOnly
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
  }
`;

export const ScenarioList = ({
  characterId,
  guildId,
  perPage = 15,
}: {
  characterId?: string;
  guildId?: string;
  perPage?: number;
}): React.ReactElement | null => {
  const { t } = useTranslation(['common', 'components']);
  const [search] = useSearchParams();

  const { loading, error, data, refetch } = useQuery<Query>(SCENARIO_LIST, {
    variables: {
      characterId,
      first: perPage,
      guildId,
      ...getScenarioFilters(search),
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

  return (
    <>
      <ScenarioListTable data={data.scenarios.nodes} />
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </>
  );
};
