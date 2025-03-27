import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { CreatureFilterInput, Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { SearchBox } from '../components/global/SearchBox';
import { QueryPagination } from '../components/global/QueryPagination';
import { ReactElement } from 'react';
import clsx from 'clsx';

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

export function Creatures(): ReactElement {
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

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.creatures?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const entries = data.creatures.nodes;
  const { pageInfo } = data.creatures;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/creatures">{t('pages:creatures.title')}</Link>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <div className="field">
            <label className="label">{t('pages:creatures.search')}</label>
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
            'is-striped',
            'is-hoverable',
            isMobile ? 'is-narrow' : 'is-fullwidth',
          )}
        >
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
        </table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </div>
  );
}
