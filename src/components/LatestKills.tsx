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
    }
  }
`;

export const LatestKills = (): JSX.Element => {
  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        Recent Kills
      </div>
      <KillsList query={LATEST_KILLS} />
    </div>
  );
};
