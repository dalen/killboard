import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import {
  Realm,
  type CreatureFilterInput,
  type Query,
} from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { SearchBox } from '@/components/global/SearchBox';
import { QueryPagination } from '@/components/global/QueryPagination';
import type { ReactElement } from 'react';
import clsx from 'clsx';
import { creatureTitleIcon, creatureTitleLabel } from '../utils';

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
        realm
        title
        spawns {
          zone {
            id
            name
          }
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

export const Creatures = (): ReactElement => {
  const perPage = 15;
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { loading, error, data, refetch } = useQuery<Query>(CREATURES, {
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
  if (data?.creatures?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

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

      <div className="filter-grid">
        <label>
          <span>{t('pages:creatures.search')}</span>
          <SearchBox
            initialQuery={search.get('name') || ''}
            onSubmit={(event) => {
              search.set('name', event);
              setSearch(search);
            }}
          />
        </label>
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
              <th>{t('pages:creatures.realm')}</th>
              <th>{t('pages:creatures.role')}</th>
              <th>{t('pages:creatures.location')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((creature) => {
              const zoneNames = [
                ...new Set(
                  creature.spawns
                    .map((spawn) => spawn.zone?.name)
                    .filter((name): name is string => Boolean(name)),
                ),
              ];
              const icon = creatureTitleIcon(creature.title);
              const label = creatureTitleLabel(creature.title);

              return (
                <tr key={creature.id}>
                  <td>
                    <Link to={`/creature/${creature.id}`}>{creature.name}</Link>
                  </td>
                  <td>
                    {creature.realm === Realm.Order && (
                      <span className="icon-text">
                        <figure className="image is-24x24 m-0 mr-1">
                          <img
                            src="/images/icons/scenario/order.png"
                            width={24}
                            height={24}
                            alt={t('common:realmOrder')}
                          />
                        </figure>
                        {t('common:realmOrder')}
                      </span>
                    )}
                    {creature.realm === Realm.Destruction && (
                      <span className="icon-text">
                        <figure className="image is-24x24 m-0 mr-1">
                          <img
                            src="/images/icons/scenario/destruction.png"
                            width={24}
                            height={24}
                            alt={t('common:realmDestruction')}
                          />
                        </figure>
                        {t('common:realmDestruction')}
                      </span>
                    )}
                    {creature.realm == null && (
                      <span>{t('common:realmNeutral')}</span>
                    )}
                  </td>
                  <td>
                    {label && (
                      <span className="icon-text">
                        {icon && (
                          <figure className="image is-24x24 m-0 mr-1">
                            <img src={icon} width={24} height={24} alt="" />
                          </figure>
                        )}
                        {label}
                      </span>
                    )}
                  </td>
                  <td>
                    {zoneNames.length > 0 && (
                      <span>
                        {zoneNames[0]}
                        {zoneNames.length > 1 && ` (+${zoneNames.length - 1})`}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
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
};
