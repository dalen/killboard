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

const SEARCH_CHARACTERS = gql`
  query SearchCharacters(
    $query: String!
    $prevCursor: String
    $nextCursor: String
  ) {
    characters(
      where: { name: { contains: $query } }
      first: 15
      before: $prevCursor
      after: $nextCursor
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

export const Search = (): JSX.Element => {
  const { t } = useTranslation(['common', 'pages']);
  const { query } = useParams();
  const { loading, error, data, fetchMore, refetch } = useQuery<Query>(
    SEARCH_CHARACTERS,
    {
      variables: { query: query },
    }
  );

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.characters?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const pageInfo = data.characters.pageInfo;

  const handleSubmit = (newQuery: string): void => {
    refetch({ query: newQuery });
  };

  return (
    <Container max breakpoint={'desktop'} mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/search`}>{t('pages:searchPage.search')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <SearchBox initialQuery={query} onSubmit={handleSubmit} />
      <Table striped hoverable size="fullwidth">
        <thead>
          <tr>
            <th></th>
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
                <Link to={`/character/${character.id}`}>{character.name}</Link>
              </td>
              <td>{character.level}</td>
              <td>{character.renownRank}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {pageInfo && (
        <div className="field is-grouped is-pulled-right">
          {pageInfo.hasPreviousPage && (
            <Button
              color={'info'}
              size={'small'}
              onClick={() =>
                fetchMore({
                  variables: { prevCursor: pageInfo.startCursor },
                })
              }
            >
              {t('common:prevPage')}
              <i className="fas fa-circle-chevron-left ml-1" />
            </Button>
          )}
          {pageInfo.hasNextPage && (
            <Button
              color={'info'}
              size={'small'}
              onClick={() =>
                fetchMore({
                  variables: { nextCursor: pageInfo.endCursor },
                })
              }
            >
              {t('common:nextPage')}
              <i className="fas fa-circle-chevron-right ml-1" />
            </Button>
          )}
        </div>
      )}
    </Container>
  );
};
