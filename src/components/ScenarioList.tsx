import { gql, useQuery } from '@apollo/client';
import { Progress } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { getScenarioFilters } from './ScenarioFilters';
import { ScenarioListTable } from './ScenarioListTable';

const SCENARIO_LIST = gql`
  query GetScenarioList(
    $characterId: ID
    $guildId: ID
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    scenarios(
      characterId: $characterId
      guildId: $guildId
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      totalCount
      nodes {
        instanceId
        scenarioId
        startTime
        endTime
        winner
        points
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
  guildId?: String;
  perPage?: number;
}): React.ReactElement | null => {
  const { t } = useTranslation(['common', 'components']);
  const [search] = useSearchParams();

  const { loading, error, data, refetch } = useQuery<Query>(SCENARIO_LIST, {
    variables: {
      characterId,
      guildId,
      first: perPage,
      ...getScenarioFilters(search),
    },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.scenarios?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const pageInfo = data?.scenarios?.pageInfo;

  return (
    <ScenarioListTable
      data={data.scenarios.nodes}
      pageInfo={data.scenarios.pageInfo}
      onNext={() =>
        refetch({
          first: perPage,
          after: pageInfo?.endCursor,
          last: undefined,
          before: undefined,
        })
      }
      onPrevious={() =>
        refetch({
          first: undefined,
          after: undefined,
          last: perPage,
          before: pageInfo?.startCursor,
        })
      }
    />
  );
};
