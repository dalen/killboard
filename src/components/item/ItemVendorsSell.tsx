import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { GoldPrice } from '@/components/GoldPrice';
import { type Query, Realm } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { QueryPagination } from '@/components/global/QueryPagination';
import { ItemPopupTrigger } from '@/components/item/ItemPopupTrigger';

const ITEM_INFO = gql`
  query GetItemSoldByVendors(
    $itemId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    item(id: $itemId) {
      id
      soldByVendors(
        first: $first
        last: $last
        before: $before
        after: $after
      ) {
        nodes {
          price
          requiredItems {
            count
            item {
              id
              name
              iconUrl
            }
          }
          creatures {
            id
            name
            title
            realm
            spawns {
              zone {
                name
              }
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
  }
`;

const BLANK_ZONE_VALUE = '__blank_zone__';

export const ItemVendorsSell = ({ itemId }: { itemId: string | undefined }) => {
  const [perPage, setPerPage] = useState(25);
  const [realmFilter, setRealmFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const { t } = useTranslation(['common', 'components']);
  const { loading, error, data, refetch } = useQuery<Query>(ITEM_INFO, {
    variables: {
      first: perPage,
      itemId,
    },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const vendorItems = data?.item?.soldByVendors;

  if (vendorItems?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { pageInfo } = vendorItems;

  const allCreatures = vendorItems.nodes.flatMap((vendorItem) =>
    vendorItem.creatures
      .filter((creature) => creature.spawns.length > 0)
      .map((creature) => ({ vendorItem, creature })),
  );
  const realmOptions = Array.from(
    new Set(
      allCreatures
        .map(({ creature }) => creature.realm)
        .filter((realm): realm is Realm => realm != null),
    ),
  ).sort();
  const availableZones = Array.from(
    new Set(
      allCreatures
        .filter(
          ({ creature }) =>
            realmFilter === 'all' || creature.realm === realmFilter,
        )
        .flatMap(({ creature }) =>
          creature.spawns
            .map((spawn) => spawn.zone.name.trim())
            .filter((zone) => zone.length > 0),
        ),
    ),
  ).sort((a, b) => a.localeCompare(b));
  const hasBlankZone = allCreatures.some(
    ({ creature }) =>
      (realmFilter === 'all' || creature.realm === realmFilter) &&
      creature.spawns.some((spawn) => spawn.zone.name.trim().length === 0),
  );
  const zoneOptions = hasBlankZone
    ? [...availableZones, BLANK_ZONE_VALUE]
    : availableZones;
  const filteredGroups = vendorItems.nodes
    .map((vendorItem) => ({
      vendorItem,
      creatures: vendorItem.creatures
        .filter((creature) => creature.spawns.length > 0)
        .filter(
          (creature) =>
            (realmFilter === 'all' || creature.realm === realmFilter) &&
            (zoneFilter === 'all' ||
              (zoneFilter === BLANK_ZONE_VALUE
                ? creature.spawns.some(
                    (spawn) => spawn.zone.name.trim().length === 0,
                  )
                : creature.spawns.some(
                    (spawn) => spawn.zone.name === zoneFilter,
                  ))),
        ),
    }))
    .filter(({ creatures }) => creatures.length > 0);

  const realmName = (realm: Realm | null | undefined) =>
    realm === Realm.Order
      ? t('components:itemVendors.order')
      : t('components:itemVendors.destruction');

  return (
    <>
      <div className="item-vendor-filters">
        <div className="field">
          <label className="label" htmlFor="vendor-realm-filter">
            {t('components:itemVendors.realm')}
          </label>
          <div className="select is-fullwidth">
            <select
              id="vendor-realm-filter"
              value={realmFilter}
              onChange={(event) => {
                setRealmFilter(event.target.value);
                setZoneFilter('all');
              }}
            >
              <option value="all">
                {t('components:itemVendorsFilters.all')}
              </option>
              {realmOptions.map((realm) => (
                <option key={realm} value={realm}>
                  {realmName(realm)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="vendor-zone-filter">
            {t('components:itemVendors.zone')}
          </label>
          <div className="select is-fullwidth">
            <select
              id="vendor-zone-filter"
              value={zoneFilter}
              onChange={(event) => setZoneFilter(event.target.value)}
            >
              <option value="all">
                {t('components:itemVendorsFilters.all')}
              </option>
              {zoneOptions.map((zone) => (
                <option key={zone} value={zone}>
                  {zone === BLANK_ZONE_VALUE
                    ? t('components:itemVendorsFilters.blankZone')
                    : zone}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="item-relation-scroll">
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>{t('components:itemVendors.creatureName')}</th>
              <th>{t('components:itemVendors.realm')}</th>
              <th>{t('components:itemVendors.zone')}</th>
            </tr>
          </thead>
          {filteredGroups.map(({ vendorItem, creatures }, vendorIndex) => (
            <tbody key={`vendor-group-${vendorIndex}`}>
              <tr className="item-vendor-price-row">
                <td colSpan={3}>
                  <span className="has-text-weight-semibold">
                    {t('components:itemVendors.price')}:
                  </span>{' '}
                  <GoldPrice price={vendorItem.price} />
                  {vendorItem.requiredItems.map((requiredItem) => (
                    <ItemPopupTrigger
                      key={requiredItem.item.id}
                      itemId={requiredItem.item.id}
                      placement="top"
                    >
                      <span className="icon-text ml-2">
                        <figure className="image is-24x24 mx-1">
                          <img src={requiredItem.item.iconUrl} alt="" />
                        </figure>
                        <Link
                          to={`/item/${requiredItem.item.id}`}
                          className="mr-1"
                        >
                          {requiredItem.item.name}
                        </Link>
                        x{requiredItem.count}
                      </span>
                    </ItemPopupTrigger>
                  ))}
                </td>
              </tr>
              {creatures.map((creature) => (
                <tr key={`${vendorIndex}-${creature.id}`}>
                  <td>
                    <Link to={`/creature/${creature.id}`}>
                      {creature.name}
                    </Link>
                  </td>
                  <td>
                    {creature.realm === Realm.Order && (
                      <figure className="image is-24x24 m-0">
                        <img
                          src="/images/icons/scenario/order.png"
                          width={24}
                          height={24}
                          alt={t('components:itemVendors.order')}
                        />
                      </figure>
                    )}
                    {creature.realm === Realm.Destruction && (
                      <figure className="image is-24x24 m-0">
                        <img
                          src="/images/icons/scenario/destruction.png"
                          width={24}
                          height={24}
                          alt={t('components:itemVendors.destruction')}
                        />
                      </figure>
                    )}
                  </td>
                  <td>
                    {creature.spawns
                      .map((creatureSpawn) => creatureSpawn.zone.name)
                      .join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        refetch={refetch}
        perPage={perPage}
        onPerPageChange={setPerPage}
      />
    </>
  );
};
