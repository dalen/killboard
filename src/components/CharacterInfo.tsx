import { gql, useQuery } from '@apollo/client';
import {
  Progress,
  Notification,
  Card,
  Icon,
  Media,
  Image,
} from 'react-bulma-components';
import { Link } from 'react-router-dom';
import { Query } from '../types';
import { careerIcon } from '../utils';

// Temporary way of fetching this until new API version is deployed
const CHARACTER_INFO = gql`
  query GetCharacterInfo($id: ID!) {
    kills(victimId: $id, first: 1) {
      nodes {
        victim {
          character {
            id
            career
            name
            level
            renownRank
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
    <Card mb={5}>
      <Card.Content>
        <Media>
          <Media.Item align={'left'}>
            <Image
              size={'128'}
              src={`/images/corner_icons/ea_icon_corner_character.png`}
              alt="Character"
            />
          </Media.Item>
          <Media.Item>
            <p className="is-size-4">
              <strong>{character.character.name}</strong>
            </p>
            <p>
              <Icon.Text>
                <strong>Career: </strong>
                <Icon>
                  <img
                    src={careerIcon(character.character.career)}
                    alt={character.character.career}
                  />
                </Icon>
                <span>{character.character.career}</span>
              </Icon.Text>
            </p>
            <p>
              <strong>Level: </strong>
              {character.character.level}
            </p>
            <p>
              <strong>Renown Rank: </strong>
              {character.character.renownRank}
            </p>
            {character.guild != null && (
              <p>
                <strong>Guild: </strong>
                <Link to={`/guild/${character.guild.id}`}>
                  {character.guild.name}
                </Link>
              </p>
            )}
          </Media.Item>
        </Media>
      </Card.Content>
    </Card>
  );
};
