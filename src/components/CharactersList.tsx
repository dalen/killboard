import { gql, useQuery } from '@apollo/client';
import { Progress, Table, Button } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { CareerIcon } from './CareerIcon';
import { CharacterFilterInput, Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import useWindowDimensions from '../hooks/useWindowDimensions';

const SEARCH_CHARACTERS = gql`
  query SearchCharacters(
    $query: CharacterFilterInput
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    characters(
      where: $query
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

const getSearchFilter = (search: URLSearchParams): CharacterFilterInput => {
  const query = search.get('query');

  if (!query) {
    return {};
  }

  return { name: { contains: query } };
};

export function CharactersList(): JSX.Element {
  const perPage = 15;

  const { t } = useTranslation(['common', 'pages']);
  const [search] = useSearchParams();
  const { loading, error, data, refetch } = useQuery<Query>(SEARCH_CHARACTERS, {
    variables: { query: getSearchFilter(search), first: perPage },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.characters?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { pageInfo } = data.characters;

  return (
    <div>
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
                <td aria-label="Career">
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
    </div>
  );
}
