import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from './KillsList';

const RECENT_DEATHS = gql`
  query GetLatestGuildDeaths(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $from: Long
    $to: Long
    $soloOnly: Boolean
  ) {
    kills(
      victimGuildId: $id
      first: $first
      last: $last
      before: $before
      after: $after
      from: $from
      to: $to
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

export function GuildRecentDeaths({ id }: { id: number }): JSX.Element {
  const { t } = useTranslation('components');

  return (
    <KillsList
      title={t('guildRecentDeaths.title')}
      query={RECENT_DEATHS}
      queryOptions={{
        variables: { id },
      }}
      perPage={10}
    />
  );
}
