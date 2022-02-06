import { gql, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  Card,
  Columns,
  Container,
  Image,
  Progress,
  Notification,
  Media,
} from 'react-bulma-components';
import { Link, useParams } from 'react-router-dom';
import { CharacterInfo } from '../components/CharacterInfo';
import { CharacterRecentDeaths } from '../components/CharacterRecentDeaths';
import { CharacterRecentKills } from '../components/CharacterRecentKills';
import { GuildRecentDeaths } from '../components/GuildRecentDeaths';
import { GuildRecentKills } from '../components/GuildRecentKills';
import { Zones, Scenarios } from '../enums';
import { Query } from '../types';

const GUILD_INFO = gql`
  query GetGuildInfo($id: ID!) {
    guild(id: $id) {
      name
      aboutUs
      leader {
        id
        name
        career
      }
      members {
        nodes {
          rank {
            name
          }
          character {
            id
            name
            career
          }
        }
      }
    }
  }
`;

export const Guild = (): JSX.Element => {
  const { id } = useParams();
  const { loading, error, data } = useQuery<Query>(GUILD_INFO, {
    variables: { id: Number(id) },
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

  if (data?.guild == null)
    return <Notification color={'danger'}>Not found</Notification>;

  return (
    <Container max breakpoint={'widescreen'} mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/guild/${id}`}>Guild #{id}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Card mb={5}>
        <Card.Content>
          <Media>
            <Media.Item align={'left'}>
              <Image
                size={'48'}
                src={`/images/corner_icons/ea_icon_corner_guild.png`}
                alt="Guild"
              />
            </Media.Item>
            <Media.Item>
              <p className="is-size-4">
                <strong>{data.guild.name}</strong>
              </p>
              <p>
                <strong>Leader: </strong>
                <Link to={`/character/${data.guild.leader.id}`}>
                  {data.guild.leader.name}
                </Link>
              </p>
              <p>
                <strong>About Us: </strong>
                {data.guild.aboutUs}
              </p>
            </Media.Item>
          </Media>
        </Card.Content>
      </Card>
      <GuildRecentKills id={Number(id)} />
      <GuildRecentDeaths id={Number(id)} />
    </Container>
  );
};
