import { gql, useQuery } from '@apollo/client';
import {
  Progress,
  Notification,
  Container,
  Breadcrumb,
  Columns,
  Panel,
  Card,
  Tag,
  Media,
  Icon,
  Content,
} from 'react-bulma-components';
import { Link, useParams } from 'react-router-dom';
import { CareerIcon } from '../components/CareerIcon';
import { Query } from '../types';
import { careerIcon } from '../utils';

const KILL_DETAILS = gql`
  query GetKill($id: ID!) {
    kill(id: $id) {
      position {
        zoneId
        x
        y
      }
      victim {
        character {
          id
          name
          career
        }
        guild {
          id
          name
        }
      }
      attackers {
        damagePercent
        character {
          id
          name
          career
        }
        guild {
          id
          name
        }
      }
    }
  }
`;

export const Kill = (): JSX.Element => {
  const { id } = useParams();
  const { loading, error, data } = useQuery<Query>(KILL_DETAILS, {
    variables: { id },
  });

  if (loading || data?.kill == null) return <Progress />;
  if (error)
    return (
      <Notification color={'danger'}>
        <p>Error :(</p>
        <pre>{error.name}</pre>
        <pre>{error.message}</pre>
      </Notification>
    );

  const kill = data.kill;

  return (
    <Container max breakpoint={'desktop'} mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/kill/${id}`}>Kill #{id}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Columns>
        <Columns.Column>
          <Panel color="info">
            <Panel.Header>
              <Link to={`/character/${kill.attackers[0].character.id}`}>
                {data.kill.attackers[0].character.name}
              </Link>
            </Panel.Header>
            <Link
              className="panel-block"
              to={`/character/${kill.attackers[0].character.id}`}
            >
              <Panel.Icon>
                <img
                  src={careerIcon(data.kill.attackers[0].character.career)}
                  alt={data.kill.attackers[0].character.career}
                />
              </Panel.Icon>
              {data.kill.attackers[0].character.name}
            </Link>
            <Link
              className="panel-block"
              to={`/guild/${kill.attackers[0].guild?.id}`}
            >
              <Panel.Icon>
                <img src="/images/icons/guild.png" alt="Guild" />
              </Panel.Icon>
              {data.kill.attackers[0].guild?.name}
            </Link>
          </Panel>
          <Card>
            <Card.Header backgroundColor="info-dark">
              <Card.Header.Icon>
                <CareerIcon career={data.kill.attackers[0].character.career} />
              </Card.Header.Icon>
              <Card.Header.Title textColor="white">
                {data.kill.attackers[0].character.name}
              </Card.Header.Title>
              <div className="m-3">
                <Tag rounded size={'medium'}>
                  {data.kill.attackers[0].damagePercent}%
                </Tag>
              </div>
            </Card.Header>
            <Card.Content>
              <Media>
                <Link to={`/guild/${kill.attackers[0].guild?.id}`}>
                  <Media.Item align={'left'}>
                    <figure className="image is-32x32">
                      <img src="/images/icons/guild.png" alt="Guild" />
                    </figure>
                  </Media.Item>
                  <div className="media-content">
                    {data.kill.attackers[0].guild?.name}
                  </div>
                </Link>
              </Media>
              <Icon.Text>
                <Icon>
                  <i className="fas fa-home"></i>
                  <span>Home</span>
                </Icon>
              </Icon.Text>
            </Card.Content>
          </Card>{' '}
        </Columns.Column>
        <Columns.Column>
          <Card>
            <Card.Header backgroundColor="info-dark">
              <Card.Header.Icon>
                <CareerIcon career={data.kill.victim.character.career} />
              </Card.Header.Icon>
              <Card.Header.Title textColor="white">
                {data.kill.victim.character.name}
              </Card.Header.Title>
            </Card.Header>
            <Card.Content>
              <Content>test test</Content>
            </Card.Content>
          </Card>{' '}
        </Columns.Column>
      </Columns>
    </Container>
  );
};
