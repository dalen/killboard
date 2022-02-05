import { DocumentNode, useQuery } from '@apollo/client';
import { format, formatISO } from 'date-fns';
import {
  Progress,
  Notification,
  Table,
  Media,
  Content,
} from 'react-bulma-components';
import { Link } from 'react-router-dom';
import { Query } from '../types';
import { CareerIcon } from './CareerIcon';

export const KillsList = ({
  query,
  title,
}: {
  query: DocumentNode;
  title: string;
}): JSX.Element => {
  const { loading, error, data } = useQuery<Query>(query);

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
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">{title}</div>
      <Table striped hoverable size="fullwidth">
        <thead>
          <tr>
            <th>Time</th>
            <th>Killer</th>
            <th>Victim</th>
            <th>Location</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.kills.nodes.map((kill) => {
            const date = new Date(kill.time * 1000);

            return (
              <tr key={kill.id}>
                <td>
                  {formatISO(date, { representation: 'date' })}
                  <br />
                  {format(date, 'HH:mm:ss')}
                </td>
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
                <td>
                  Zone: {kill.position?.zoneId}
                  {kill.scenarioId !== 0 && <p>Scenario: {kill.scenarioId}</p>}
                </td>
                <td>
                  <Link to={`/kill/${kill.id}`} className="button is-primary">
                    Details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
