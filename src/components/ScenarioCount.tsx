import { gql, useQuery } from '@apollo/client';
import { Progress } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { getScenarioFilters } from './ScenarioFilters';

const SCENARIO_COUNT = gql`
  query GetScenarioCount(
    $characterId: ID
    $guildId: ID
    $queueType: ScenarioQueueType
    $premadeOnly: Boolean
    $wins: Boolean
  ) {
    scenarios(
      characterId: $characterId
      guildId: $guildId
      queueType: $queueType
      premadeOnly: $premadeOnly
      wins: $wins
    ) {
      totalCount
    }
  }
`;

export function ScenarioCount({
  characterId,
  guildId,
  wins,
  title,
}: {
  characterId?: string;
  guildId?: String;
  wins: boolean;
  title: string;
}): React.ReactElement | null {
  const { t } = useTranslation(['common', 'components']);
  const [search] = useSearchParams();

  const { loading, error, data } = useQuery<Query>(SCENARIO_COUNT, {
    variables: {
      characterId,
      guildId,
      wins,
      ...getScenarioFilters(search),
    },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.scenarios?.totalCount == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <div className="is-size-4 is-family-secondary is-uppercase">
      {title} {data.scenarios.totalCount != null && data.scenarios.totalCount}
    </div>
  );
}
