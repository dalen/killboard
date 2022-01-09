import { gql, useQuery } from '@apollo/client';
import { format, formatISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { Query } from '../types';
import { CareerIcon } from './CareerIcon';

const LATEST_KILLS = gql`
  query GetLatestKills {
    kills(first: 10) {
      nodes {
        id
        time
        victim {
          level
          renownRank
          character {
            id
            career
            name
          }
          guild {
            id
            name
          }
        }
        attackers {
          level
          renownRank
          character {
            id
            career
            name
          }
          guild {
            id
            name
          }
        }
      }
    }
  }
`;

export const LatestKills = (): JSX.Element => {
  const { loading, error, data } = useQuery<Query>(LATEST_KILLS);

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div>
        <p>Error :(</p>
        <pre>{error.name}</pre>
        <pre>{error.message}</pre>
      </div>
    );

  console.log(data);

  if (data?.kills?.nodes == null) return <p>error</p>;

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        Recent Kills
      </div>
      <table className="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Time</th>
            <th>Attacker</th>
            <th>Victim</th>
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
                  <article className="media">
                    <figure className="media-left">
                      <CareerIcon career={kill.attackers[0].character.career} />
                    </figure>
                    <div className="media-content">
                      <div className="content">
                        <Link
                          to={`/character/${kill.attackers[0].character.id}`}
                        >
                          <strong>{kill.attackers[0].character.name}</strong>
                        </Link>
                        <br />
                        <Link to={`/guild/${kill.attackers[0].guild?.id}`}>
                          {kill.attackers[0].guild?.name}
                        </Link>
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
                        <br />
                        <Link to={`/guild/${kill.victim.guild?.id}`}>
                          {kill.victim.guild?.name}
                        </Link>
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
                <td>
                  <Link to={`/kill/${kill.id}`} className="button is-primary">
                    Details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
