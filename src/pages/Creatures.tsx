import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import {
  type CreatureFilterInput,
  type CreatureTitle,
  type Query,
  Realm,
} from '@/__generated__/graphql';
import {
  creatureLocationOptions,
  creatureRoleOptions,
} from '@/data/creatureFilterOptions';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { SearchBox } from '@/components/global/SearchBox';
import { QueryPagination } from '@/components/global/QueryPagination';
import { type ReactElement, useState } from 'react';
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

const CREATURES_IN_LOCATION = gql`
  query GetCreaturesInLocation(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: CreatureFilterInput!
    $locationId: ID!
  ) {
    creatures(
      first: $first
      last: $last
      before: $before
      after: $after
      where: {
        and: [$where, { zones: { some: { eq: $locationId } } }]
      }
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

const creatureRoleValues = new Set<string>(creatureRoleOptions);

const isCreatureRole = (value: string | null): value is CreatureTitle =>
  value != null && creatureRoleValues.has(value);

const isCreatureLocation = (value: string | null): value is string =>
  value != null && creatureLocationOptions.some((zone) => zone.id === value);

const getCreatureLocation = (search: URLSearchParams): string | undefined => {
  const location = search.get('location');
  return isCreatureLocation(location) ? location : undefined;
};

const getFilters = (search: URLSearchParams): CreatureFilterInput => {
  const realm = search.get('realm');
  const role = search.get('role');

  return {
    ...getCreatureNameFilter(search),
    ...(Object.values(Realm).includes(realm as Realm)
      ? { realm: { eq: realm as Realm } }
      : {}),
    ...(isCreatureRole(role) ? { title: { eq: role } } : {}),
  };
};

const duplicatedLocationNames = new Set(
  creatureLocationOptions
    .filter(
      (zone, index, zones) =>
        zones.findIndex((candidate) => candidate.name === zone.name) !== index,
    )
    .map((zone) => zone.name),
);

export const Creatures = (): ReactElement => {
  const [perPage, setPerPage] = useState(15);
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const locationId = getCreatureLocation(search);
  const query = locationId ? CREATURES_IN_LOCATION : CREATURES;
  const { loading, error, data, refetch } = useQuery<Query>(query, {
    variables: {
      first: perPage,
      where: getFilters(search),
      ...(locationId ? { locationId } : {}),
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  const updateFilter = (key: string, value: string) => {
    const nextSearch = new URLSearchParams(search);
    if (value === 'all' || value === '') {
      nextSearch.delete(key);
    } else {
      nextSearch.set(key, value);
    }
    const nextLocationId = getCreatureLocation(nextSearch);
    setSearch(nextSearch);

    // Switching between the two query documents resets pagination naturally.
    // Within one document, explicitly clear the cursor when filters change.
    if (Boolean(locationId) !== Boolean(nextLocationId)) {
      return;
    }

    void refetch({
      after: undefined,
      before: undefined,
      first: perPage,
      last: undefined,
      where: getFilters(nextSearch),
      ...(nextLocationId ? { locationId: nextLocationId } : {}),
    });
  };

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

      <div className="card mb-5">
        <div className="card-content">
          <div className="columns is-multiline">
            <div className="column is-12-mobile is-6-tablet is-4-desktop">
              <div className="field">
                <label className="label">{t('pages:creatures.search')}</label>
                <SearchBox
                  initialQuery={search.get('name') || ''}
                  onSubmit={(event) => {
                    updateFilter('name', event || '');
                  }}
                />
              </div>
            </div>
            <div className="column is-12-mobile is-6-tablet is-2-desktop">
              <div className="field">
                <label className="label" htmlFor="creature-realm">
                  {t('pages:creatures.realm')}
                </label>
                <div className="select is-fullwidth">
                  <select
                    id="creature-realm"
                    value={search.get('realm') ?? 'all'}
                    onChange={(event) => {
                      updateFilter('realm', event.target.value);
                    }}
                  >
                    <option value="all">
                      {t('pages:creatures.allRealms')}
                    </option>
                    <option value={Realm.Order}>
                      {t('common:realmOrder')}
                    </option>
                    <option value={Realm.Destruction}>
                      {t('common:realmDestruction')}
                    </option>
                    <option value={Realm.Neutral}>
                      {t('common:realmNeutral')}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <div className="field">
                <label className="label" htmlFor="creature-role">
                  {t('pages:creatures.role')}
                </label>
                <div className="select is-fullwidth">
                  <select
                    id="creature-role"
                    value={search.get('role') ?? 'all'}
                    onChange={(event) =>
                      updateFilter('role', event.target.value)
                    }
                  >
                    <option value="all">
                      {t('pages:creatures.allRoles')}
                    </option>
                    {creatureRoleOptions.map((role) => (
                      <option key={role} value={role}>
                        {creatureTitleLabel(role)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="column is-12-mobile is-6-tablet is-3-desktop">
              <div className="field">
                <label className="label" htmlFor="creature-location">
                  {t('pages:creatures.location')}
                </label>
                <div className="select is-fullwidth">
                  <select
                    id="creature-location"
                    value={search.get('location') ?? 'all'}
                    onChange={(event) =>
                      updateFilter('location', event.target.value)
                    }
                  >
                    <option value="all">
                      {t('pages:creatures.allLocations')}
                    </option>
                    {creatureLocationOptions.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {duplicatedLocationNames.has(zone.name)
                          ? `${zone.name} (#${zone.id})`
                          : zone.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
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
              <th>{t('pages:creatures.id')}</th>
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
                  <td>{creature.id}</td>
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
                    {creature.realm == null && t('common:realmNeutral')}
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
        onPerPageChange={setPerPage}
        refetch={refetch}
      />
    </div>
  );
};
