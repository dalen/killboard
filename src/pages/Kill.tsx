import { gql, useQuery } from '@apollo/client';
import { format, formatISO } from 'date-fns';
import sortBy from 'lodash/sortBy';
import {
  Progress,
  Container,
  Breadcrumb,
  Columns,
  Card,
  Media,
  Image,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Attacker } from '../components/Attacker';
import { CareerIcon } from '../components/CareerIcon';
import { PlayerFeud } from '../components/PlayerFeud';
import { Map } from '../components/Map';
import { Query } from '../types';
import { GuildFeud } from '../components/GuildFeud';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { GuildHeraldry } from '../components/GuildHeraldry';

const KILL_DETAILS = gql`
  query GetKill($id: ID!) {
    kill(id: $id) {
      scenario {
        id
        name
      }
      instanceId
      time
      position {
        zoneId
        zone {
          name
        }
        x
        y
      }
      victim {
        level
        renownRank
        character {
          id
          name
          career
        }
        guild {
          id
          name
          realm
          heraldry {
            emblem
            pattern
            color1
            color2
            shape
          }
        }
      }
      attackers {
        damagePercent
        level
        renownRank
        character {
          id
          name
          career
        }
        guild {
          id
          name
          realm
          heraldry {
            emblem
            pattern
            color1
            color2
            shape
          }
        }
      }
    }
  }
`;

export const Kill = (): JSX.Element => {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<Query>(KILL_DETAILS, {
    variables: { id },
  });

  if (loading || data?.kill == null) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const date = new Date(data.kill.time * 1000);

  return (
    <Container max breakpoint={'desktop'} mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/kill/${id}`}>
            {t('pages:killPage.killId', { killId: id })}
          </Link>
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
                  {data.kill.scenario == null
                    ? data.kill.position.zone?.name
                    : data.kill.scenario?.name}
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
              {data.kill.instanceId && (
                <p>
                  <Link to={`/scenario/${data.kill.instanceId}`}>
                    Scenario Scoreboard
                  </Link>
                </p>
              )}
            </Media.Item>
          </Media>
        </Card.Content>
      </Card>
      <Columns>
        <Columns.Column>
          <Attacker
            title={t('pages:killPage.killer')}
            attacker={data.kill.attackers[0]}
          />
          {sortBy(data.kill.attackers.slice(1), (e) => -e.damagePercent).map(
            (attacker) => (
              <Attacker
                title="Assist"
                attacker={attacker}
                key={`assisting_attacker_${attacker.character.id}`}
              />
            )
          )}
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
              <Card.Content py={2}>
                <Media>
                  <Media.Item align={'left'}>
                    <small>
                      Lvl {data.kill.victim.level}
                      <br />
                      RR {data.kill.victim.renownRank}
                    </small>
                  </Media.Item>
                  <Media.Item align={'left'}>
                    <GuildHeraldry size="48" guild={data.kill.victim.guild} />
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
      {data.kill.attackers[0].guild && data.kill.victim.guild && (
        <GuildFeud
          guild1={data.kill.attackers[0].guild.id ?? ''}
          guild2={data.kill.victim.guild.id ?? ''}
        />
      )}
    </Container>
  );
};
