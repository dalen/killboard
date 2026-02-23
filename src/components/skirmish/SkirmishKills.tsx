import { gql } from '@apollo/client';
import { KillsList } from '@/components/kill/KillsList';
import type { ReactElement } from 'react';

const SKIRMISH_KILLS = gql`
  query GetSkirmishKills(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $soloOnly: Boolean
    $filter: KillFilterInput
  ) {
    kills(
      first: $first
      last: $last
      before: $before
      after: $after
      soloOnly: $soloOnly
      where: $filter
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

export const SkirmishKills = ({ id }: { id: string }): ReactElement => (
  <KillsList
    query={SKIRMISH_KILLS}
    queryOptions={{
      variables: { filter: { skirmishId: { eq: id } } },
    }}
    perPage={25}
  />
);
