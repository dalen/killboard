import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { QueryPagination } from '@/components/global/QueryPagination';
import { GoldPrice } from '@/components/GoldPrice';

const VENDOR_ITEMS = gql`
  query GetVendorItemsFromCreature(
    $creatureId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    creature(id: $creatureId) {
      id
      vendorItems(first: $first, last: $last, before: $before, after: $after) {
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

export function VendorItems({
  creatureId,
}: {
  creatureId: string | undefined;
}) {
  const perPage = 10;
  const { t } = useTranslation(['common', 'components']);
  const { loading, error, data, refetch } = useQuery<Query>(VENDOR_ITEMS, {
    variables: {
      creatureId,
      first: perPage,
    },
  });

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const vendorItems = data?.creature?.vendorItems;

  if (vendorItems?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  if (vendorItems?.nodes == null) return null;

  const { pageInfo } = vendorItems;

  return (
    <>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>{t('components:itemVendors.item')}</th>
            <th>{t('components:itemVendors.price')}</th>
          </tr>
        </thead>
        <tbody>
          {vendorItems.nodes.map((vendorItem) => (
            <tr key={vendorItem.item.id}>
              <td>
                <span className="icon-text">
                  <figure className="image is-24x24 mx-1">
                    <img src={vendorItem.item.iconUrl} alt="Item Icon" />
                  </figure>
                  <Link to={`/item/${vendorItem.item.id}`} className="mr-1">
                    {vendorItem.item.name}
                  </Link>
                  x{vendorItem.count}
                </span>
              </td>
              <td>
                <GoldPrice price={vendorItem.price} />
                {vendorItem.requiredItems.map((requiredItem) => (
                  <span key={requiredItem.item.id} className="icon-text">
                    <figure className="image is-24x24 mx-1">
                      <img src={requiredItem.item.iconUrl} alt="Item Icon" />
                    </figure>
                    <Link to={`/item/${requiredItem.item.id}`} className="mr-1">
                      {requiredItem.item.name}
                    </Link>
                    x{requiredItem.count}
                  </span>
                ))}
              </td>
            </tr>
          ))}
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
