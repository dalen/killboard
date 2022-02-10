import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from './KillsList';

const RECENT_KILLS = gql`
  query GetLatestCharacterKills($id: ID!, $cursor: String) {
    kills(killerId: $id, first: 5, after: $cursor) {
      nodes {
        id
        time
        position {
          zoneId
        }
        scenarioId
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
      }
    }
  }
`;

export const CharacterRecentKills = ({ id }: { id: number }): JSX.Element => {
  const { t } = useTranslation('components');

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        {t('characterRecentKills.title')}
      </div>
      <KillsList
        query={RECENT_KILLS}
        queryOptions={{
          variables: { id },
        }}
        showTime={false}
        showKiller={false}
      />
    </div>
  );
};
