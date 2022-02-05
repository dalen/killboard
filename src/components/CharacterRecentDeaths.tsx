import { gql } from '@apollo/client';
import { KillsList } from './KillsList';

const RECENT_DEATHS = gql`
  query GetLatestCharacterDeaths($id: ID!) {
    kills(victimId: $id, first: 5) {
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

export const CharacterRecentDeaths = ({ id }: { id: number }): JSX.Element => {
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
        showVictim={false}
      />
    </div>
  );
};
