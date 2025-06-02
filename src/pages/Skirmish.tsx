import { gql, useQuery } from '@apollo/client';
import {
  format,
  formatISO,
  formatDuration,
  intervalToDuration,
} from 'date-fns';

import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import _ from 'lodash';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { Realm } from '@/__generated__/graphql';
import { SkirmishScoreboard } from '@/components/skirmish/SkirmishScoreboard';
import { SkirmishTopPlayer } from '@/components/skirmish/SkirmishTopPlayer';
import { ZoneHeatmap } from '@/components/ZoneHeatmap';
import { SkirmishKills } from '@/components/skirmish/SkirmishKills';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { SkirmishDamage } from '@/components/skirmish/SkirmishDamage';
import { SkirmishDamageByCharacter } from '@/components/skirmish/SkirmishDamageByCharacter';
import { ReactElement } from 'react';
import { GetSkirmishInfoQuery } from '@/__generated__/graphql';

const SKIRMISH_INFO = gql`
  query GetSkirmishInfo($id: ID!) {
    skirmish(id: $id) {
      id
      instance {
        id
        scenario {
          id
          name
        }
      }
      primaryZone {
        id
        name
      }
      startTime
      endTime
      heatmap {
        x
        y
        count
      }
      numberOfKills
      numberOfKillsOrder
      numberOfKillsDestruction
      numberOfPlayers
      numberOfPlayersOrder
      numberOfPlayersDestruction
      topGuildsByPlayers {
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
        count
      }
      topGuildsByKills {
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
        count
      }
    }
  }
`;

export function Skirmish({
  tab,
}: {
  tab: 'scoreboard' | 'kills' | 'damage' | 'characterDamage';
}): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<GetSkirmishInfoQuery>(
    SKIRMISH_INFO,
    {
      variables: { id },
    },
  );

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.skirmish == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { skirmish } = data;

  const startDate = new Date(skirmish.startTime * 1000);
  const endDate = new Date(skirmish.endTime * 1000);
  const durationObject = intervalToDuration({
    start: startDate,
    end: endDate,
  });
  // Skip seconds in the duration
  if (durationObject.days || durationObject.hours || durationObject.minutes) {
    durationObject.seconds = undefined;
  }
  const duration = formatDuration(durationObject);

  const mapSize = 300;
  const heatmapData = data.skirmish.heatmap.map(
    (point): [number, number, number] => [
      point.x * (mapSize / 64) + mapSize / 64 / 2,
      point.y * (mapSize / 64) + mapSize / 64 / 2,
      point.count,
    ],
  );

  const max: number = (_.maxBy(heatmapData, (d) => d[2]) || [0, 0, 1])[2];

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/skirmishes">{t('common:skirmishes')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/skirmish/${id}`}>
              {t('pages:skirmishPage.skirmishId', { skirmishId: id })}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="columns is-desktop">
        <div className="column" style={{ height: '200px' }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-content" style={{ height: '100%' }}>
              <p className="is-size-5">
                <strong>
                  {skirmish.instance == null ? (
                    skirmish.primaryZone?.name
                  ) : (
                    <Link to={`/scenario/${skirmish.instance.id}`}>
                      {skirmish.instance.scenario.name}
                    </Link>
                  )}
                </strong>
              </p>
              <div className="is-flex is-justify-content-space-between">
                <div>
                  <strong>{t('pages:skirmishPage.startTime')}</strong>
                </div>
                <div>
                  {formatISO(startDate, { representation: 'date' })}{' '}
                  {format(startDate, 'HH:mm')}
                </div>
              </div>
              <div className="is-flex is-justify-content-space-between">
                <div>
                  <strong>{t('pages:skirmishPage.duration')}</strong>
                </div>
                <div>{duration}</div>
              </div>
              <div className="is-flex is-justify-content-space-between">
                <div>
                  <strong>{t('pages:skirmishPage.totalPlayers')}</strong>
                </div>
                <div>
                  {skirmish.numberOfPlayers}
                  <span className="has-text-grey">
                    {' '}
                    (
                    <span className="text-color-order">
                      {skirmish.numberOfPlayersOrder}
                    </span>{' '}
                    /{' '}
                    <span className="text-color-destruction">
                      {skirmish.numberOfPlayersDestruction}
                    </span>
                    )
                  </span>
                </div>
              </div>
              <div className="is-flex is-justify-content-space-between">
                <div>
                  <strong>{t('pages:skirmishPage.totalKills')}</strong>
                </div>
                <div>
                  {skirmish.numberOfKills}{' '}
                  <span className="has-text-grey">
                    {' '}
                    (
                    <span className="text-color-order">
                      {skirmish.numberOfKillsOrder}
                    </span>{' '}
                    /{' '}
                    <span className="text-color-destruction">
                      {skirmish.numberOfKillsDestruction}
                    </span>
                    )
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="column" style={{ height: '200px' }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-content" style={{ height: '100%' }}>
              <p className="is-size-5">
                <strong>Most Players</strong>
              </p>
              {skirmish.topGuildsByPlayers.map((topGuild) => (
                <div
                  key={topGuild.guild.id}
                  className="is-flex is-justify-content-space-between mb-1"
                >
                  <span className="icon-text">
                    <span className="icon">
                      <GuildHeraldry
                        size="24"
                        heraldry={topGuild.guild.heraldry}
                        realm={topGuild.guild.realm}
                      />
                    </span>
                    <Link to={`/guild/${topGuild.guild.id}`}>
                      {topGuild.guild.name}
                    </Link>
                  </span>
                  <div
                    className={
                      topGuild.guild.realm === Realm.Destruction
                        ? 'text-color-destruction'
                        : 'text-color-order'
                    }
                  >
                    {topGuild.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="column" style={{ height: '200px' }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-content" style={{ height: '100%' }}>
              <p className="is-size-5">
                <strong>Most Kills</strong>
              </p>
              {skirmish.topGuildsByKills.map((topGuild) => (
                <div
                  key={topGuild.guild.id}
                  className="is-flex is-justify-content-space-between mb-1"
                >
                  <span className="icon-text">
                    <span className="icon">
                      <GuildHeraldry
                        size="24"
                        realm={topGuild.guild.realm}
                        heraldry={topGuild.guild.heraldry}
                      />
                    </span>
                    <Link to={`/guild/${topGuild.guild.id}`}>
                      {topGuild.guild.name}
                    </Link>
                  </span>
                  <div
                    className={
                      topGuild.guild.realm === Realm.Destruction
                        ? 'text-color-destruction'
                        : 'text-color-order'
                    }
                  >
                    {topGuild.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="columns is-desktop">
        <div className="column is-4">
          <SkirmishTopPlayer
            id={id ?? ''}
            attribute="damage"
            title="pages:skirmishPage.topDamagePlayer"
            className="skirmish-top-damage-player"
          />
          <SkirmishTopPlayer
            id={id ?? ''}
            attribute="healing"
            title="pages:skirmishPage.topHealingPlayer"
            className="skirmish-top-healing-player"
          />
        </div>
        <div className="column is-4">
          <SkirmishTopPlayer
            id={id ?? ''}
            attribute="deathBlows"
            title="pages:skirmishPage.topDeathBlowsPlayer"
            className="skirmish-top-deathblows-player"
          />
          <SkirmishTopPlayer
            id={id ?? ''}
            attribute="protection"
            title="pages:skirmishPage.topProtectionPlayer"
            className="skirmish-top-protection-player"
          />
        </div>
        <div className="column is-4">
          <div className="mx-4">
            <ZoneHeatmap
              zoneId={skirmish.primaryZone?.id ?? ''}
              max={max}
              data={heatmapData}
              size={mapSize}
            />
          </div>
        </div>
      </div>
      <div className="tabs">
        <li className={tab === 'scoreboard' ? 'is-active' : ''}>
          <Link to={`/skirmish/${id}`}>
            {t('pages:skirmishPage.scoreboard')}
          </Link>
        </li>
        <li className={tab === 'kills' ? 'is-active' : ''}>
          <Link to={`/skirmish/${id}/kills`}>
            {t('pages:skirmishPage.kills')}
          </Link>
        </li>
        <li className={tab === 'damage' ? 'is-active' : ''}>
          <Link to={`/skirmish/${id}/damage`}>
            {t('pages:skirmishPage.damage')}
          </Link>
        </li>
      </div>
      {tab === 'scoreboard' && <SkirmishScoreboard id={id ?? ''} />}
      {tab === 'kills' && <SkirmishKills id={id ?? ''} />}
      {tab === 'damage' && <SkirmishDamage id={id ?? ''} />}
      {tab === 'characterDamage' && <SkirmishDamageByCharacter id={id ?? ''} />}
    </div>
  );
}
