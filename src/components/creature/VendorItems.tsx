import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  CombinedGraphQLErrors,
  type OperationVariables,
  gql,
} from '@apollo/client';
import { useApolloClient, useQuery } from '@apollo/client/react';
import type { Query, VendorItem } from '@/__generated__/graphql';
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
        edges {
          cursor
        }
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

const getFailedNodeIndexes = (error: unknown): number[] => {
  if (!CombinedGraphQLErrors.is(error)) {
    return [];
  }

  return [
    ...new Set(
      error.errors.flatMap(({ path }) => {
        if (!path) {
          return [];
        }
        const nodesIndex = path.indexOf('nodes');
        const nodeIndex = path[nodesIndex + 1];
        return nodesIndex !== -1 && typeof nodeIndex === 'number'
          ? [nodeIndex]
          : [];
      }),
    ),
  ].toSorted((first, second) => first - second);
};

export const VendorItems = ({
  creatureId,
}: {
  creatureId: string | undefined;
}) => {
  const [perPage, setPerPage] = useState(10);
  const [pageStart, setPageStart] = useState(0);
  const [recoveredPage, setRecoveredPage] = useState<{
    key: string;
    status: 'loading' | 'done' | 'failed';
    items: VendorItem[];
    skipped: number;
  } | null>(null);
  const recoveryAttempt = useRef<string | null>(null);
  const client = useApolloClient();
  const { t } = useTranslation(['common', 'components']);
  const { loading, error, data, refetch, variables } = useQuery<Query>(
    VENDOR_ITEMS,
    {
      variables: {
        creatureId,
        first: perPage,
      },
      errorPolicy: 'all',
    },
  );

  const currentPageKey = JSON.stringify([
    creatureId,
    variables.after,
    variables.before,
    variables.first,
    variables.last,
  ]);
  const vendorItems = data?.creature?.vendorItems;
  const needsRecovery =
    error != null && vendorItems?.nodes == null && vendorItems?.edges != null;

  useEffect(() => {
    if (!needsRecovery || !vendorItems?.edges) {
      return;
    }

    if (recoveryAttempt.current === currentPageKey) {
      return;
    }
    recoveryAttempt.current = currentPageKey;

    const failedIndexes = getFailedNodeIndexes(error);
    const failedIndexSet = new Set(failedIndexes);
    const { edges } = vendorItems;
    const segments: { start: number; end: number }[] = [];
    let segmentStart = 0;

    for (const failedIndex of failedIndexes) {
      if (failedIndex < edges.length) {
        if (failedIndex > segmentStart) {
          segments.push({ start: segmentStart, end: failedIndex });
        }
        segmentStart = Math.max(segmentStart, failedIndex + 1);
      }
    }
    if (segmentStart < edges.length) {
      segments.push({ start: segmentStart, end: edges.length });
    }

    if (failedIndexSet.size === 0) {
      setRecoveredPage({
        key: currentPageKey,
        status: 'failed',
        items: [],
        skipped: 0,
      });
      return;
    }

    setRecoveredPage({
      key: currentPageKey,
      status: 'loading',
      items: [],
      skipped: failedIndexSet.size,
    });

    let cancelled = false;
    const recoverPage = async () => {
      try {
        const results = await Promise.all(
          segments.map(({ start, end }) => {
            const count = end - start;
            const segmentVariables = variables.before
              ? {
                  creatureId,
                  first: undefined,
                  last: count,
                  after: undefined,
                  before:
                    end < edges.length
                      ? edges[end]?.cursor
                      : variables.before,
                }
              : {
                  creatureId,
                  first: count,
                  last: undefined,
                  before: undefined,
                  after:
                    start > 0 ? edges[start - 1]?.cursor : variables.after,
                };

            return client.query<Query>({
              query: VENDOR_ITEMS,
              variables: segmentVariables,
              fetchPolicy: 'no-cache',
              errorPolicy: 'all',
            });
          }),
        );

        const items: VendorItem[] = [];
        for (const result of results) {
          const nodes = result.data?.creature?.vendorItems?.nodes;
          if (!nodes || result.error) {
            throw new Error('Could not recover valid vendor item entries.');
          }
          items.push(
            ...nodes.filter((node: VendorItem) => node?.item != null),
          );
        }

        if (!cancelled) {
          setRecoveredPage({
            key: currentPageKey,
            status: 'done',
            items,
            skipped: failedIndexSet.size,
          });
        }
      } catch {
        if (!cancelled) {
          setRecoveredPage({
            key: currentPageKey,
            status: 'failed',
            items: [],
            skipped: failedIndexSet.size,
          });
        }
      }
    };

    void recoverPage();
    return () => {
      cancelled = true;
    };
  }, [
    client,
    currentPageKey,
    creatureId,
    error,
    needsRecovery,
    variables.after,
    variables.before,
    vendorItems?.edges,
  ]);

  if (loading && !data) {
    return <progress className="progress" />;
  }

  if (error && !vendorItems) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  if (!vendorItems) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { nodes, pageInfo, totalCount } = vendorItems;
  const pageRecovery =
    recoveredPage?.key === currentPageKey ? recoveredPage : null;
  if (needsRecovery && pageRecovery?.status !== 'done' && pageRecovery?.status !== 'failed') {
    return <progress className="progress" />;
  }
  const entries =
    pageRecovery?.status === 'done'
      ? pageRecovery.items
      : (nodes ?? []).filter((node) => node?.item != null);
  const rangeStart = totalCount === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + perPage, totalCount);

  const changePage = (nextVariables?: Partial<OperationVariables>) => {
    if (nextVariables?.after) {
      setPageStart((start) => start + perPage);
    } else if (nextVariables?.before) {
      setPageStart((start) => Math.max(0, start - perPage));
    }
    return refetch(nextVariables);
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
      {pageRecovery?.status === 'done' && pageRecovery.skipped > 0 && (
        <div className="notification is-warning is-light py-2 px-3">
          {t('components:itemVendors.skippedData', {
            count: pageRecovery.skipped,
          })}
        </div>
      )}
      {error && pageRecovery?.status !== 'done' && (
        <div className="notification is-warning">
          {t('components:itemVendors.incompleteData')}
        </div>
      )}
      {entries.length > 0 && (
        <div style={{ height: '60vh', overflowY: 'auto' }}>
          <table className="table is-striped is-fullwidth mb-0">
            <thead>
              <tr>
                <th
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: '#15171a',
                  }}
                >
                  {t('components:itemVendors.item')}
                </th>
                <th
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: '#15171a',
                  }}
                >
                  {t('components:itemVendors.price')}
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((vendorItem) => (
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
        onPerPageChange={(size) => {
          setPerPage(size);
          setPageStart(0);
        }}
      />
    </>
  );
};
