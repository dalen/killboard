import { Button, Progress, Table } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { GoldPrice } from './GoldPrice';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';

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

export function ItemVendorsSell({ itemId }: { itemId: string | undefined }) {
  const perPage = 10;
  const { t } = useTranslation(['common', 'components']);
  const { loading, error, data, refetch } = useQuery<Query>(ITEM_INFO, {
    variables: {
      itemId,
      first: perPage,
    },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const vendorItems = data?.item?.soldByVendors;
  const pageInfo = vendorItems?.pageInfo;

  if (vendorItems?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <Table striped className="is-fullwidth">
      <thead>
        <tr>
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
              <tr>
                {index === 0 && (
                  <td rowSpan={numRows}>
                    <GoldPrice price={vendorItem.price} />
                    {vendorItem.requiredItems.map((requiredItem) => (
                      <span className="icon-text">
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
                )}
                <td>{creature.name}</td>
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
      {(pageInfo?.hasNextPage || pageInfo?.hasPreviousPage) && (
        <tfoot>
          <tr>
            <td colSpan={4}>
              <div className="field is-grouped is-pulled-right">
                {pageInfo.hasPreviousPage && (
                  <Button
                    p={2}
                    pull="right"
                    color="info"
                    size="small"
                    onClick={() =>
                      refetch({
                        first: undefined,
                        after: undefined,
                        last: perPage,
                        before: pageInfo?.startCursor,
                      })
                    }
                  >
                    {t('common:prevPage')}
                    <i className="fas fa-circle-chevron-left ml-1" />
                  </Button>
                )}
                {pageInfo.hasNextPage && (
                  <Button
                    p={2}
                    pull="right"
                    color="info"
                    size="small"
                    onClick={() => {
                      refetch({
                        first: perPage,
                        after: pageInfo?.endCursor,
                        last: undefined,
                        before: undefined,
                      });
                    }}
                  >
                    {t('common:nextPage')}
                    <i className="fas fa-circle-chevron-right ml-1" />
                  </Button>
                )}
              </div>
            </td>
          </tr>
        </tfoot>
      )}
    </Table>
  );
}
