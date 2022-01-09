import { gql, useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { CareerIcon } from '../components/CareerIcon';
import { Query } from '../types';
import { careerIcon } from '../utils';

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
          id
          name
          career
        }
        guild {
          id
          name
        }
      }
      attackers {
        damagePercent
        character {
          id
          name
          career
        }
        guild {
          id
          name
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

  const kill = data.kill;

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
          <nav className="panel is-info">
            <p className="panel-heading">
              <Link to={`/character/${kill.attackers[0].character.id}`}>
                {data.kill.attackers[0].character.name}
              </Link>
            </p>
            <Link
              className="panel-block"
              to={`/character/${kill.attackers[0].character.id}`}
            >
              <span className="panel-icon">
                <img
                  src={careerIcon(data.kill.attackers[0].character.career)}
                />
              </span>
              {data.kill.attackers[0].character.name}
            </Link>
            <Link
              className="panel-block"
              to={`/guild/${kill.attackers[0].guild?.id}`}
            >
              <span className="panel-icon">
                <img src="/images/icons/guild.png" />
              </span>
              {data.kill.attackers[0].guild?.name}
            </Link>
          </nav>
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
              <div className="media">
                <Link to={`/guild/${kill.attackers[0].guild?.id}`}>
                  <div className="media-left">
                    <figure className="image is-32x32">
                      <img src="/images/icons/guild.png" />
                    </figure>
                  </div>
                  <div className="media-content">
                    {data.kill.attackers[0].guild?.name}
                  </div>
                </Link>
              </div>
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-home"></i>
                </span>
                <span>Home</span>
              </span>
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
