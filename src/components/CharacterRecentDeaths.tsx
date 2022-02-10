import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from './KillsList';

const RECENT_DEATHS = gql`
  query GetLatestCharacterDeaths(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    kills(
      victimId: $id
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        id
        time
        position {
          zoneId
        }
        scenarioId
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

export const CharacterRecentDeaths = ({ id }: { id: number }): JSX.Element => {
  const { t } = useTranslation('components');

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        {t('characterRecentDeaths.title')}
      </div>
      <KillsList
        query={RECENT_DEATHS}
        queryOptions={{
          variables: { id },
        }}
        perPage={5}
        showTime={false}
        showVictim={false}
      />
    </div>
  );
};
