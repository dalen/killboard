import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import type {
  GetInstancesQuery,
  InstanceFilterInput,
} from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { SearchBox } from '@/components/global/SearchBox';
import { QueryPagination } from '@/components/global/QueryPagination';
import { type ReactElement, useState } from 'react';
import clsx from 'clsx';

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
        zone {
          id
          name
        }
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

export const Instances = (): ReactElement => {
  const [perPage, setPerPage] = useState(15);
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { loading, error, data, refetch } = useQuery<GetInstancesQuery>(QUERY, {
    variables: {
      first: perPage,
      where: getFilters(search),
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.instances?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const entries = data.instances.nodes;
  const { pageInfo } = data.instances;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/instances">{t('pages:home.showInstances')}</Link>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <div className="field">
            <label className="label">{t('pages:instances.search')}</label>
            <SearchBox
              initialQuery={search.get('name') || ''}
              onSubmit={(event) => {
                search.set('name', event);
                setSearch(search);
              }}
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table
          className={clsx(
            'table',
            'instance-list-table',
            'is-striped',
            'is-hoverable',
            isMobile ? 'is-narrow' : 'is-fullwidth',
          )}
        >
          <thead>
            <tr>
              <th>{t('pages:instances.name')}</th>
              <th>{t('pages:instances.zone')}</th>
              <th>{t('pages:instances.encounters')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((instance) => (
              <tr key={instance.id}>
                <td>
                  <Link to={`/instance/${instance.id}`}>{instance.name}</Link>
                </td>
                <td>{instance.zone?.name || '—'}</td>
                <td>{instance.encounters?.length || 0}</td>
                <td>
                  <div className="instance-list-actions">
                    <Link
                      to={`/instance-runs?instance=${instance.id}`}
                      className="button is-primary p-2"
                    >
                      {t('pages:instances.runs')}
                    </Link>
                    <Link
                      to={`/instance-statistics/${instance.id}`}
                      className="button is-primary p-2"
                    >
                      {t('pages:instances.statistics')}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        onPerPageChange={setPerPage}
        refetch={refetch}
      />
    </div>
  );
};
