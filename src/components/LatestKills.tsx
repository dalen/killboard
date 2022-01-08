import { gql, useQuery } from '@apollo/client';
import { formatRelative } from 'date-fns';
import { Query } from '../types';

const LATEST_KILLS = gql`
  query GetLatestKills {
    kills(first: 10) {
      nodes {
        id
        time
        victim {
          character {
            name
          }
          guild {
            name
          }
        }
        attackers {
          character {
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
    <table style={{ border: 1, borderStyle: 'solid' }}>
      <thead>
        <tr>
          <th>Time</th>
          <th>Attacker</th>
          <th>Victim</th>
        </tr>
      </thead>
      <tbody>
        {data.kills.nodes.map((kill: any) => (
          <tr key={kill.id} style={{ border: 1, borderStyle: 'solid' }}>
            <td>{formatRelative(new Date(kill.time * 1000), new Date())}</td>
            <td>
              <h3>{kill.attackers[0].character.name}</h3>
              <p>{kill.attackers[0].guild?.name}</p>
            </td>
            <td>
              <h3>{kill.victim.character.name}</h3>
              <p>{kill.victim.guild?.name}</p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
