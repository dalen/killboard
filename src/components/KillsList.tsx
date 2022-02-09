import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import { format, formatISO } from 'date-fns';
import React from 'react';
import {
  Progress,
  Table,
  Media,
  Content,
  Image,
  Icon,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Scenarios, Zones } from '../enums';
import { Query } from '../types';
import { CareerIcon } from './CareerIcon';
import { ErrorMessage } from './global/ErrorMessage';

export const KillsList = ({
  query,
  queryOptions,
  showTime = true,
  showVictim = true,
  showKiller = true,
}: {
  query: DocumentNode;
  queryOptions?: QueryHookOptions;
  showTime?: boolean;
  showVictim?: boolean;
  showKiller?: boolean;
}): React.ReactElement | null => {
  const { t } = useTranslation(['common', 'components']);
  const { loading, error, data } = useQuery<Query>(query, queryOptions);

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  // This is a bit ugly, maybe we should add feud filtering options directly to the kills query in API server?
  const kills = data?.kills || data?.playerFeudKills || data?.guildFeudKills;

  if (kills?.nodes == null) return <p>{t('common:error')}</p>;

  if (kills.nodes.length === 0) return null;

  return (
    <Table striped hoverable size="fullwidth">
      <thead>
        <tr>
          {showTime && <th>{t('components:killsList.time')}</th>}
          {showKiller && <th>{t('components:killsList.killer')}</th>}
          {showVictim && <th>{t('components:killsList.victim')}</th>}
          <th>{t('components:killsList.type')}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {kills.nodes.map((kill) => {
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
                      <CareerIcon career={kill.attackers[0].character.career} />
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
                {kill.scenarioId === 0 ? (
                  <Media>
                    <Media.Item align="left">
                      <Image
                        src={`/images/icons/rvr.png`}
                        alt="RvR"
                        title="RvR"
                      />
                    </Media.Item>
                    <Media.Item>
                      {Zones[kill.position?.zoneId]}{' '}
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
                        src={`/images/icons/scenario.png`}
                        alt="Scenario"
                        title="Scenario"
                      />
                    </Media.Item>
                    <Media.Item>
                      {Scenarios[kill.scenarioId]}{' '}
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
                <Link to={`/kill/${kill.id}`} className="button is-primary p-1">
                  {t('components:killsList.details')}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
