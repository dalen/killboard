import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

const RECENT_DEATHS = gql`
  query GetLatestGuildDeaths(
    $id: UnsignedInt!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $time: IntOperationFilterInput
    $soloOnly: Boolean
  ) {
    kills(
      where: { victimGuildId: { eq: $id }, time: $time }
      first: $first
      last: $last
      before: $before
      after: $after
      soloOnly: $soloOnly
    ) {
      nodes {
        id
        time
        position {
          zone {
            id
            name
          }
        }
        scenario {
          id
          name
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

export function GuildRecentDeaths({ id }: { id: number }): ReactElement {
  const { t } = useTranslation('components');

  return (
    <KillsList
      title={t('guildRecentDeaths.title')}
      query={RECENT_DEATHS}
      queryOptions={{
        variables: { id, time: {} },
      }}
      perPage={10}
    />
  );
}
