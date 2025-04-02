import { gql } from '@apollo/client';
import { SkirmishList } from '@/components/skirmish/SkirmishList';
import { ReactElement } from 'react';

const SKIRMISHES = gql`
  query GetScenarioSkirmishes(
    $instanceId: UUID
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    skirmishes(
      where: { instanceId: { eq: $instanceId } }
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        id
        scenario {
          id
          name
        }
        primaryZone {
          id
          name
        }
        primaryZoneArea {
          id
          name
        }
        startTime
        endTime
        topGuildsByPlayers {
          guild {
            id
            name
            realm
            heraldry {
              emblem
              pattern
              color1
              color2
              shape
            }
          }
          count
        }
        numberOfKills
        numberOfKillsOrder
        numberOfKillsDestruction
        numberOfPlayers
        numberOfPlayersOrder
        numberOfPlayersDestruction
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

export function ScenarioSkirmishes({
  id,
  perPage = 15,
}: {
  id: string;
  perPage?: number;
}): ReactElement {
  return (
    <SkirmishList
      query={SKIRMISHES}
      queryOptions={{ variables: { instanceId: id } }}
      perPage={perPage}
    />
  );
}
