import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { CareerIcon } from '../components/CareerIcon';
import { Query } from '../types';

const KILL_DETAILS = gql`
  query GetKill($id: ID!) {
    kill(id: $id) {
      position {
        zoneId
        x
        y
      }
      victim {
        character {
          name
          career
        }
      }
      attackers {
        damagePercent
        character {
          name
          career
        }
      }
    }
  }
`;

export const Kill = (): JSX.Element => {
  const { id } = useParams();
  const { loading, error, data } = useQuery<Query>(KILL_DETAILS, {
    variables: { id },
  });

  if (loading || data?.kill == null) return <p>Loading...</p>;
  if (error)
    return (
      <div>
        <p>Error :(</p>
        <pre>{error.name}</pre>
        <pre>{error.message}</pre>
      </div>
    );

  return (
    <div className="container is-max-desktop mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li className="is-active">
            <a href="#" aria-current="page">
              Kill #{id}
            </a>
          </li>
        </ul>
      </nav>
      <div className="columns">
        <div className="column">
          <div className="card">
            <header className="card-header has-background-info-dark">
              <div className="card-header-icon">
                <CareerIcon career={data.kill.attackers[0].character.career} />
              </div>
              <p className="card-header-title has-text-white">
                {data.kill.attackers[0].character.name}
              </p>
              <div className="m-3">
                <span className="tag is-rounded is-medium">
                  {data.kill.attackers[0].damagePercent}%
                </span>
              </div>
            </header>
            <div className="card-content">
              <div className="content">test test</div>
            </div>
          </div>{' '}
        </div>
        <div className="column">
          <div className="card">
            <header className="card-header has-background-info-dark">
              <div className="card-header-icon">
                <CareerIcon career={data.kill.victim.character.career} />
              </div>
              <p className="card-header-title has-text-white">
                {data.kill.victim.character.name}
              </p>
            </header>
            <div className="card-content">
              <div className="content">test test</div>
            </div>
          </div>{' '}
        </div>
      </div>
    </div>
  );
};
