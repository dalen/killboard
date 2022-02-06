import { gql, useQuery } from '@apollo/client';
import { format, formatISO } from 'date-fns';
import {
  Progress,
  Notification,
  Container,
  Breadcrumb,
  Columns,
  Card,
  Media,
  Image,
} from 'react-bulma-components';
import { Link, useParams } from 'react-router-dom';
import { Attacker } from '../components/Attacker';
import { CareerIcon } from '../components/CareerIcon';
import { PlayerFeud } from '../components/PlayerFeud';
import { Map } from '../components/Map';
import { Scenarios, Zones } from '../enums';
import { Query } from '../types';

const KILL_DETAILS = gql`
  query GetKill($id: ID!) {
    kill(id: $id) {
      scenarioId
      time
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

  const date = new Date(data.kill.time * 1000);

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
      <Card mb={5}>
        <Card.Content>
          <Media>
            <Media.Item align={'left'}>
              <Image
                size={'128'}
                src={`/images/corner_icons/ea_icon_corner_rvr.png`}
                alt="Guild"
              />
            </Media.Item>
            <Media.Item>
              <p className="is-size-4">
                <strong>
                  {data.kill.scenarioId === 0
                    ? Zones[data.kill.position?.zoneId]
                    : Scenarios[data.kill.scenarioId]}
                </strong>
              </p>
              <p>
                <strong>Date: </strong>
                {formatISO(date, { representation: 'date' })}
              </p>
              <p>
                <strong>Time: </strong>
                {format(date, 'HH:mm:ss')}
              </p>
            </Media.Item>
          </Media>
        </Card.Content>
      </Card>
      <Columns>
        <Columns.Column>
          <Attacker title="Killer" attacker={data.kill.attackers[0]} />
          {data.kill.attackers.slice(1).map((attacker) => (
            <Attacker title="Assist" attacker={attacker} />
          ))}
        </Columns.Column>
        <Columns.Column>
          <Card>
            <Card.Header backgroundColor="info-dark">
              <Card.Header.Icon>
                <CareerIcon career={data.kill.victim.character.career} />
              </Card.Header.Icon>
              <Card.Header.Title textColor="white">
                <strong className="mr-1">Victim:</strong>
                <Link to={`/character/${data.kill.victim.character.id}`}>
                  {data.kill.victim.character.name}
                </Link>
              </Card.Header.Title>
            </Card.Header>
            {data.kill.victim.guild && (
              <Card.Content>
                <Media>
                  <Media.Item align={'left'}>
                    <figure className="image is-32x32">
                      <img src="/images/icons/guild.png" alt="Guild" />
                    </figure>
                  </Media.Item>
                  <Media.Item>
                    <Link to={`/guild/${data.kill.victim.guild?.id}`}>
                      {data.kill.victim.guild?.name}
                    </Link>
                  </Media.Item>
                </Media>
              </Card.Content>
            )}
            <Card.Content>
              <Map
                zoneId={data.kill.position?.zoneId}
                scenarioId={data.kill.scenarioId}
                x={data.kill.position?.x}
                y={data.kill.position?.y}
              />
            </Card.Content>
          </Card>
        </Columns.Column>
      </Columns>
      <PlayerFeud
        player1={data.kill.attackers[0].character.id ?? ''}
        player2={data.kill.victim.character.id ?? ''}
      />
    </Container>
  );
};
