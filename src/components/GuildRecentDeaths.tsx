import { gql } from '@apollo/client';
import { KillsList } from './KillsList';

const RECENT_DEATHS = gql`
  query GetLatestGuildDeaths($id: ID!) {
    kills(victimGuildId: $id, first: 5) {
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

export const GuildRecentDeaths = ({ id }: { id: number }): JSX.Element => {
  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        Recent Deaths
      </div>
      <KillsList
        query={RECENT_DEATHS}
        queryOptions={{
          variables: { id },
        }}
      />
    </div>
  );
};