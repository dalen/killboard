import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type {
  GetInstancesQuery,
  InstanceFilterInput,
} from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { SearchBox } from '@/components/global/SearchBox';
import { QueryPagination } from '@/components/global/QueryPagination';
import type { ReactElement } from 'react';

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

export const Instances = (): ReactElement => {
  const perPage = 15;
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { loading, error, data, refetch } = useQuery<GetInstancesQuery>(QUERY, {
    variables: {
      first: perPage,
      where: getFilters(search),
    },
  });

  const entries = data?.instances?.nodes;
  const { pageInfo } = data?.instances ?? {};

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/instances">{t('pages:instances.title')}</Link>
          </li>
        </ul>
      </nav>

      <div className="filter-grid">
        <label>
          <span>{t('pages:instances.search')}</span>
          <SearchBox
            initialQuery={search.get('name') || ''}
            onSubmit={(event) => {
              search.set('name', event);
              setSearch(search);
            }}
          />
        </label>
      </div>

      {loading && entries == null && <progress className="progress" />}
      {!loading && error && (
        <ErrorMessage name={error.name} message={error.message} />
      )}
      {!loading && !error && entries == null && (
        <ErrorMessage customText={t('common:notFound')} />
      )}
      {entries != null && entries.length === 0 && (
        <ErrorMessage customText={t('common:notFound')} />
      )}
      {entries != null && entries.length > 0 && (
        <div className="instance-card-grid">
          {entries.map((instance) => (
            <article className="instance-card" key={instance.id}>
              <div className="instance-card-header">
                <span className="instance-card-icon">
                  <i className="fas fa-dungeon" aria-hidden="true" />
                </span>
                <strong>
                  <Link to={`/instance/${instance.id}`}>{instance.name}</Link>
                </strong>
              </div>
              <div className="instance-card-meta">
                <span>
                  {instance.encounters?.length || 0}{' '}
                  {t('pages:instances.encounters')}
                </span>
              </div>
              <div className="instance-card-actions">
                <Link
                  to={`/instance/${instance.id}`}
                  className="button is-primary is-small"
                >
                  {t('pages:instances.runs')}
                </Link>
                <Link
                  to={`/instance-statistics/${instance.id}`}
                  className="button is-small"
                >
                  {t('pages:instances.statistics')}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
      {entries != null && pageInfo && (
        <QueryPagination
          pageInfo={pageInfo}
          perPage={perPage}
          refetch={refetch}
        />
      )}
    </div>
  );
};
