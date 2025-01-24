import { gql, useQuery } from '@apollo/client';
import {
  Progress,
  Container,
  Breadcrumb,
  Card,
  Columns,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { Query } from '../types';
import { RankedLeaderboardTable } from '../components/RankedLeaderboardTable';

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

export function RankedLeaderboard(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();
  const { loading, error, data } = useQuery<Query>(
    RANKED_LEADERBOARD_SEASONS,
    {},
  );

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.rankedSeasons == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const latestSeason = data.rankedSeasons
    .filter((s) => s.mainSeason)
    .slice(-1)[0];

  const season = search.get('season') ?? latestSeason.id;
  const type = search.get('type') ?? 'solo';

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/ranked-leaderboard">{t('common:rankedLeaderboard')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <div>
        <Card mb={5}>
          <Card.Content>
            <Columns>
              <Columns.Column>
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
              </Columns.Column>
              <Columns.Column>
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
              </Columns.Column>
            </Columns>
          </Card.Content>
        </Card>
        <RankedLeaderboardTable season={season} type={type} />
      </div>
    </Container>
  );
}
