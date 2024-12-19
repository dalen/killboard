import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from './KillsList';

const RECENT_KILLS = gql`
  query GetLatestCharacterKills(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $from: Int
    $to: Int
    $soloOnly: Boolean
  ) {
    kills(
      where: { killerCharacterId: { eq: $id }, time: { gte: $from, lte: $to } }
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
          damagePercent
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

export function CharacterRecentKills({ id }: { id: number }): JSX.Element {
  const { t } = useTranslation('components');

  return (
    <KillsList
      title={t('characterRecentKills.title')}
      query={RECENT_KILLS}
      queryOptions={{
        variables: { id },
      }}
      perPage={10}
      showTime={false}
      showKiller={false}
    />
  );
}
