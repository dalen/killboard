import { gql, useQuery } from '@apollo/client';
import {
  Container,
  Progress,
  Table,
  Notification,
  Breadcrumb,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { CareerIcon } from '../components/CareerIcon';
import { SearchBox } from '../components/SearchBox';
import { Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';

const SEARCH_CHARACTERS = gql`
  query SearchCharacters($query: String!) {
    characters(where: { name: { contains: $query } }) {
      nodes {
        id
        name
        career
        renownRank
        level
      }
    }
  }
`;

export const Search = (): JSX.Element => {
  const { t } = useTranslation(['common', 'pages']);
  const { query } = useParams();
  const { loading, error, data } = useQuery<Query>(SEARCH_CHARACTERS, {
    variables: { query },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.characters?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <Container max breakpoint={'desktop'} mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/search/${query}`}>{t('pages:searchPage.search')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <SearchBox initialQuery={query} />
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
            <tr>
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
    </Container>
  );
};
