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
import { QueryPagination } from '@/components/global/QueryPagination';
import {
  WarhammerFilterPanel,
  WarhammerSelect,
  WarhammerTextInput,
  type WarhammerOption,
} from '@/components/global/WarhammerFormControls';
import { type ReactElement, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  creatureTitleIcon,
  creatureTitleLabel,
  isPlayerFacingZone,
} from '../utils';

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
      where: { and: [$where, { zones: { some: { eq: $locationId } } }] }
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
const playerFacingLocationOptions = creatureLocationOptions.filter((zone) =>
  isPlayerFacingZone(zone.name),
);

const isCreatureRole = (value: string | null): value is CreatureTitle =>
  value != null && creatureRoleValues.has(value);

const isCreatureLocation = (value: string | null): value is string =>
  value != null &&
  playerFacingLocationOptions.some((zone) => zone.id === value);

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
  playerFacingLocationOptions
    .filter(
      (zone, index, zones) =>
        zones.findIndex((candidate) => candidate.name === zone.name) !== index,
    )
    .map((zone) => zone.name),
);

export const Creatures = (): ReactElement => {
  const [perPage, setPerPage] = useState(50);
  const [search, setSearch] = useSearchParams();
  const [draftName, setDraftName] = useState(search.get('name') ?? '');
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

  useEffect(() => {
    setDraftName(search.get('name') ?? '');
  }, [search]);

  const updateFilter = useCallback(
    (key: string, value: string) => {
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
    },
    [locationId, perPage, refetch, search, setSearch],
  );

  useEffect(() => {
    const normalized = draftName.trim();
    if (normalized === (search.get('name') ?? '')) return undefined;
    const timeout = window.setTimeout(
      () => updateFilter('name', normalized),
      300,
    );
    return () => window.clearTimeout(timeout);
  }, [draftName, search, updateFilter]);

  const entries = data?.creatures?.nodes ?? [];
  const pageInfo = data?.creatures?.pageInfo;
  const realmOptions: WarhammerOption[] = [
    { value: 'all', label: t('pages:creatures.allRealms') },
    { value: Realm.Order, label: t('common:realmOrder') },
    { value: Realm.Destruction, label: t('common:realmDestruction') },
    { value: Realm.Neutral, label: t('common:realmNeutral') },
  ];
  const roleOptions: WarhammerOption[] = [
    { value: 'all', label: t('pages:creatures.allRoles') },
    ...creatureRoleOptions.map((role) => ({
      value: role,
      label: creatureTitleLabel(role),
    })),
  ];
  const locationOptions: WarhammerOption[] = [
    { value: 'all', label: t('pages:creatures.allLocations') },
    ...playerFacingLocationOptions.map((zone) => ({
      value: zone.id,
      label: duplicatedLocationNames.has(zone.name)
        ? `${zone.name} (#${zone.id})`
        : zone.name,
    })),
  ];

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

      <WarhammerFilterPanel className="creature-filter-shell">
        <div className="creature-filter-grid">
          <form
            className="creature-name-filter"
            onSubmit={(event) => {
              event.preventDefault();
              updateFilter('name', draftName);
            }}
          >
            <WarhammerTextInput
              id="creature-name"
              label={t('pages:creatures.search')}
              value={draftName}
              onChange={setDraftName}
              placeholder={t('pages:creatures.search')}
              type="search"
            />
          </form>
          <WarhammerSelect
            id="creature-realm"
            label={t('pages:creatures.realm')}
            value={search.get('realm') ?? 'all'}
            options={realmOptions}
            onChange={(value) => updateFilter('realm', value)}
          />
          <WarhammerSelect
            id="creature-role"
            label={t('pages:creatures.role')}
            value={search.get('role') ?? 'all'}
            options={roleOptions}
            onChange={(value) => updateFilter('role', value)}
          />
          <WarhammerSelect
            id="creature-location"
            label={t('pages:creatures.location')}
            value={search.get('location') ?? 'all'}
            options={locationOptions}
            onChange={(value) => updateFilter('location', value)}
          />
        </div>
      </WarhammerFilterPanel>

      {loading && (
        <progress
          className="progress"
          aria-label={t('pages:creatures.loading')}
        />
      )}
      {error && !data && (
        <ErrorMessage name={error.name} message={error.message} />
      )}
      {!loading && !error && data?.creatures?.nodes == null && (
        <ErrorMessage customText={t('common:notFound')} />
      )}

      {!loading && data?.creatures?.nodes != null && (
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
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="has-text-centered py-4">
                    {t('common:noResults')}
                  </td>
                </tr>
              )}
              {entries.map((creature) => {
                const zoneNames = [
                  ...new Set(
                    creature.spawns
                      .map((spawn) => spawn.zone?.name)
                      .filter(
                        (name): name is string =>
                          Boolean(name) && isPlayerFacingZone(name),
                      ),
                  ),
                ];
                const icon = creatureTitleIcon(creature.title);
                const label = creatureTitleLabel(creature.title);

                return (
                  <tr key={creature.id}>
                    <td>{creature.id}</td>
                    <td>
                      <Link to={`/creature/${creature.id}`}>
                        {creature.name}
                      </Link>
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
                          {zoneNames.length > 1 &&
                            ` (+${zoneNames.length - 1})`}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!loading && pageInfo && (
        <QueryPagination
          pageInfo={pageInfo}
          perPage={perPage}
          onPerPageChange={setPerPage}
          refetch={refetch}
        />
      )}
    </div>
  );
};
