import { gql } from '@apollo/client';
import { KillsList } from './KillsList';

const PLAYER_FEUD = gql`
  query GetPlayerFeud($killerId: ID!, $victimId: ID!) {
    kills(killerId: $killerId, victimId: $victimId, first: 10) {
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

export const PlayerFeud = ({
  player1,
  player2,
}: {
  player1: string;
  player2: string;
}): JSX.Element => {
  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        Player Feud
      </div>
      <KillsList
        query={PLAYER_FEUD}
        queryOptions={{
          variables: { killerId: player1, victimId: player2 },
        }}
      />
      <KillsList
        query={PLAYER_FEUD}
        queryOptions={{
          variables: { killerId: player2, victimId: player1 },
        }}
      />
    </div>
  );
};
