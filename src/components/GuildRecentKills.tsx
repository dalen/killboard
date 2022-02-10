import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { KillsList } from './KillsList';

const RECENT_KILLS = gql`
  query GetLatestGuildKills(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    kills(
      killerGuildId: $id
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

export const GuildRecentKills = ({ id }: { id: number }): JSX.Element => {
  const { t } = useTranslation('components');

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        {t('guildRecentKills.title')}
      </div>
      <KillsList
        query={RECENT_KILLS}
        queryOptions={{
          variables: { id },
        }}
        perPage={10}
      />
    </div>
  );
};
