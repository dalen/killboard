import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { type OperationVariables, gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { Query } from '@/__generated__/graphql';
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
        totalCount
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

export const VendorItems = ({
  creatureId,
}: {
  creatureId: string | undefined;
}) => {
  const perPage = 10;
  const [pageStart, setPageStart] = useState(0);
  const { t } = useTranslation(['common', 'components']);
  const { loading, error, data, refetch } = useQuery<Query>(VENDOR_ITEMS, {
    variables: {
      creatureId,
      first: perPage,
    },
    errorPolicy: 'all',
  });

  if (loading && !data) {
    return <progress className="progress" />;
  }

  const vendorItems = data?.creature?.vendorItems;

  if (error && !vendorItems) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  if (!vendorItems) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { nodes, pageInfo, totalCount } = vendorItems;
  const rangeStart = totalCount === 0 ? 0 : pageStart + 1;
  const rangeEnd = nodes
    ? pageStart + nodes.length
    : Math.min(pageStart + perPage, totalCount);

  const changePage = (variables?: Partial<OperationVariables>) => {
    if (variables?.after) {
      setPageStart((start) => start + perPage);
    } else if (variables?.before) {
      setPageStart((start) => Math.max(0, start - perPage));
    }
    return refetch(variables);
  };

  return (
    <>
      <p className="mb-2" aria-live="polite">
        {t('components:itemVendors.range', {
          start: rangeStart,
          end: rangeEnd,
          total: totalCount,
        })}
      </p>
      {error && (
        <div className="notification is-warning">
          {t('components:itemVendors.incompleteData')}
        </div>
      )}
      {nodes && (
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <table className="table is-striped is-fullwidth mb-0">
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th>{t('components:itemVendors.item')}</th>
                <th>{t('components:itemVendors.price')}</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((vendorItem) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <QueryPagination
        pageInfo={pageInfo}
        refetch={changePage}
        perPage={perPage}
      />
    </>
  );
};
