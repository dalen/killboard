import { gql } from '@apollo/client';
import { SkirmishList } from './SkirmishList';
import { SkirmishFilters } from './SkirmishFilters';

const LATEST_SKIRMISHES = gql`
  query GetGuildLatestSkirmishes(
    $guildId: ID
    $where: SkirmishFilterInput
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    skirmishes(
      guildId: $guildId
      where: $where
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

export function GuildLatestSkirmishes({
  guildId,
  perPage = 15,
}: {
  guildId?: String;
  perPage?: number;
}): JSX.Element {
  return (
    <>
      <SkirmishFilters />
      <SkirmishList
        query={LATEST_SKIRMISHES}
        queryOptions={{ variables: { guildId } }}
        perPage={perPage}
      />
    </>
  );
}
