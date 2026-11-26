import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import type { Query, Realm } from '@/__generated__/graphql';
import type { ReactElement } from 'react';
import './GuildOverview.scss';

interface GuildOverviewData {
  killsByGuild?: Query['kills'];
  deathsByGuild?: Query['kills'];
  skirmishes?: Query['skirmishes'];
}

const GUILD_OVERVIEW = gql`
  query GetGuildOverview($id: ID!, $from: DateTime!) {
    killsByGuild: kills(
      first: 0
      where: { killerGuildId: { eq: $id }, time: { gte: $from } }
    ) {
      totalCount
    }
    deathsByGuild: kills(
      first: 0
      where: { victimGuildId: { eq: $id }, time: { gte: $from } }
    ) {
      totalCount
    }
    skirmishes(guildId: $id, first: 5, where: { startTime: { gte: $from } }) {
      nodes {
        id
        startTime
        endTime
        numberOfKills
        numberOfPlayers
        primaryZone {
          name
        }
        primaryZoneArea {
          name
        }
        scenario {
          name
        }
        topGuildsByKills {
          guild {
            id
            name
            realm
          }
          count
        }
      }
    }
  }
`;

const PERIODS = [7, 30, 90] as const;

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

const formatDuration = (start: string, end: string): string => {
  const seconds = Math.max(
    0,
    Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000),
  );
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${remainingSeconds}s`;
};

export const GuildOverview = ({
  id,
  realm,
}: {
  id: number;
  realm: Realm;
}): ReactElement => {
  const { t } = useTranslation(['common', 'components']);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(30);
  const from = useMemo(
    () => new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString(),
    [period],
  );
  const { loading, error, data } = useQuery<GuildOverviewData>(GUILD_OVERVIEW, {
    variables: { id, from },
  });

  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const kills = data?.killsByGuild?.totalCount ?? 0;
  const deaths = data?.deathsByGuild?.totalCount ?? 0;
  const net = kills - deaths;
  const skirmishes = data?.skirmishes?.nodes ?? [];

  const enemyGuilds = new Map<
    string,
    { id: string; name: string; kills: number }
  >();
  for (const skirmish of skirmishes) {
    for (const entry of skirmish.topGuildsByKills) {
      if (entry.guild.realm !== realm) {
        const current = enemyGuilds.get(entry.guild.id) ?? {
          id: entry.guild.id,
          name: entry.guild.name,
          kills: 0,
        };
        current.kills += entry.count;
        enemyGuilds.set(entry.guild.id, current);
      }
    }
  }
  const leadingEnemies = [...enemyGuilds.values()]
    .toSorted((a, b) => b.kills - a.kills)
    .slice(0, 3);

  return (
    <div className="guild-overview">
      <section className="card mb-5">
        <div className="card-content">
          <div className="level is-mobile mb-4">
            <div className="level-left">
              <div>
                <p className="heading mb-1">
                  {t('components:guildOverview.battleRecord')}
                </p>
                <h2 className="title is-4 mb-0">
                  {t('components:guildOverview.lastDays', { count: period })}
                </h2>
              </div>
            </div>
            <div className="level-right">
              <div className="select is-small">
                <select
                  aria-label={t('components:guildOverview.timeRange')}
                  value={period}
                  onChange={(event) =>
                    setPeriod(
                      Number(event.target.value) as (typeof PERIODS)[number],
                    )
                  }
                >
                  {PERIODS.map((days) => (
                    <option key={days} value={days}>
                      {t('components:guildOverview.lastDays', { count: days })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <progress className="progress is-small" />
          ) : (
            <div className="columns is-mobile is-variable is-2">
              <div className="column">
                <div className="guild-stat">
                  <p className="heading">
                    {t('components:guildOverview.guildKills')}
                  </p>
                  <p className="title is-3">{kills.toLocaleString()}</p>
                </div>
              </div>
              <div className="column">
                <div className="guild-stat">
                  <p className="heading">
                    {t('components:guildOverview.guildDeaths')}
                  </p>
                  <p className="title is-3">{deaths.toLocaleString()}</p>
                </div>
              </div>
              <div className="column">
                <div className="guild-stat">
                  <p className="heading">
                    {t('components:guildOverview.netRecord')}
                  </p>
                  <p
                    className={clsx('title is-3', {
                      'has-text-success': net > 0,
                      'has-text-danger': net < 0,
                    })}
                  >
                    {net > 0 ? '+' : ''}
                    {net.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <p className="is-size-7 has-text-grey mt-3">
            {t('components:guildOverview.recordNote')}
          </p>
        </div>
      </section>

      <div className="columns is-variable is-5">
        <div className="column is-two-thirds">
          <section className="card h-100">
            <div className="card-content">
              <div className="level is-mobile mb-4">
                <div className="level-left">
                  <div>
                    <h2 className="title is-4 mb-1">
                      {t('components:guildOverview.recentBattles')}
                    </h2>
                    <p className="subtitle is-6 mb-0">
                      {t('components:guildOverview.recentBattlesNote')}
                    </p>
                  </div>
                </div>
                <div className="level-right">
                  <Link
                    className="button is-small is-outlined"
                    to={`/guild/${id}/skirmishes`}
                  >
                    {t('components:guildOverview.allBattles')}
                  </Link>
                </div>
              </div>

              {loading && <progress className="progress is-small" />}
              {!loading && skirmishes.length === 0 && (
                <p className="has-text-grey">
                  {t('components:guildOverview.noBattles')}
                </p>
              )}
              {!loading && skirmishes.length > 0 && (
                <div className="guild-battle-list">
                  {skirmishes.map((skirmish) => (
                    <Link
                      className="guild-battle-row"
                      key={skirmish.id}
                      to={`/skirmish/${skirmish.id}`}
                    >
                      <span className="guild-battle-main">
                        <strong>
                          {skirmish.scenario?.name ??
                            skirmish.primaryZoneArea?.name ??
                            skirmish.primaryZone?.name ??
                            t('components:guildOverview.openBattle')}
                        </strong>
                        <span className="is-size-7 has-text-grey">
                          {formatDate(skirmish.startTime)} ·{' '}
                          {formatDuration(skirmish.startTime, skirmish.endTime)}
                        </span>
                      </span>
                      <span className="guild-battle-result">
                        <strong>
                          {skirmish.numberOfKills.toLocaleString()}
                        </strong>
                        <span className="is-size-7 has-text-grey">
                          {t('components:guildOverview.kills')}
                        </span>
                      </span>
                      <span className="guild-battle-result">
                        <strong>
                          {skirmish.numberOfPlayers.toLocaleString()}
                        </strong>
                        <span className="is-size-7 has-text-grey">
                          {t('components:guildOverview.players')}
                        </span>
                      </span>
                      <span aria-hidden="true" className="guild-battle-arrow">
                        ›
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="column">
          <section className="card h-100">
            <div className="card-content">
              <p className="heading mb-1">
                {t('components:guildOverview.rivalWatch')}
              </p>
              <h2 className="title is-4 mb-2">
                {t('components:guildOverview.rivalWatchTitle')}
              </h2>
              <p className="is-size-7 has-text-grey mb-4">
                {t('components:guildOverview.rivalWatchNote')}
              </p>
              {loading && <progress className="progress is-small" />}
              {!loading && leadingEnemies.length === 0 && (
                <p className="has-text-grey">
                  {t('components:guildOverview.noRivals')}
                </p>
              )}
              {!loading && leadingEnemies.length > 0 && (
                <ol className="guild-rival-list">
                  {leadingEnemies.map((enemy, index) => (
                    <li key={enemy.id}>
                      <span className="guild-rival-rank">{index + 1}</span>
                      <span className="guild-rival-details">
                        <Link to={`/guild/${enemy.id}`}>{enemy.name}</Link>
                        <Link
                          className="guild-feud-link"
                          to={`/guild/${id}/feud/${enemy.id}?period=${period}`}
                        >
                          {t('components:guildOverview.headToHead')}
                        </Link>
                      </span>
                      <span className="guild-rival-kills">
                        {enemy.kills.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
              <p className="is-size-7 has-text-grey mt-4">
                {t('components:guildOverview.rivalDataScope', {
                  count: skirmishes.length,
                })}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
