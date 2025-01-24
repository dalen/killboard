import {
  format,
  formatDuration,
  formatISO,
  intervalToDuration,
} from 'date-fns';
import React from 'react';
import { Table, Media, Image, Icon } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Skirmish, Realm } from '../types';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { GuildHeraldry } from './GuildHeraldry';

export function SkirmishListTable({
  data,
  showZone = true,
}: {
  data: Skirmish[];
  showZone?: boolean;
}): React.ReactElement | null {
  const { t } = useTranslation(['common', 'components']);
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  return (
    <div className="table-container">
      <Table
        striped
        hoverable
        size={isMobile ? 'narrow' : 'fullwidth'}
        marginless
      >
        <thead>
          <tr>
            <th id="th-time">{t('components:skirmishList.time')}</th>
            {showZone && (
              <th id="th-location">{t('components:skirmishList.location')}</th>
            )}
            <th id="th-guilds">{t('components:skirmishList.guilds')}</th>
            <th align="center">{t('components:skirmishList.players')}</th>
            <th align="center">{t('components:skirmishList.kills')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((skirmish) => {
            const startDate = new Date(skirmish.startTime * 1000);
            const endDate = new Date(skirmish.endTime * 1000);
            const durationObject = intervalToDuration({
              start: startDate,
              end: endDate,
            });
            // Skip seconds in the duration
            if (
              durationObject.days ||
              durationObject.hours ||
              durationObject.minutes
            ) {
              durationObject.seconds = undefined;
            }
            const duration = formatDuration(durationObject);

            return (
              <tr key={skirmish.id}>
                <td>
                  <small>
                    {formatISO(startDate, { representation: 'date' })}
                    <br />
                    {format(startDate, 'HH:mm')}
                    <br />
                    {duration}
                  </small>
                </td>
                {showZone && (
                  <td>
                    {skirmish.scenario == null ? (
                      <Media>
                        <Media.Item align="left">
                          <Image
                            src="/images/icons/rvr.png"
                            alt="RvR"
                            title="RvR"
                          />
                        </Media.Item>
                        <Media.Item>
                          {skirmish.primaryZone?.name}
                          <br />
                          {skirmish.primaryZoneArea?.name}
                        </Media.Item>
                      </Media>
                    ) : (
                      <Media>
                        <Media.Item align="left">
                          <Image
                            src="/images/icons/scenario.png"
                            alt="Scenario"
                            title="Scenario"
                          />
                        </Media.Item>
                        <Media.Item>
                          {skirmish.scenario.name}
                          {skirmish.primaryZoneArea?.name !==
                            skirmish.scenario.name && (
                            <>
                              <br />
                              {skirmish.primaryZoneArea?.name}
                            </>
                          )}
                        </Media.Item>
                      </Media>
                    )}
                  </td>
                )}
                <td>
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
                </td>
                <td align="center">
                  {skirmish.numberOfPlayers}
                  <br />
                  <span className="text-color-order">
                    {skirmish.numberOfPlayersOrder}
                  </span>
                  <span className="has-text-grey"> / </span>
                  <span className="text-color-destruction">
                    {skirmish.numberOfPlayersDestruction}
                  </span>
                </td>
                <td align="center">
                  {skirmish.numberOfKills}
                  <br />
                  <span className="text-color-order">
                    {skirmish.numberOfKillsOrder}
                  </span>
                  <span className="has-text-grey"> / </span>
                  <span className="text-color-destruction">
                    {skirmish.numberOfKillsDestruction}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/skirmish/${skirmish.id}`}
                    className="button is-primary p-2 is-pulled-right"
                  >
                    {t('components:skirmishList.details')}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
