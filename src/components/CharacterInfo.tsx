import { gql, useQuery } from '@apollo/client';
import { Progress, Notification, Panel } from 'react-bulma-components';
import { Query } from '../types';
import { careerIcon } from '../utils';

// Temporary way of fetching this until new API version is deployed
const CHARACTER_INFO = gql`
  query GetCharacterInfo($id: ID!) {
    kills(victimId: $id, first: 1) {
      nodes {
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

export const CharacterInfo = ({ id }: { id: number }): JSX.Element => {
  const { loading, error, data } = useQuery<Query>(CHARACTER_INFO, {
    variables: { id },
  });

  if (loading) return <Progress />;
  if (error)
    return (
      <Notification color={'danger'}>
        <p>Error :(</p>
        <pre>{error.name}</pre>
        <pre>{error.message}</pre>
      </Notification>
    );

  if (data?.kills?.nodes == null)
    return <Notification color={'danger'}>Not found</Notification>;

  const character = data?.kills?.nodes[0]?.victim;

  return (
    <Panel>
      <Panel.Block>
        <Panel.Icon>
          <img
            src={careerIcon(character.character.career)}
            alt={character.character.career}
          />
        </Panel.Icon>
        {character.character.name}
      </Panel.Block>
      {character.guild && (
        <Panel.Block>
          <Panel.Icon>
            <img src="/images/icons/guild.png" alt={character.guild?.name} />
          </Panel.Icon>
          {character.guild?.name}
        </Panel.Block>
      )}
    </Panel>
  );
};
