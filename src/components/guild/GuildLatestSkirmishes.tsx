import { gql } from '@apollo/client';
import { useSearchParams } from 'react-router';
import { SkirmishList } from '@/components/skirmish/SkirmishList';
import {
  SkirmishFilters,
  getskirmishFilters,
} from '@/components/skirmish/SkirmishFilters';
import { ReactElement } from 'react';

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
  guildId?: string;
  perPage?: number;
}): ReactElement {
  const [search] = useSearchParams();

  return (
    <>
      <SkirmishFilters />
      <SkirmishList
        query={LATEST_SKIRMISHES}
        queryOptions={{
          variables: { guildId, where: getskirmishFilters(search) },
        }}
        perPage={perPage}
      />
    </>
  );
}
