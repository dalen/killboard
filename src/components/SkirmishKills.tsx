import { gql } from '@apollo/client';
import { KillsList } from './KillsList';
import { ReactElement } from 'react';

const SKIRMISH_KILLS = gql`
  query GetSkirmishKills(
    $id: UUID!
    $startTime: Int
    $endTime: Int
    $first: Int
    $last: Int
    $before: String
    $after: String
    $soloOnly: Boolean
  ) {
    kills(
      first: $first
      last: $last
      before: $before
      after: $after
      soloOnly: $soloOnly
      where: {
        and: [{ time: { gte: $startTime } }, { time: { lte: $endTime } }]
        skirmishId: { eq: $id }
      }
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

export function SkirmishKills({
  id,
  startTime,
  endTime,
}: {
  id: string;
  startTime: number;
  endTime: number;
}): ReactElement {
  return (
    <KillsList
      query={SKIRMISH_KILLS}
      queryOptions={{
        variables: { id, startTime, endTime },
      }}
      perPage={25}
    />
  );
}
