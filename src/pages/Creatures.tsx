import {
  Breadcrumb,
  Card,
  Container,
  Form,
  Progress,
  Table,
} from 'react-bulma-components';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { CreatureFilterInput, Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { SearchBox } from '../components/SearchBox';
import { QueryPagination } from '../components/QueryPagination';

const CREATURES = gql`
  query GetCreatures(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: CreatureFilterInput
  ) {
    creatures(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
    ) {
      nodes {
        id
        name
        creatureType
        creatureSubType
        realm
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

const getCreatureNameFilter = (
  search: URLSearchParams,
): CreatureFilterInput => {
  const name = search.get('name');

  if (!name) {
    return {};
  }

  return { name: { contains: name } };
};

const getFilters = (search: URLSearchParams): CreatureFilterInput => ({
  ...getCreatureNameFilter(search),
});

export function Creatures(): JSX.Element {
  const perPage = 15;
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { loading, error, data, refetch } = useQuery<Query>(CREATURES, {
    variables: {
      where: getFilters(search),
      first: perPage,
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.creatures?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const entries = data.creatures.nodes;
  const { pageInfo } = data.creatures;

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/creatures">{t('pages:creatures.title')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card mb={5}>
        <Card.Content>
          <Form.Field>
            <Form.Label>{t('pages:creatures.search')}</Form.Label>
            <SearchBox
              initialQuery={search.get('name') || ''}
              onSubmit={(event) => {
                search.set('name', event);
                setSearch(search);
              }}
            />
          </Form.Field>
        </Card.Content>
      </Card>

      <div className="table-container">
        <Table striped hoverable size={isMobile ? 'narrow' : 'fullwidth'}>
          <thead>
            <tr>
              <th>{t('pages:creatures.name')}</th>
              <th>{t('pages:creatures.creatureSubType')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((creature) => (
              <tr key={creature.id}>
                <td>
                  <Link to={`/creature/${creature.id}`}>{creature.name}</Link>
                </td>
                <td>
                  {t(`enums:creatureSubType.${creature.creatureSubType}`)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </Container>
  );
}
