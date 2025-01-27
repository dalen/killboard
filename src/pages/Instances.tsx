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
import { InstanceFilterInput, Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { SearchBox } from '../components/SearchBox';
import { QueryPagination } from '../components/QueryPagination';
import { ReactElement } from 'react';

const QUERY = gql`
  query GetInstances(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: InstanceFilterInput
  ) {
    instances(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
    ) {
      nodes {
        id
        name
        encounters {
          id
        }
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

const getInstanceNameFilter = (
  search: URLSearchParams,
): InstanceFilterInput => {
  const name = search.get('name');

  if (!name) {
    return {};
  }

  return { name: { contains: name } };
};

const getFilters = (search: URLSearchParams): InstanceFilterInput => ({
  ...getInstanceNameFilter(search),
});

export function Instances(): ReactElement {
  const perPage = 15;
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { loading, error, data, refetch } = useQuery<Query>(QUERY, {
    variables: {
      where: getFilters(search),
      first: perPage,
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.instances?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const entries = data.instances.nodes;
  const { pageInfo } = data.instances;

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
            <Form.Label>{t('pages:instances.search')}</Form.Label>
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
              <th>{t('pages:instances.name')}</th>
              <th>{t('pages:instances.encounters')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((instance) => (
              <tr key={instance.id}>
                <td>
                  <Link to={`/instance/${instance.id}`}>{instance.name}</Link>
                </td>
                <td>{instance.encounters?.length || 0}</td>
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
