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
            career
            name
          }
          guild {
            name
          }
        }
        attackers {
          level
          renownRank
          character {
            career
            name
          }
          guild {
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
    <table className="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th
            colSpan={4}
            className="has-background-info-dark has-text-white is-size-5 has-text-centered"
          >
            Recent Kills
          </th>
        </tr>
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
                      <strong>{kill.attackers[0].character.name}</strong>
                      <br />
                      {kill.attackers[0].guild?.name}
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
                      <strong>{kill.victim.character.name}</strong>
                      <br />
                      {kill.victim.guild?.name}
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
                <Link to={`/kill/${kill.id}`} className="button is-info">
                  Details
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
