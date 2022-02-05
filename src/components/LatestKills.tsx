import { gql } from '@apollo/client';
import { KillsList } from './KillsList';

const LATEST_KILLS = gql`
  query GetLatestKills {
    kills(first: 10) {
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

export const LatestKills = (): JSX.Element => {
  return <KillsList query={LATEST_KILLS} title="Recent Kills" />;
};
