import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from './KillsList';

const LATEST_KILLS = gql`
  query GetLatestKills(
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    kills(first: $first, last: $last, before: $before, after: $after) {
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
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const LatestKills = (): JSX.Element => {
  const { t } = useTranslation('components');

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        {t('latestKills.title')}
      </div>
      <KillsList query={LATEST_KILLS} perPage={10} />
    </div>
  );
};
