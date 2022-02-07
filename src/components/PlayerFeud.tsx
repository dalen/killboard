import { gql } from '@apollo/client';
import { KillsList } from './KillsList';

const PLAYER_FEUD = gql`
  query GetPlayerFeud($player1Id: ID!, $player2Id: ID!) {
    playerFeudKills(player1Id: $player1Id, player2Id: $player2Id, first: 10) {
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
          variables: { player1Id: player1, player2Id: player2 },
        }}
      />
    </div>
  );
};
