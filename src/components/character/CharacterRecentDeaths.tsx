import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

const RECENT_DEATHS = gql`
  query GetLatestCharacterDeaths(
    $id: UnsignedInt!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $time: IntOperationFilterInput
    $soloOnly: Boolean
  ) {
    kills(
      where: { victimCharacterId: { eq: $id }, time: $time }
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

export function CharacterRecentDeaths({ id }: { id: number }): ReactElement {
  const { t } = useTranslation('components');

  return (
    <KillsList
      title={t('characterRecentDeaths.title')}
      query={RECENT_DEATHS}
      queryOptions={{
        variables: { id, time: {} },
      }}
      perPage={10}
      showTime={false}
      showVictim={false}
    />
  );
}
