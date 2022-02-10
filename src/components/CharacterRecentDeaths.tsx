import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from './KillsList';

const RECENT_DEATHS = gql`
  query GetLatestCharacterDeaths($id: ID!, $cursor: String) {
    kills(victimId: $id, first: 5, after: $cursor) {
      nodes {
        id
        time
        position {
          zoneId
        }
        scenarioId
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
        showTime={false}
        showVictim={false}
      />
    </div>
  );
};
