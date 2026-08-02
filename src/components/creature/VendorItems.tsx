import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gql } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { GoldPrice } from '@/components/GoldPrice';

const VENDOR_ITEMS = gql`
  query GetVendorItemsFromCreature(
    $creatureId: ID!
    $first: Int
    $after: String
  ) {
    creature(id: $creatureId) {
      id
      vendorItems(first: $first, after: $after) {
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
        }
      }
    }
  }
`;

type VendorItemsConnectionType = NonNullable<Query['creature']>['vendorItems'];
type VendorItemNode = NonNullable<
  NonNullable<VendorItemsConnectionType>['nodes']
>[number];

// The API caps a single page at 50 items, and offers no server-side name
// filter on a creature's vendor list. Some vendors sell 100-200+ items,
// which used to mean clicking "Next" a dozen+ times to browse the whole
// catalog. Instead we page through everything up front (a handful of
// 50-item requests even for the biggest vendors) into local state, then
// filter and scroll client-side.
export const VendorItems = ({
  creatureId,
}: {
  creatureId: string | undefined;
}) => {
  const perPage = 50;
  const { t } = useTranslation(['common', 'components']);
  const client = useApolloClient();
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<VendorItemNode[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error>();
  const [hasDataIssue, setHasDataIssue] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let totalCount: number | undefined;
    const controller = new AbortController();

    // Cursors from this API are just base64-encoded zero-based offsets
    // (e.g. offset 49 -> btoa("49")), which lets us request an arbitrary
    // [start, start + count) window directly instead of only being able to
    // walk forward page by page.
    const encodeOffset = (offset: number): string | undefined =>
      offset > 0 ? btoa(String(offset - 1)) : undefined;

    // Fetch a window of `count` items starting at `start`. If the window
    // comes back null (one malformed row poisons the whole array under
    // GraphQL's non-null propagation rules), split it in half and retry
    // each half independently. This isolates the exact bad row(s) instead
    // of discarding the entire 50-item page they happened to land on.
    const fetchRange = async (
      start: number,
      count: number,
    ): Promise<VendorItemNode[]> => {
      if (count <= 0) {
        return [];
      }
      const result = await client.query<Query>({
        context: { fetchOptions: { signal: controller.signal } },
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
        query: VENDOR_ITEMS,
        variables: { after: encodeOffset(start), creatureId, first: count },
      });
      const connection = result.data?.creature?.vendorItems;
      if (!connection) {
        return [];
      }
      if (totalCount === undefined) {
        totalCount = connection.totalCount;
        if (!cancelled) {
          setTotal(connection.totalCount);
        }
      }
      if (connection.nodes) {
        return connection.nodes;
      }
      if (count === 1) {
        // Narrowed down to a single unrecoverable row.
        if (!cancelled) {
          setHasDataIssue(true);
        }
        return [];
      }
      const half = Math.ceil(count / 2);
      const left = await fetchRange(start, half);
      const right = await fetchRange(start + half, count - half);
      return [...left, ...right];
    };

    const loadAll = async (): Promise<void> => {
      setLoading(true);
      setLoadError(undefined);
      setHasDataIssue(false);
      setItems([]);
      let offset = 0;
      const accumulated: VendorItemNode[] = [];

      try {
        do {
          const nodes = await fetchRange(offset, perPage);
          accumulated.push(...nodes);
          offset += perPage;
          if (!cancelled) {
            setItems([...accumulated]);
          }
          if (totalCount === undefined || offset >= totalCount) {
            break;
          }
        } while (!cancelled);
      } catch (caughtError) {
        if (!cancelled && !controller.signal.aborted) {
          setLoadError(
            caughtError instanceof Error
              ? caughtError
              : new Error('Unable to load vendor items.'),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAll();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [client, creatureId]);

  if (loading && items.length === 0) {
    return <progress className="progress" />;
  }
  if (loadError) {
    return <ErrorMessage name={loadError.name} message={loadError.message} />;
  }
  if (items.length === 0) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const filtered = search
    ? items.filter((vendorItem) =>
        vendorItem.item.name.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  return (
    <>
      <div className="filter-grid">
        <label>
          <span>{t('components:itemVendors.filterItems')}</span>
          <div className="control">
            <input
              className="input"
              type="search"
              placeholder={t('components:itemVendors.item')}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </label>
      </div>
      {loading && (
        <p className="mb-2">
          Gathering {items.length} of {total || '…'} items…
        </p>
      )}
      {hasDataIssue && (
        <p className="mb-2 has-text-warning">
          Some items could not be loaded due to a data issue and are missing
          from this list.
        </p>
      )}
      <div className="vendor-items-scroll-box">
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>{t('components:itemVendors.item')}</th>
              <th>{t('components:itemVendors.price')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((vendorItem) => (
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
        {filtered.length === 0 && (
          <p className="p-3">{t('common:noResults')}</p>
        )}
      </div>
    </>
  );
};
