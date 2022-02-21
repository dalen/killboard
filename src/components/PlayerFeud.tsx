import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { KillsList } from './KillsList';

const PLAYER_FEUD = gql`
  query GetPlayerFeud(
    $player1Id: ID!
    $player2Id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    playerFeudKills(
      player1Id: $player1Id
      player2Id: $player2Id
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

export const PlayerFeud = ({
  player1,
  player2,
}: {
  player1: string;
  player2: string;
}): JSX.Element => {
  const { t } = useTranslation('components');

  return (
    <div className="mt-3">
      <div className="is-size-4 is-family-secondary is-uppercase">
        <Link to={`/playerfeud/${player1}/${player2}`}>
          {t('playerFeud.title')}
        </Link>
      </div>
      <KillsList
        query={PLAYER_FEUD}
        queryOptions={{
          variables: { player1Id: player1, player2Id: player2 },
        }}
        perPage={10}
      />
    </div>
  );
};
