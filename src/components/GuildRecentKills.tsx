import { gql } from '@apollo/client';
import { KillsList } from './KillsList';

const RECENT_KILLS = gql`
  query GetLatestGuildKills($id: ID!) {
    kills(killerGuildId: $id, first: 5) {
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
    }
  }
`;

export const GuildRecentKills = ({ id }: { id: number }): JSX.Element => {
  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        Recent Kills
      </div>
      <KillsList
        query={RECENT_KILLS}
        queryOptions={{
          variables: { id },
        }}
      />
    </div>
  );
};
