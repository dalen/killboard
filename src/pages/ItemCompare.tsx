import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { EquipSlot, type ItemFilterInput, type Query, type Stat } from '@/__generated__/graphql';
import type { ReactElement } from 'react';
import './ItemCompare.scss';

const ITEM_COMPARE_FIELDS = `
  id
  name
  iconUrl
  type
  slot
  rarity
  itemLevel
  levelRequirement
  renownRankRequirement
  armor
  dps
  speed
  talismanSlots
  stats {
    stat
    value
    percentage
  }
  itemSet {
    name
  }
`;

const ITEM_COMPARE_SEARCH = gql`
  query ItemCompareSearch($where: ItemFilterInput!, $first: Int!) {
    items(where: $where, first: $first) {
      nodes {
        id
        name
        iconUrl
        type
        slot
        rarity
        itemLevel
      }
    }
  }
`;

const ITEM_COMPARE_QUERY = gql`
  query ItemCompareItems($ids: [ID!]!) {
    items(where: { id: { in: $ids } }, first: 2) {
      nodes {
        ${ITEM_COMPARE_FIELDS}
      }
    }
  }
`;

const EQUIPMENT_SLOTS = [
  EquipSlot.Back,
  EquipSlot.Belt,
  EquipSlot.Body,
  EquipSlot.Boots,
  EquipSlot.EitherHand,
  EquipSlot.Gloves,
  EquipSlot.Helm,
  EquipSlot.Jewellery1,
  EquipSlot.Jewellery2,
  EquipSlot.Jewellery3,
  EquipSlot.Jewellery4,
  EquipSlot.MainHand,
  EquipSlot.OffHand,
  EquipSlot.Pocket1,
  EquipSlot.Pocket2,
  EquipSlot.RangedWeapon,
  EquipSlot.Shoulder,
  EquipSlot.Standard,
  EquipSlot.Trophy1,
  EquipSlot.Trophy2,
  EquipSlot.Trophy3,
  EquipSlot.Trophy4,
  EquipSlot.Trophy5,
];

type ItemRecord = NonNullable<NonNullable<Query['items']>['nodes']>[number];
type CompareItem = ItemRecord & {
  iconUrl: string;
  stats: { stat: Stat; value: number; percentage: boolean }[];
};

const findStat = (item: CompareItem | undefined, stat: Stat) =>
  item?.stats.find((entry) => entry.stat === stat);
const formatStat = (value?: number, percentage = false) =>
  value == null ? '—' : `${value > 0 ? '+' : ''}${value}${percentage ? '%' : ''}`;
const formatScaledWeaponValue = (value: number, divisor: number) =>
  value > 0 ? (value / divisor).toFixed(1) : '—';

const ItemSearchBox = ({
  id,
  label,
  selectedItem,
  excludedId,
  onSelect,
  onClear,
}: {
  id: string;
  label: string;
  selectedItem?: ItemRecord;
  excludedId?: string;
  onSelect: (itemId: string) => void;
  onClear: () => void;
}): ReactElement => {
  const { t } = useTranslation(['common', 'enums', 'pages']);
  const [query, setQuery] = useState('');
  const [normalizedQuery, setNormalizedQuery] = useState('');
  useEffect(() => {
    const timer = globalThis.setTimeout(() => setNormalizedQuery(query.trim()), 250);
    return () => globalThis.clearTimeout(timer);
  }, [query]);
  const { data, loading, error } = useQuery<Pick<Query, 'items'>, {
    where: ItemFilterInput;
    first: number;
  }>(ITEM_COMPARE_SEARCH, {
    variables: {
      where: {
        name: { contains: normalizedQuery },
        slot: { in: EQUIPMENT_SLOTS },
      },
      first: 8,
    },
    skip: normalizedQuery.length < 2,
  });
  const results = (data?.items?.nodes ?? []).filter(
    (item) => item.id !== excludedId,
  );

  return (
    <section className="item-compare-picker">
      <label className="label" htmlFor={id}>{label}</label>
      <input
        id={id}
        className="input"
        type="search"
        autoComplete="off"
        placeholder={t('pages:itemCompare.searchPrompt')}
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      {selectedItem && (
        <div className="item-compare-selected mt-2">
          <span>{t('pages:itemCompare.selectedItem', { name: selectedItem.name })}</span>
          <button className="button is-small is-text" type="button" onClick={onClear}>
            {t('pages:itemCompare.clearSelection')}
          </button>
        </div>
      )}
      {normalizedQuery.length < 2 && (
        <p className="help">{t('pages:itemCompare.searchHint')}</p>
      )}
      {loading && <progress className="progress is-small mt-2" />}
      {error && <ErrorMessage name={error.name} message={error.message} />}
      {!loading && !error && normalizedQuery.length >= 2 && results.length === 0 && (
        <p className="help">{t('pages:itemCompare.noMatches')}</p>
      )}
      {normalizedQuery.length >= 2 && results.length > 0 && (
        <div className="item-compare-suggestions" role="listbox" aria-label={label}>
          {results.map((item) => (
            <button
              className="item-compare-suggestion"
              key={item.id}
              type="button"
              role="option"
              aria-selected={item.id === selectedItem?.id}
              onClick={() => {
                onSelect(item.id);
                setQuery('');
                setNormalizedQuery('');
              }}
            >
              <img src={item.iconUrl} alt="" />
              <span>
                <strong>{item.name}</strong>
                <small>
                  {t(`enums:itemSlot.${item.slot}`)} · {t(`enums:itemRarity.${item.rarity}`)} · #{item.id}
                </small>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export const ItemCompare = (): ReactElement => {
  const { t } = useTranslation(['common', 'enums', 'pages']);
  const [search, setSearch] = useSearchParams();
  const leftId = search.get('left') ?? '';
  const rightId = search.get('right') ?? '';
  const ids = [leftId, rightId].filter((id, index, all) => id !== '' && all.indexOf(id) === index);
  const { data, loading, error } = useQuery<Pick<Query, 'items'>, { ids: string[] }>(
    ITEM_COMPARE_QUERY,
    { variables: { ids }, skip: ids.length === 0 },
  );
  const itemById = new Map(
    (data?.items?.nodes ?? []).map((item) => [item.id, item as CompareItem]),
  );
  const leftItem = itemById.get(leftId);
  const rightItem = itemById.get(rightId);
  const items = [leftItem, rightItem].filter(
    (item): item is CompareItem => item != null,
  );
  const statNames = useMemo(
    () => [...new Set(items.flatMap((item) => item.stats.map((stat) => stat.stat)))].toSorted(),
    [data],
  );

  const setSelectedItem = (side: 'left' | 'right', id: string) => {
    const next = new URLSearchParams(search);
    if (id) {
      next.set(side, id);
    } else {
      next.delete(side);
    }
    setSearch(next);
  };
  const renderSet = (item?: CompareItem) =>
    item?.itemSet?.name ?? t('pages:itemCompare.noSet');

  return (
    <div className="container is-max-widescreen mt-2 item-compare-page">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><Link to="/">{t('common:home')}</Link></li>
          <li><Link to="/items">{t('pages:items.title')}</Link></li>
          <li className="is-active"><Link to="/item-compare">{t('pages:itemCompare.title')}</Link></li>
        </ul>
      </nav>
      <section className="card mb-5" aria-labelledby="item-compare-title">
        <div className="card-content">
          <h1 className="title is-3" id="item-compare-title">{t('pages:itemCompare.title')}</h1>
          <p className="has-text-grey mb-4">{t('pages:itemCompare.description')}</p>
          <div className="item-compare-pickers">
            <ItemSearchBox
              id="item-compare-left"
              label={t('pages:itemCompare.chooseFirst')}
              selectedItem={leftItem}
              excludedId={rightId}
              onSelect={(id) => setSelectedItem('left', id)}
              onClear={() => setSelectedItem('left', '')}
            />
            <ItemSearchBox
              id="item-compare-right"
              label={t('pages:itemCompare.chooseSecond')}
              selectedItem={rightItem}
              excludedId={leftId}
              onSelect={(id) => setSelectedItem('right', id)}
              onClear={() => setSelectedItem('right', '')}
            />
          </div>
        </div>
      </section>

      {loading && <progress className="progress" />}
      {error && <ErrorMessage name={error.name} message={error.message} />}
      {!loading && !error && items.length < 2 && (
        <p className="has-text-grey">{t('pages:itemCompare.comparePrompt')}</p>
      )}
      {!loading && !error && items.length === 2 && leftItem && rightItem && (
        <section className="card" aria-label={t('pages:itemCompare.title')}>
          <div className="card-content">
            <div className="item-compare-table-wrap">
              <table className="table is-fullwidth item-compare-table">
                <thead>
                  <tr>
                    <th scope="col">{t('pages:itemCompare.item')}</th>
                    {[leftItem, rightItem].map((item) => (
                      <th scope="col" key={item.id}>
                        <Link to={`/item/${item.id}`} className="item-compare-heading">
                          <img src={item.iconUrl} alt="" />
                          <span>{item.name}</span>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['slot', t(`enums:itemSlot.${leftItem.slot}`), t(`enums:itemSlot.${rightItem.slot}`)],
                    ['type', t(`enums:itemType.${leftItem.type}`), t(`enums:itemType.${rightItem.type}`)],
                    ['rarity', t(`enums:itemRarity.${leftItem.rarity}`), t(`enums:itemRarity.${rightItem.rarity}`)],
                    ['itemLevel', leftItem.itemLevel, rightItem.itemLevel],
                    ['levelRequirement', leftItem.levelRequirement, rightItem.levelRequirement],
                    ['renownRequirement', leftItem.renownRankRequirement, rightItem.renownRankRequirement],
                    ['armor', leftItem.armor, rightItem.armor],
                    ['damagePerSecond', formatScaledWeaponValue(leftItem.dps, 10), formatScaledWeaponValue(rightItem.dps, 10)],
                    ['speed', formatScaledWeaponValue(leftItem.speed, 100), formatScaledWeaponValue(rightItem.speed, 100)],
                    ['talismanSlots', leftItem.talismanSlots, rightItem.talismanSlots],
                    ['set', renderSet(leftItem), renderSet(rightItem)],
                  ].map(([key, leftValue, rightValue]) => (
                    <tr key={key}>
                      <th scope="row">{t(`pages:itemCompare.${key}`)}</th>
                      <td>{leftValue}</td>
                      <td>{rightValue}</td>
                    </tr>
                  ))}
                  {statNames.map((stat) => {
                    const leftStat = findStat(leftItem, stat);
                    const rightStat = findStat(rightItem, stat);
                    return (
                      <tr key={stat}>
                        <th scope="row">{t(`enums:stat.${stat}`)}</th>
                        <td>{formatStat(leftStat?.value, leftStat?.percentage)}</td>
                        <td>{formatStat(rightStat?.value, rightStat?.percentage)}</td>
                      </tr>
                    );
                  })}
                  {statNames.length === 0 && (
                    <tr><th scope="row">{t('pages:itemCompare.stats')}</th><td>—</td><td>—</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
