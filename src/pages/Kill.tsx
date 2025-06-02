import { gql, useQuery } from '@apollo/client';
import { format, formatISO } from 'date-fns';
import sortBy from 'lodash/sortBy';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import {
  Attacker,
  KILL_ATTACKER_FRAGMENT,
  KILL_DAMAGE_FRAGMENT,
} from '@/components/kill/Attacker';
import { CareerIcon } from '@/components/CareerIcon';
import { PlayerFeud } from '@/components/kill/PlayerFeud';
import { Map } from '@/components/Map';
import { GuildFeud } from '@/components/guild/GuildFeud';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { ReactElement } from 'react';
import { GetKillQuery } from '@/__generated__/graphql';

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
        ...Attacker
      }
      damage {
        ...KillDamage
      }
      deathblow {
        id
      }
    }
  }

  ${KILL_DAMAGE_FRAGMENT}
  ${KILL_ATTACKER_FRAGMENT}
`;

export function Kill(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<GetKillQuery>(KILL_DETAILS, {
    variables: { id },
  });

  const kill = data?.kill;

  if (loading || kill == null) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const date = new Date(kill.time * 1000);

  return (
    <div className="container is-max-desktop mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/kill/${id}`}>
              {t('pages:killPage.killId', { killId: id })}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="card mb-5">
        <div className="card-content">
          <article className="media">
            <figure className="media-left">
              <figure className="image is-128x128">
                <img
                  src="/images/corner_icons/ea_icon_corner_rvr.png"
                  alt="Guild"
                />
              </figure>
            </figure>
            <div className="media-content">
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
            </div>
          </article>
        </div>
      </div>
      <div className="columns">
        <div className="column">
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
        </div>
        <div className="column">
          <div className="card">
            <header className="card-header has-background-info-dark">
              <div className="card-header-icon">
                <CareerIcon career={kill.victim.character.career} />
              </div>
              <p className="card-header-title has-text-white">
                <strong className="mr-1">Victim:</strong>
                <Link to={`/character/${kill.victim.character.id}`}>
                  {kill.victim.character.name}
                </Link>
              </p>
            </header>
            {kill.victim.guild && (
              <div className="card-content py-2">
                <article className="media">
                  <figure className="media-left">
                    <small>
                      Lvl {kill.victim.level}
                      <br />
                      RR {kill.victim.renownRank}
                    </small>
                  </figure>
                  <figure className="media-left">
                    <GuildHeraldry
                      size="48"
                      heraldry={kill.victim.guild.heraldry}
                      realm={kill.victim.guild.realm}
                    />
                  </figure>
                  <div className="media-content">
                    <Link to={`/guild/${kill.victim.guild?.id}`}>
                      {kill.victim.guild?.name}
                    </Link>
                  </div>
                </article>
              </div>
            )}
            <div className="card-content">
              <Map
                zoneId={kill.position?.zoneId}
                x={kill.position?.x}
                y={kill.position?.y}
                nwCornerX={kill.position?.mapSetup?.nwCornerX ?? 0}
                nwCornerY={kill.position?.mapSetup?.nwCornerY ?? 0}
                seCornerX={kill.position?.mapSetup?.seCornerX ?? 0}
                seCornerY={kill.position?.mapSetup?.seCornerY ?? 0}
              />
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
}
