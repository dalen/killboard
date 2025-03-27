import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from '../kill/KillsList';
import { ReactElement } from 'react';

const RECENT_KILLS = gql`
  query GetLatestGuildKills(
    $id: UnsignedInt!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $time: IntOperationFilterInput
    $soloOnly: Boolean
  ) {
    kills(
      where: { killerGuildId: { eq: $id }, time: $time }
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

export function GuildRecentKills({ id }: { id: number }): ReactElement {
  const { t } = useTranslation('components');

  return (
    <KillsList
      title={t('guildRecentKills.title')}
      query={RECENT_KILLS}
      queryOptions={{
        variables: { id, time: {} },
      }}
      perPage={10}
    />
  );
}
