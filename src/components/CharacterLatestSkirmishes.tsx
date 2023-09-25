import { gql } from '@apollo/client';
import { SkirmishList } from './SkirmishList';

const LATEST_SKIRMISHES = gql`
  query GetCharacterLatestSkirmishes(
    $characterId: ID
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    skirmishes(
      characterId: $characterId
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

export function CharacterLatestSkirmishes({
  characterId,
  perPage = 15,
}: {
  characterId?: string;
  perPage?: number;
}): JSX.Element {
  return (
    <SkirmishList
      query={LATEST_SKIRMISHES}
      queryOptions={{ variables: { characterId } }}
      perPage={perPage}
    />
  );
}
