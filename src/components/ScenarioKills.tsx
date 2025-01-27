import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from './KillsList';
import { ReactElement } from 'react';

const SCENARIO_KILLS = gql`
  query GetScenarioKills(
    $id: UUID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $from: Int
    $to: Int
    $soloOnly: Boolean
  ) {
    kills(
      where: { time: { gte: $from, lte: $to }, instanceId: { eq: $id } }
      first: $first
      last: $last
      before: $before
      after: $after
      soloOnly: $soloOnly
    ) {
      totalCount
      nodes {
        id
        time
        position {
          zoneId
        }
        scenario {
          id
        }
        attackers {
          level
          renownRank
          damagePercent
          character {
            id
            career
            name
          }
          guild {
            id
            name
          }
        }
        victim {
          level
          renownRank
          character {
            id
            career
            name
          }
          guild {
            id
            name
          }
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

export function ScenarioKills({ id }: { id: string }): ReactElement {
  const { t } = useTranslation('components');

  return (
    <KillsList
      title={t('scenarioKills.title')}
      query={SCENARIO_KILLS}
      queryOptions={{
        variables: { id },
      }}
      perPage={10}
    />
  );
}
