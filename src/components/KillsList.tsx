import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import { format, formatISO } from 'date-fns';
import {
  Progress,
  Notification,
  Table,
  Media,
  Content,
  Image,
  Icon,
} from 'react-bulma-components';
import { Link } from 'react-router-dom';
import { Scenarios, Zones } from '../enums';
import { Query } from '../types';
import { CareerIcon } from './CareerIcon';

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
}): JSX.Element => {
  const { loading, error, data } = useQuery<Query>(query, queryOptions);

  if (loading) return <Progress />;
  if (error)
    return (
      <Notification color={'danger'}>
        <p>Error :(</p>
        <pre>{error.name}</pre>
        <pre>{error.message}</pre>
      </Notification>
    );

  if (data?.kills?.nodes == null) return <p>error</p>;

  return (
    <Table striped hoverable size="fullwidth">
      <thead>
        <tr>
          {showTime && <th>Time</th>}
          {showKiller && <th>Killer</th>}
          {showVictim && <th>Victim</th>}
          <th>Type</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.kills.nodes.map((kill) => {
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
                              <i className="fas fa-star mr-2 has-text-warning"></i>
                            </Icon>
                            <strong>Solo kill</strong>
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
                              <i className="fas fa-star mr-2 has-text-warning"></i>
                            </Icon>
                            <strong>Solo kill</strong>
                          </Icon.Text>
                        </p>
                      )}
                    </Media.Item>
                  </Media>
                )}
              </td>
              <td>
                <Link to={`/kill/${kill.id}`} className="button is-primary p-1">
                  Details
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
