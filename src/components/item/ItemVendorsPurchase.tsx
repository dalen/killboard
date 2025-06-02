import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { GoldPrice } from '@/components/GoldPrice';
import { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import {
  ItemVendorsFilters,
  getCurrentFilters,
} from '@/components/item/ItemVendorsFilters';
import { QueryPagination } from '@/components/global/QueryPagination';

const ITEM_INFO = gql`
  query GetItemUsedToPurchase(
    $itemId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $usableByCareer: Career
  ) {
    item(id: $itemId) {
      id
      usedToPurchase(
        first: $first
        last: $last
        before: $before
        after: $after
        usableByCareer: $usableByCareer
      ) {
        nodes {
          count
          item {
            id
            name
            iconUrl
          }
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

export function ItemVendorsPurchase({
  itemId,
}: {
  itemId: string | undefined;
}) {
  const perPage = 10;
  const { t } = useTranslation(['common', 'components']);
  const [search] = useSearchParams();
  const { loading, error, data, refetch } = useQuery<Query>(ITEM_INFO, {
    variables: {
      ...getCurrentFilters(search),
      itemId,
      first: perPage,
    },
  });

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const vendorItems = data?.item?.usedToPurchase;

  if (vendorItems?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { pageInfo } = vendorItems;

  return (
    <>
      <ItemVendorsFilters />
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>{t('components:itemVendors.item')}</th>
            <th>{t('components:itemVendors.price')}</th>
            <th>{t('components:itemVendors.creatureName')}</th>
            <th>{t('components:itemVendors.realm')}</th>
            <th>{t('components:itemVendors.zone')}</th>
          </tr>
        </thead>
        <tbody>
          {vendorItems.nodes.map((vendorItem) => {
            const numRows = vendorItem.creatures.filter(
              (c) => c.spawns.length > 0,
            ).length;

            return vendorItem.creatures
              .filter((creature) => creature.spawns.length > 0)
              .map((creature, index) => (
                <tr key={`${vendorItem.item.id}-${creature.id}`}>
                  {index === 0 && (
                    <>
                      <td rowSpan={numRows}>
                        <span className="icon-text">
                          <figure className="image is-24x24 mx-1">
                            <img
                              src={vendorItem.item.iconUrl}
                              alt="Item Icon"
                            />
                          </figure>
                          <Link
                            to={`/item/${vendorItem.item.id}`}
                            className="mr-1"
                          >
                            {vendorItem.item.name}
                          </Link>
                          x{vendorItem.count}
                        </span>
                      </td>
                      <td rowSpan={numRows}>
                        <GoldPrice price={vendorItem.price} />
                        {vendorItem.requiredItems.map((requiredItem) => (
                          <span
                            key={requiredItem.item.id}
                            className="icon-text"
                          >
                            <figure className="image is-24x24 mx-1">
                              <img
                                src={requiredItem.item.iconUrl}
                                alt="Item Icon"
                              />
                            </figure>
                            <Link
                              to={`/item/${requiredItem.item.id}`}
                              className="mr-1"
                            >
                              {requiredItem.item.name}
                            </Link>
                            x{requiredItem.count}
                          </span>
                        ))}
                      </td>
                    </>
                  )}
                  <td>
                    <Link to={`/creature/${creature.id}`}>
                      {creature.name}{' '}
                    </Link>
                  </td>
                  <td>
                    {creature.realm === 'ORDER' && (
                      <figure className="image is-24x24 m-0">
                        <img
                          src="/images/icons/scenario/order.png"
                          width={24}
                          height={24}
                          alt={t('components:itemVendors.order')}
                        />
                      </figure>
                    )}
                    {creature.realm === 'DESTRUCTION' && (
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
              ));
          })}
        </tbody>
      </table>
      <QueryPagination
        pageInfo={pageInfo}
        refetch={refetch}
        perPage={perPage}
      />
    </>
  );
}
