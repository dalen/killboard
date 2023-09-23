import { gql } from '@apollo/client';
import { SkirmishList } from './SkirmishList';

const LATEST_SKIRMISHES = gql`
  query GetGuildLatestSkirmishes(
    $guildId: ID
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    skirmishes(
      guildId: $guildId
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
        scoreboardEntries {
          totalCount
        }
        kills {
          totalCount
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

export function GuildLatestSkirmishes({
  guildId,
  perPage = 15,
}: {
  guildId?: String;
  perPage?: number;
}): JSX.Element {
  return (
    <SkirmishList
      query={LATEST_SKIRMISHES}
      queryOptions={{ variables: { guildId } }}
      perPage={perPage}
    />
  );
}
