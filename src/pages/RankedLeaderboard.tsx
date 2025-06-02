import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { RankedLeaderboardTable } from '@/components/RankedLeaderboardTable';
import { ReactElement } from 'react';
import { GetRankedLeaderboardSeasonsQuery } from '@/__generated__/graphql';

const RANKED_LEADERBOARD_SEASONS = gql`
  query GetRankedLeaderboardSeasons {
    rankedSeasons {
      id
      name
      start
      end
      mainSeason
    }
  }
`;

export function RankedLeaderboard(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();
  const { loading, error, data } = useQuery<GetRankedLeaderboardSeasonsQuery>(
    RANKED_LEADERBOARD_SEASONS,
    {},
  );

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.rankedSeasons == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const latestSeason = data.rankedSeasons
    .filter((s) => s.mainSeason)
    .slice(-1)[0];

  const season = search.get('season') ?? latestSeason.id;
  const type = search.get('type') ?? 'solo';

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/ranked-leaderboard">
              {t('common:rankedLeaderboard')}
            </Link>
          </li>
        </ul>
      </nav>

      <div>
        <div className="card mb-5">
          <div className="card-content">
            <div className="columns">
              <div className="column">
                <div className="select">
                  <select
                    value={season}
                    onChange={(event) => {
                      search.set('season', event.target.value);
                      setSearch(search);
                    }}
                  >
                    {data?.rankedSeasons.map((s) => (
                      <option value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="column">
                <div className="select">
                  <select
                    value={type}
                    onChange={(event) => {
                      search.set('type', event.target.value);
                      setSearch(search);
                    }}
                  >
                    <option value="solo">
                      {t('pages:rankedLeaderboard.typeSolo')}
                    </option>
                    <option value="group">
                      {t('pages:rankedLeaderboard.typeGroup')}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RankedLeaderboardTable season={season} type={type} />
      </div>
    </div>
  );
}
