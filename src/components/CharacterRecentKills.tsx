import { gql } from '@apollo/client';
import { KillsList } from './KillsList';

const RECENT_KILLS = gql`
  query GetLatestCharacterKills($id: ID!) {
    kills(killerId: $id, first: 5) {
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
      }
    }
  }
`;

export const CharacterRecentKills = ({ id }: { id: number }): JSX.Element => {
  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        Recent Deaths
      </div>
      <KillsList
        query={RECENT_KILLS}
        queryOptions={{
          variables: { id },
        }}
        showKiller={false}
      />
    </div>
  );
};
