import { format, formatISO } from 'date-fns';
import React from 'react';
import { Table, Media, Content, Image, Icon } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Kill } from '../types';
import { CareerIcon } from './CareerIcon';
import useWindowDimensions from '../hooks/useWindowDimensions';

export function KillsListTable({
  data,
  showTime = true,
  showVictim = true,
  showKiller = true,
}: {
  data: Kill[];
  showTime?: boolean;
  showVictim?: boolean;
  showKiller?: boolean;
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
            {showTime && <th id="th-time">{t('components:killsList.time')}</th>}
            {showKiller && (
              <th id="th-killer">{t('components:killsList.killer')}</th>
            )}
            {showVictim && (
              <th id="th-victim">{t('components:killsList.victim')}</th>
            )}
            <th>{t('components:killsList.type')}</th>
            <th aria-label="empty header" />
          </tr>
        </thead>
        <tbody>
          {data.map((kill) => {
            const date = new Date(kill.time * 1000);

            return (
              <tr key={kill.id}>
                {showTime && (
                  <td>
                    <small>
                      {formatISO(date, { representation: 'date' })}
                      <br />
                      {format(date, 'HH:mm:ss')}
                    </small>
                  </td>
                )}
                {showKiller && (
                  <td>
                    <Media>
                      <Media.Item align="left">
                        <CareerIcon
                          career={kill.attackers[0].character.career}
                        />
                      </Media.Item>
                      <Media.Item>
                        <Content>
                          <Link
                            to={`/character/${kill.attackers[0].character.id}`}
                          >
                            <strong>{kill.attackers[0].character.name}</strong>
                          </Link>
                          <br />
                          <Link to={`/guild/${kill.attackers[0].guild?.id}`}>
                            {kill.attackers[0].guild?.name}
                          </Link>
                        </Content>
                      </Media.Item>
                      <Media.Item align="right">
                        <small>
                          Lvl {kill.attackers[0].level}
                          <br />
                          RR {kill.attackers[0].renownRank}
                        </small>
                      </Media.Item>
                    </Media>
                  </td>
                )}
                {showVictim && (
                  <td>
                    <Media>
                      <Media.Item align="left">
                        <CareerIcon career={kill.victim.character.career} />
                      </Media.Item>
                      <Media.Item>
                        <Content>
                          <Link to={`/character/${kill.victim.character.id}`}>
                            <strong>{kill.victim.character.name}</strong>
                          </Link>
                          <br />
                          <Link to={`/guild/${kill.victim.guild?.id}`}>
                            {kill.victim.guild?.name}
                          </Link>
                        </Content>
                      </Media.Item>
                      <Media.Item align="right">
                        <small>
                          Lvl {kill.victim.level}
                          <br />
                          RR {kill.victim.renownRank}
                        </small>
                      </Media.Item>
                    </Media>
                  </td>
                )}
                <td>
                  {kill.scenario == null ? (
                    <Media>
                      <Media.Item align="left">
                        <Image
                          src="/images/icons/rvr.png"
                          alt="RvR"
                          title="RvR"
                        />
                      </Media.Item>
                      <Media.Item>
                        {kill.position.zone?.name}{' '}
                        {kill.attackers[0].damagePercent === 100 && (
                          <p>
                            <Icon.Text>
                              <Icon>
                                <i className="fas fa-star mr-2 has-text-warning" />
                              </Icon>
                              <strong>
                                {t('components:killsList.soloKill')}
                              </strong>
                            </Icon.Text>
                          </p>
                        )}
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
                        {kill.scenario.name}{' '}
                        {kill.attackers[0].damagePercent === 100 && (
                          <p>
                            <Icon.Text>
                              <Icon>
                                <i className="fas fa-star mr-2 has-text-warning" />
                              </Icon>
                              <strong>
                                {t('components:killsList.soloKill')}
                              </strong>
                            </Icon.Text>
                          </p>
                        )}
                      </Media.Item>
                    </Media>
                  )}
                </td>
                <td>
                  <Link
                    to={`/kill/${kill.id}`}
                    className="button is-primary p-2 is-pulled-right"
                  >
                    {t('components:killsList.details')}
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
