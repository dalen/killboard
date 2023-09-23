import { gql, useQuery } from '@apollo/client';
import {
  Container,
  Progress,
  Table,
  Breadcrumb,
  Button,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { CareerIcon } from '../components/CareerIcon';
import { SearchBox } from '../components/SearchBox';
import { Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import useWindowDimensions from '../hooks/useWindowDimensions';

const SEARCH_CHARACTERS = gql`
  query SearchCharacters(
    $query: String!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    characters(
      where: { name: { contains: $query } }
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        id
        name
        career
        renownRank
        level
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export function Search(): JSX.Element {
  const perPage = 15;

  const { t } = useTranslation(['common', 'pages']);
  const { query } = useParams();
  const { loading, error, data, refetch } = useQuery<Query>(SEARCH_CHARACTERS, {
    variables: { query, first: perPage },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.characters?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { pageInfo } = data.characters;

  const handleSubmit = (newQuery: string): void => {
    refetch({ query: newQuery, first: perPage });
  };

  return (
    <Container max breakpoint="desktop" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/search">{t('pages:searchPage.search')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <SearchBox initialQuery={query} onSubmit={handleSubmit} isPlayer />
      <div className="table-container">
        <Table striped hoverable size={isMobile ? 'narrow' : 'fullwidth'}>
          <thead>
            <tr>
              <th aria-label="empty header" />
              <th>{t('pages:searchPage.name')}</th>
              <th>{t('pages:searchPage.level')}</th>
              <th>{t('pages:searchPage.renownRank')}</th>
            </tr>
          </thead>
          <tbody>
            {data.characters.nodes.map((character) => (
              <tr key={character.id}>
                <td>
                  <CareerIcon career={character.career} />
                </td>
                <td>
                  <Link to={`/character/${character.id}`}>
                    {character.name}
                  </Link>
                </td>
                <td>{character.level}</td>
                <td>{character.renownRank}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {pageInfo && (
        <div className="field is-grouped is-pulled-right">
          {pageInfo.hasPreviousPage && (
            <Button
              color="info"
              size="small"
              onClick={() => {
                refetch({
                  first: undefined,
                  after: undefined,
                  last: perPage,
                  before: pageInfo.startCursor,
                });
              }}
            >
              {t('common:prevPage')}
              <i className="fas fa-circle-chevron-left ml-1" />
            </Button>
          )}
          {pageInfo.hasNextPage && (
            <Button
              color="info"
              size="small"
              onClick={() => {
                refetch({
                  first: perPage,
                  after: pageInfo.endCursor,
                  last: undefined,
                  before: undefined,
                });
              }}
            >
              {t('common:nextPage')}
              <i className="fas fa-circle-chevron-right ml-1" />
            </Button>
          )}
        </div>
      )}
    </Container>
  );
}
