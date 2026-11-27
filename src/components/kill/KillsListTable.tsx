import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Career, type Kill } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import { GuildLink } from '@/components/global/GuildLink';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import clsx from 'clsx';
import { type KillTimeZoneMode, formatKillTime } from './killTime';
import { getCareerRealm } from './careerRealm';
import './KillsListTable.scss';

const RealmLabel = ({ career }: { career: Career }): React.ReactElement => {
  const { t } = useTranslation('components');
  const realm = getCareerRealm(career);
  return (
    <span className={`kill-realm-label is-${realm}`}>
      {t(`killsList.${realm}`)}
    </span>
  );
};

export const KillsListTable = ({
  data,
  showTime = true,
  showVictim = true,
  showKiller = true,
  mobileCards = false,
  feudPlayerId,
  timeZoneMode = 'local',
}: {
  data: Kill[];
  showTime?: boolean;
  showVictim?: boolean;
  showKiller?: boolean;
  mobileCards?: boolean;
  feudPlayerId?: number;
  timeZoneMode?: KillTimeZoneMode;
}): React.ReactElement | null => {
  const { t } = useTranslation(['common', 'components']);
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (mobileCards && isMobile) {
    return (
      <div className="kill-mobile-cards">
        {data.map((kill) => {
          const attacker = kill.attackers[0];
          const victim = kill.victim;
          const date = new Date(kill.time);
          const opponentId = showVictim
            ? victim.character.id
            : attacker?.character.id;
          const feudUrl =
            feudPlayerId != null && opponentId != null
              ? `/character/${feudPlayerId}/feud/${opponentId}`
              : null;

          return (
            <article className="kill-mobile-card" key={kill.id}>
              {showTime && (
                <time className="kill-mobile-time" dateTime={kill.time}>
                  {formatKillTime(date, timeZoneMode, 'full')}
                </time>
              )}
              <div className="kill-mobile-parties">
                {showKiller && (
                  <div className="kill-mobile-party">
                    <CareerIcon career={attacker.character.career} />
                    <div className="kill-mobile-party-details">
                      <span className="kill-mobile-party-label">
                        {t('components:killsList.killer')}
                      </span>
                      <Link to={`/character/${attacker.character.id}`}>
                        <strong>{attacker.character.name}</strong>
                      </Link>
                      <RealmLabel career={attacker.character.career} />
                      <GuildLink guild={attacker.guild} />
                      <small>
                        Lvl {attacker.level} · RR {attacker.renownRank}
                      </small>
                    </div>
                  </div>
                )}
                {showKiller && showVictim && (
                  <span className="kill-mobile-versus" aria-hidden="true">
                    vs
                  </span>
                )}
                {showVictim && (
                  <div className="kill-mobile-party kill-mobile-party-victim">
                    <CareerIcon career={victim.character.career} />
                    <div className="kill-mobile-party-details">
                      <span className="kill-mobile-party-label">
                        {t('components:killsList.victim')}
                      </span>
                      <Link to={`/character/${victim.character.id}`}>
                        <strong>{victim.character.name}</strong>
                      </Link>
                      <RealmLabel career={victim.character.career} />
                      <GuildLink guild={victim.guild} />
                      <small>
                        Lvl {victim.level} · RR {victim.renownRank}
                      </small>
                    </div>
                  </div>
                )}
              </div>
              <footer className="kill-mobile-footer">
                <span>
                  {kill.scenario?.name ??
                    kill.position.zone?.name ??
                    (kill.scenario ? 'Scenario' : 'RvR')}
                </span>
                <div className="kill-mobile-actions">
                  {feudUrl && (
                    <Link to={feudUrl} className="button is-light is-small">
                      {t('components:playerFeud.viewFeud')}
                    </Link>
                  )}
                  <Link
                    to={`/kill/${kill.id}`}
                    className="button is-primary is-small"
                  >
                    {t('components:killsList.details')}
                  </Link>
                </div>
              </footer>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="table-container">
      <table
        className={clsx(
          'table',
          'is-striped',
          'is-hoverable',
          'is-marginless',
          'warhammer-kills-table',
          isMobile ? 'is-narrow' : 'is-fullwidth',
        )}
      >
        <thead>
          <tr>
            {showTime && (
              <th id="th-time" scope="col">
                {t('components:killsList.time')}
              </th>
            )}
            {showKiller && (
              <th id="th-killer" scope="col">
                {t('components:killsList.killer')}
              </th>
            )}
            {showVictim && (
              <th id="th-victim" scope="col">
                {t('components:killsList.victim')}
              </th>
            )}
            <th scope="col">{t('components:killsList.type')}</th>
            <th aria-label={t('components:killsList.actions')} scope="col" />
          </tr>
        </thead>
        <tbody>
          {data.map((kill) => {
            const date = new Date(kill.time);
            const opponentId = showVictim
              ? kill.victim.character.id
              : kill.attackers[0]?.character.id;
            const feudUrl =
              feudPlayerId != null && opponentId != null
                ? `/character/${feudPlayerId}/feud/${opponentId}`
                : null;

            return (
              <tr key={kill.id}>
                {showTime && (
                  <td>
                    <small>
                      {formatKillTime(date, timeZoneMode, 'date')}
                      <br />
                      {formatKillTime(date, timeZoneMode, 'time')}
                    </small>
                  </td>
                )}
                {showKiller && (
                  <td>
                    <article className="media">
                      <figure className="media-left">
                        <CareerIcon
                          career={kill.attackers[0].character.career}
                        />
                      </figure>
                      <div className="media-content">
                        <div className="content">
                          <Link
                            to={`/character/${kill.attackers[0].character.id}`}
                          >
                            <strong>{kill.attackers[0].character.name}</strong>
                          </Link>
                          <RealmLabel
                            career={kill.attackers[0].character.career}
                          />
                          <br />
                          <GuildLink guild={kill.attackers[0].guild} />
                        </div>
                      </div>
                      <div className="media-right">
                        <small>
                          Lvl {kill.attackers[0].level}
                          <br />
                          RR {kill.attackers[0].renownRank}
                        </small>
                      </div>
                    </article>
                  </td>
                )}
                {showVictim && (
                  <td>
                    <article className="media">
                      <figure className="media-left">
                        <CareerIcon career={kill.victim.character.career} />
                      </figure>
                      <div className="media-content">
                        <div className="content">
                          <Link to={`/character/${kill.victim.character.id}`}>
                            <strong>{kill.victim.character.name}</strong>
                          </Link>
                          <RealmLabel career={kill.victim.character.career} />
                          <br />
                          <GuildLink guild={kill.victim.guild} />
                        </div>
                      </div>
                      <div className="media-right">
                        <small>
                          Lvl {kill.victim.level}
                          <br />
                          RR {kill.victim.renownRank}
                        </small>
                      </div>
                    </article>
                  </td>
                )}
                <td>
                  {kill.scenario == null ? (
                    <article className="media">
                      <figure className="media-left">
                        <figure className="image is-24x24">
                          <img
                            src="/images/icons/rvr.png"
                            alt="RvR"
                            title="RvR"
                          />
                        </figure>
                      </figure>
                      <div className="media-content">
                        {kill.position.zone?.name}{' '}
                        {kill.attackers[0].damagePercent === 100 && (
                          <p>
                            <span className="icon-text">
                              <span className="icon">
                                <i className="fas fa-star mr-2 has-text-warning" />
                              </span>
                              <strong>
                                {t('components:killsList.soloKill')}
                              </strong>
                            </span>
                          </p>
                        )}
                      </div>
                    </article>
                  ) : (
                    <article className="media">
                      <figure className="media-left">
                        <figure className="image is-24x24">
                          <img
                            src="/images/icons/scenario.png"
                            alt="Scenario"
                            title="Scenario"
                          />
                        </figure>
                      </figure>
                      <div className="media-content">
                        {kill.scenario.name}{' '}
                        {kill.attackers[0].damagePercent === 100 && (
                          <p>
                            <span className="icon-text">
                              <span className="icon">
                                <i className="fas fa-star mr-2 has-text-warning" />
                              </span>
                              <strong>
                                {t('components:killsList.soloKill')}
                              </strong>
                            </span>
                          </p>
                        )}
                      </div>
                    </article>
                  )}
                </td>
                <td className="kill-row-actions-cell">
                  <div className="kill-row-actions">
                    {feudUrl && (
                      <Link to={feudUrl} className="button is-light is-small">
                        {t('components:playerFeud.viewFeud')}
                      </Link>
                    )}
                    <Link
                      to={`/kill/${kill.id}`}
                      className="button is-primary is-small"
                    >
                      {t('components:killsList.details')}
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
