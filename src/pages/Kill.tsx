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
    kill(id: $id, includeAssists: true) {
      scenario {
        id
        name
      }
      instanceId
      skirmish {
        id
      }
      time
      position {
        zoneId
        zone {
          name
        }
        x
        y
        mapSetup {
          nwCornerX
          nwCornerY
          seCornerX
          seCornerY
        }
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
      damage {
        attackerType
        damageType
        attacker {
          id
        }
        ability {
          id
          name
          iconUrl
        }
        damageAmount
      }
      deathblow {
        id
      }
    }
  }
`;

export function Kill(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<Query>(KILL_DETAILS, {
    variables: { id },
  });

  const kill = data?.kill;

  if (loading || kill == null) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const date = new Date(kill.time * 1000);

  return (
    <Container max breakpoint="desktop" mt={2}>
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
            <Media.Item align="left">
              <Image
                size="128"
                src="/images/corner_icons/ea_icon_corner_rvr.png"
                alt="Guild"
              />
            </Media.Item>
            <Media.Item>
              <p className="is-size-4">
                <strong>
                  {kill.scenario == null
                    ? kill.position.zone?.name
                    : kill.scenario?.name}
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
              {kill.instanceId && (
                <p>
                  <Link to={`/scenario/${kill.instanceId}`}>
                    Scenario Scoreboard
                  </Link>
                </p>
              )}
              {kill.skirmish?.id && (
                <p>
                  <Link to={`/skirmish/${kill.skirmish.id}`}>Skirmish</Link>
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
            attacker={kill.attackers[0]}
            killDamage={kill.damage.filter(
              (e) => e.attacker?.id === kill.attackers[0].character.id,
            )}
            showKillDamage
            deathblow={kill.deathblow?.id === kill.attackers[0].character.id}
          />
          {sortBy(kill.attackers.slice(1), (e) => -e.damagePercent).map(
            (attacker) => (
              <Attacker
                title="Assist"
                attacker={attacker}
                killDamage={kill.damage.filter(
                  (e) => e.attacker?.id === attacker.character.id,
                )}
                showKillDamage
                key={`assisting_attacker_${attacker.character.id}`}
                deathblow={kill.deathblow?.id === attacker.character.id}
              />
            ),
          )}
        </Columns.Column>
        <Columns.Column>
          <Card>
            <Card.Header backgroundColor="info-dark">
              <Card.Header.Icon>
                <CareerIcon career={kill.victim.character.career} />
              </Card.Header.Icon>
              <Card.Header.Title textColor="white">
                <strong className="mr-1">Victim:</strong>
                <Link to={`/character/${kill.victim.character.id}`}>
                  {kill.victim.character.name}
                </Link>
              </Card.Header.Title>
            </Card.Header>
            {kill.victim.guild && (
              <Card.Content py={2}>
                <Media>
                  <Media.Item align="left">
                    <small>
                      Lvl {kill.victim.level}
                      <br />
                      RR {kill.victim.renownRank}
                    </small>
                  </Media.Item>
                  <Media.Item align="left">
                    <GuildHeraldry
                      size="48"
                      heraldry={kill.victim.guild.heraldry}
                      realm={kill.victim.guild.realm}
                    />
                  </Media.Item>
                  <Media.Item>
                    <Link to={`/guild/${kill.victim.guild?.id}`}>
                      {kill.victim.guild?.name}
                    </Link>
                  </Media.Item>
                </Media>
              </Card.Content>
            )}
            <Card.Content>
              <Map
                zoneId={kill.position?.zoneId}
                x={kill.position?.x}
                y={kill.position?.y}
                nwCornerX={kill.position?.mapSetup?.nwCornerX}
                nwCornerY={kill.position?.mapSetup?.nwCornerY}
                seCornerX={kill.position?.mapSetup?.seCornerX}
                seCornerY={kill.position?.mapSetup?.seCornerY}
              />
            </Card.Content>
          </Card>
        </Columns.Column>
      </Columns>
      <PlayerFeud
        player1={kill.attackers[0].character.id ?? ''}
        player2={kill.victim.character.id ?? ''}
      />
      {kill.attackers[0].guild && kill.victim.guild && (
        <GuildFeud
          guild1={kill.attackers[0].guild.id ?? ''}
          guild2={kill.victim.guild.id ?? ''}
        />
      )}
    </Container>
  );
}
