import { gql, useQuery } from '@apollo/client';
import {
  format,
  formatISO,
  formatDuration,
  intervalToDuration,
} from 'date-fns';
import {
  Breadcrumb,
  Card,
  Columns,
  Container,
  Icon,
  Progress,
  Tabs,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import _ from 'lodash';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { Query, Realm } from '../types';
import { SkirmishScoreboard } from '../components/SkirmishScoreboard';
import { SkirmishTopPlayer } from '../components/SkirmishTopPlayer';
import { ZoneHeatmap } from '../components/ZoneHeatmap';
import { SkirmishKills } from '../components/SkirmishKills';
import { GuildHeraldry } from '../components/GuildHeraldry';
import { SkirmishDamage } from '../components/SkirmishDamage';
import { SkirmishDamageByCharacter } from '../components/SkirmishDamageByCharacter';

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
}): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<Query>(SKIRMISH_INFO, {
    variables: { id },
  });

  if (loading) return <Progress />;
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
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/skirmishes">{t('common:skirmishes')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/skirmish/${id}`}>
            {t('pages:skirmishPage.skirmishId', { skirmishId: id })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Columns breakpoint="desktop">
        <Columns.Column style={{ height: '200px' }}>
          <Card style={{ height: '100%' }}>
            <Card.Content style={{ height: '100%' }}>
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
            </Card.Content>
          </Card>
        </Columns.Column>
        <Columns.Column style={{ height: '200px' }}>
          <Card style={{ height: '100%' }}>
            <Card.Content style={{ height: '100%' }}>
              <p className="is-size-5">
                <strong>Most Players</strong>
              </p>
              {skirmish.topGuildsByPlayers.map((topGuild) => (
                <div
                  key={topGuild.guild.id}
                  className="is-flex is-justify-content-space-between mb-1"
                >
                  <Icon.Text>
                    <Icon>
                      <GuildHeraldry
                        size="24"
                        heraldry={topGuild.guild.heraldry}
                        realm={topGuild.guild.realm}
                      />
                    </Icon>
                    <Link to={`/guild/${topGuild.guild.id}`}>
                      {topGuild.guild.name}
                    </Link>
                  </Icon.Text>
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
            </Card.Content>
          </Card>
        </Columns.Column>
        <Columns.Column style={{ height: '200px' }}>
          <Card style={{ height: '100%' }}>
            <Card.Content style={{ height: '100%' }}>
              <p className="is-size-5">
                <strong>Most Kills</strong>
              </p>
              {skirmish.topGuildsByKills.map((topGuild) => (
                <div
                  key={topGuild.guild.id}
                  className="is-flex is-justify-content-space-between mb-1"
                >
                  <Icon.Text>
                    <Icon>
                      <GuildHeraldry
                        size="24"
                        realm={topGuild.guild.realm}
                        heraldry={topGuild.guild.heraldry}
                      />
                    </Icon>
                    <Link to={`/guild/${topGuild.guild.id}`}>
                      {topGuild.guild.name}
                    </Link>
                  </Icon.Text>
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
            </Card.Content>
          </Card>
        </Columns.Column>
      </Columns>
      <Columns breakpoint="desktop">
        <Columns.Column size="one-third">
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
        </Columns.Column>
        <Columns.Column size="one-third">
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
        </Columns.Column>
        <Columns.Column size="one-third">
          <div className="mx-4">
            <ZoneHeatmap
              zoneId={skirmish.primaryZone?.id ?? ''}
              max={max}
              data={heatmapData}
              size={mapSize}
            />
          </div>
        </Columns.Column>
      </Columns>
      <Tabs>
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
      </Tabs>
      {tab === 'scoreboard' && <SkirmishScoreboard id={id ?? ''} />}
      {tab === 'kills' && (
        <SkirmishKills
          id={id ?? ''}
          startTime={skirmish.startTime}
          endTime={skirmish.endTime}
        />
      )}
      {tab === 'damage' && <SkirmishDamage id={id ?? ''} />}
      {tab === 'characterDamage' && <SkirmishDamageByCharacter id={id ?? ''} />}
    </Container>
  );
}
