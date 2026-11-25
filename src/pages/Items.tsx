import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { type FormEvent, type ReactElement, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import {
  Career,
  EquipSlot,
  type ItemFilterInput,
  ItemRarity,
  type ItemSortInput,
  ItemType,
  type SearchItemsQuery,
  SortEnumType,
  Stat,
} from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { QueryPagination } from '@/components/global/QueryPagination';
import { ItemListEntry } from '@/components/item/ItemListEntry';
import { ITEM_FRAGMENT } from '@/components/item/ItemListEntryFragment';
import { itemNameClass } from '@/itemUtils';
import useWindowDimensions from '@/hooks/useWindowDimensions';

const SEARCH_ITEMS = gql`
  query SearchItems(
    $query: ItemFilterInput
    $usableByCareer: Career
    $hasStats: [Stat!]
    $order: [ItemSortInput!]
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    items(
      where: $query
      usableByCareer: $usableByCareer
      hasStats: $hasStats
      order: $order
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        ...ItemListEntry
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }

  ${ITEM_FRAGMENT}
`;

const numericRange = (
  search: URLSearchParams,
  minKey: string,
  maxKey: string,
) => {
  const min = Number(search.get(minKey));
  const max = Number(search.get(maxKey));
  return {
    ...(search.get(minKey) && Number.isFinite(min) ? { gte: min } : {}),
    ...(search.get(maxKey) && Number.isFinite(max) ? { lte: max } : {}),
  };
};

const getItemsFilters = (search: URLSearchParams): ItemFilterInput => {
  const query = search.get('query')?.trim();
  const type = search.get('type');
  const slot = search.get('slot');
  const rarity = search.get('rarity');
  const unique = search.get('unique');

  return {
    ...(query ? { name: { contains: query } } : {}),
    ...(type && type !== 'all' ? { type: { eq: type as ItemType } } : {}),
    ...(slot && slot !== 'all' ? { slot: { eq: slot as EquipSlot } } : {}),
    ...(rarity && rarity !== 'all'
      ? { rarity: { eq: rarity as ItemRarity } }
      : {}),
    ...(unique === 'yes' ? { uniqueEquipped: { eq: true } } : {}),
    ...(Object.keys(numericRange(search, 'levelMin', 'levelMax')).length
      ? { levelRequirement: numericRange(search, 'levelMin', 'levelMax') }
      : {}),
    ...(Object.keys(numericRange(search, 'renownMin', 'renownMax')).length
      ? {
          renownRankRequirement: numericRange(search, 'renownMin', 'renownMax'),
        }
      : {}),
    ...(Object.keys(numericRange(search, 'itemLevelMin', 'itemLevelMax')).length
      ? { itemLevel: numericRange(search, 'itemLevelMin', 'itemLevelMax') }
      : {}),
  };
};

const getCareer = (search: URLSearchParams): Career | undefined => {
  const career = search.get('career');
  return career && career !== 'all' ? (career as Career) : undefined;
};

const getStat = (search: URLSearchParams): Stat[] | undefined => {
  const stat = search.get('stat');
  return stat && stat !== 'any' ? [stat as Stat] : undefined;
};

const SORT_FIELDS = [
  'name',
  'type',
  'slot',
  'rarity',
  'levelRequirement',
  'renownRankRequirement',
  'itemLevel',
  'armor',
  'dps',
  'speed',
] as const;

const getSort = (search: URLSearchParams): ItemSortInput[] => {
  const field =
    SORT_FIELDS.find((value) => value === search.get('sort')) ?? 'name';
  const direction =
    search.get('direction') === 'desc' ? SortEnumType.Desc : SortEnumType.Asc;
  return [{ [field]: direction } as ItemSortInput, { id: SortEnumType.Asc }];
};

const setFilter = ({
  search,
  setSearch,
  key,
  value,
}: {
  search: URLSearchParams;
  setSearch: (next: URLSearchParams) => void;
  key: string;
  value: string;
}) => {
  const next = new URLSearchParams(search);
  if (!value || value === 'all' || value === 'any') {
    next.delete(key);
  } else {
    next.set(key, value);
  }
  setSearch(next);
};

const NumericFilter = ({
  label,
  minKey,
  maxKey,
  search,
  setSearch,
}: {
  label: string;
  minKey: string;
  maxKey: string;
  search: URLSearchParams;
  setSearch: (next: URLSearchParams) => void;
}): ReactElement => {
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(search);
    if (value.trim()) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearch(next);
  };

  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="field is-grouped">
        {[
          { key: minKey, name: 'Min' },
          { key: maxKey, name: 'Max' },
        ].map(({ key, name }) => (
          <div className="control is-expanded" key={key}>
            <input
              className="input"
              type="number"
              min="0"
              inputMode="numeric"
              aria-label={`${name} ${label}`}
              placeholder={name}
              value={search.get(key) ?? ''}
              onChange={(event) => update(key, event.currentTarget.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Items = (): ReactElement => {
  const [perPage, setPerPage] = useState(25);
  const [search, setSearch] = useSearchParams();
  const [draftSearch, setDraftSearch] = useState(
    () => new URLSearchParams(search),
  );
  useEffect(() => {
    setDraftSearch(new URLSearchParams(search));
  }, [search]);
  const { t } = useTranslation(['common', 'enums', 'pages']);
  const { loading, error, data, refetch } = useQuery<SearchItemsQuery>(
    SEARCH_ITEMS,
    {
      variables: {
        query: getItemsFilters(search),
        usableByCareer: getCareer(search),
        hasStats: getStat(search),
        order: getSort(search),
        first: perPage,
      },
    },
  );
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.items?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { nodes: entries, pageInfo } = data.items;
  const currentSort = search.get('sort') ?? 'name';
  const direction = search.get('direction') === 'desc' ? 'desc' : 'asc';
  const toggleSort = (field: (typeof SORT_FIELDS)[number]) => {
    const next = new URLSearchParams(search);
    if (next.get('sort') === field) {
      next.set('direction', direction === 'asc' ? 'desc' : 'asc');
    } else {
      next.set('sort', field);
      next.set('direction', 'asc');
    }
    setSearch(next);
  };
  const sortHeader = (field: (typeof SORT_FIELDS)[number], label: string) => (
    <button
      className="button is-ghost is-small p-0 has-text-weight-bold"
      onClick={() => toggleSort(field)}
      aria-label={`${label}, ${currentSort === field ? direction : 'not sorted'}`}
    >
      {label}
      {currentSort === field && (
        <span className="ml-1" aria-hidden="true">
          {direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );
  const enumOptions = (values: string[], translationKey: string) =>
    values.flatMap((value) => {
      const label = t(`${translationKey}.${value}`);
      const missingLabel = `${translationKey.split(':')[1]}.${value}`;
      return label === missingLabel
        ? []
        : [
            <option key={value} value={value}>
              {label}
            </option>,
          ];
    });
  const rarityOptions = [
    ItemRarity.Utility,
    ItemRarity.Common,
    ItemRarity.Uncommon,
    ItemRarity.Rare,
    ItemRarity.VeryRare,
    ItemRarity.Mythic,
  ].map((rarity) => (
    <option key={rarity} value={rarity} className={itemNameClass({ rarity })}>
      {t(`enums:itemRarity.${rarity}`)}
    </option>
  ));
  const selectFilter = ({
    id,
    label,
    key,
    options,
    allLabel = t('pages:items.all'),
  }: {
    id: string;
    label: string;
    key: string;
    options: ReactElement[];
    allLabel?: string;
  }) => (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="select is-fullwidth">
        <select
          id={id}
          className={
            key === 'rarity' && draftSearch.get(key)
              ? itemNameClass({ rarity: draftSearch.get(key) as ItemRarity })
              : undefined
          }
          value={draftSearch.get(key) ?? 'all'}
          onChange={(event) =>
            setFilter({
              search: draftSearch,
              setSearch: setDraftSearch,
              key,
              value: event.target.value,
            })
          }
        >
          <option value="all">{allLabel}</option>
          {options}
        </select>
      </div>
    </div>
  );

  return (
    <div className="container is-max-desktop mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/items">{t('pages:items.title')}</Link>
          </li>
        </ul>
      </nav>
      <form
        className="card mb-5"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          setSearch(new URLSearchParams(draftSearch));
        }}
      >
        <div className="card-content">
          <div className="field">
            <label className="label" htmlFor="item-search">
              {t('pages:items.search')}
            </label>
            <p className="control has-icons-left">
              <input
                id="item-search"
                className="input"
                type="search"
                placeholder={t('components:searchBox.placeholder')}
                value={draftSearch.get('query') ?? ''}
                onChange={(event) =>
                  setFilter({
                    search: draftSearch,
                    setSearch: setDraftSearch,
                    key: 'query',
                    value: event.currentTarget.value,
                  })
                }
              />
              <span className="icon is-small is-left">
                <i className="fas fa-search" />
              </span>
            </p>
          </div>
          <div className="columns is-multiline">
            <div className="column is-one-third-tablet">
              {selectFilter({
                id: 'type',
                label: t('pages:items.itemType'),
                key: 'type',
                options: enumOptions(
                  Object.values(ItemType).filter(
                    (value) => value !== ItemType.None,
                  ),
                  'enums:itemType',
                ),
              })}
            </div>
            <div className="column is-one-third-tablet">
              {selectFilter({
                id: 'slot',
                label: t('pages:items.slot'),
                key: 'slot',
                options: enumOptions(
                  Object.values(EquipSlot).filter(
                    (value) => value !== EquipSlot.None,
                  ),
                  'enums:itemSlot',
                ),
              })}
            </div>
            <div className="column is-one-third-tablet">
              {selectFilter({
                id: 'rarity',
                label: t('pages:items.rarity'),
                key: 'rarity',
                options: rarityOptions,
              })}
            </div>
            <div className="column is-one-third-tablet">
              {selectFilter({
                id: 'career',
                label: t('pages:items.usableByCareer'),
                key: 'career',
                options: enumOptions(Object.values(Career), 'enums:career'),
              })}
            </div>
            <div className="column is-one-third-tablet">
              {selectFilter({
                id: 'stat',
                label: t('pages:items.stat'),
                key: 'stat',
                options: enumOptions(Object.values(Stat), 'enums:stat'),
                allLabel: t('pages:items.any'),
              })}
            </div>
            <div className="column is-one-third-tablet">
              {selectFilter({
                id: 'unique',
                label: t('pages:items.uniqueEquipped'),
                key: 'unique',
                options: [
                  <option key="yes" value="yes">
                    {t('pages:items.yes')}
                  </option>,
                ],
              })}
            </div>
            <div className="column is-one-third-tablet">
              <NumericFilter
                label={t('pages:items.levelRequirement')}
                minKey="levelMin"
                maxKey="levelMax"
                search={draftSearch}
                setSearch={setDraftSearch}
              />
            </div>
            <div className="column is-one-third-tablet">
              <NumericFilter
                label={t('pages:items.renownRequirement')}
                minKey="renownMin"
                maxKey="renownMax"
                search={draftSearch}
                setSearch={setDraftSearch}
              />
            </div>
            <div className="column is-one-third-tablet">
              <NumericFilter
                label={t('pages:items.itemLevel')}
                minKey="itemLevelMin"
                maxKey="itemLevelMax"
                search={draftSearch}
                setSearch={setDraftSearch}
              />
            </div>
          </div>
          <div className="is-flex is-justify-content-flex-end">
            <button className="button is-primary" type="submit">
              {t('pages:items.applyFilters')}
            </button>
          </div>
        </div>
      </form>
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
              <th className="is-hidden-touch" aria-label="Item icon" />
              <th>{sortHeader('name', t('pages:items.name'))}</th>
              <th className="is-hidden-touch">
                {sortHeader('type', t('pages:items.itemType'))}
              </th>
              <th className="is-hidden-touch">
                {sortHeader('slot', t('pages:items.slot'))}
              </th>
              <th>{sortHeader('rarity', t('pages:items.rarity'))}</th>
              <th>{sortHeader('levelRequirement', t('pages:items.level'))}</th>
              <th>
                {sortHeader(
                  'renownRankRequirement',
                  t('pages:items.renownRank'),
                )}
              </th>
              <th>{sortHeader('itemLevel', t('pages:items.itemLevel'))}</th>
              <th className="is-hidden-touch">{t('pages:items.stats')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <ItemListEntry key={entry.id} item={entry} />
            ))}
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
