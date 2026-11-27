import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { EquipSlot, type ItemFilterInput, type Query, type Stat } from '@/__generated__/graphql';
import type { ReactElement, ReactNode } from 'react';
import './ItemCompare.scss';

const ITEM_COMPARE_FIELDS = `
  id
  name
  iconUrl
  type
  slot
  careerRestriction
  raceRestriction
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
const numericDifference = (first: unknown, second: unknown): number | undefined =>
  typeof first === 'number' && typeof second === 'number' ? second - first : undefined;
const scaledDifference = (first: unknown, second: unknown, divisor: number): number | undefined => {
  if (typeof first !== 'number' || first <= 0 || typeof second !== 'number' || second <= 0) {
    return undefined;
  }
  return (second - first) / divisor;
};
const formatDifference = (difference?: number, percentage = false) =>
  difference == null ? '—' : `${difference > 0 ? '+' : ''}${difference}${percentage ? '%' : ''}`;

const ItemSearchBox = ({
  id,
  label,
  selectedItem,
  excludedId,
  preferredSlot,
  onSelect,
  onClear,
}: {
  id: string;
  label: string;
  selectedItem?: ItemRecord;
  excludedId?: string;
  preferredSlot?: EquipSlot;
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
  const preferredQuery = useQuery<Pick<Query, 'items'>, {
    where: ItemFilterInput;
    first: number;
  }>(ITEM_COMPARE_SEARCH, {
    variables: {
      where: {
        name: { contains: normalizedQuery },
        slot: { eq: preferredSlot },
      },
      first: 8,
    },
    skip: normalizedQuery.length < 2 || preferredSlot == null,
  });
  const otherSlotsQuery = useQuery<Pick<Query, 'items'>, {
    where: ItemFilterInput;
    first: number;
  }>(ITEM_COMPARE_SEARCH, {
    variables: {
      where: {
        name: { contains: normalizedQuery },
        and: preferredSlot == null
          ? [{ slot: { in: EQUIPMENT_SLOTS } }]
          : [
              { slot: { in: EQUIPMENT_SLOTS } },
              { slot: { nin: [preferredSlot] } },
            ],
      },
      first: 8,
    },
    skip: normalizedQuery.length < 2,
  });
  const loading = preferredQuery.loading || otherSlotsQuery.loading;
  const error = preferredQuery.error ?? otherSlotsQuery.error;
  const results = [
    ...(preferredQuery.data?.items?.nodes ?? []),
    ...(otherSlotsQuery.data?.items?.nodes ?? []),
  ].filter((item, index, all) => item.id !== excludedId && all.findIndex((candidate) => candidate.id === item.id) === index);

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
      {preferredSlot && normalizedQuery.length >= 2 && (
        <p className="help">{t('pages:itemCompare.sameSlotFirst')}</p>
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
                {preferredSlot === item.slot && (
                  <span className="tag is-small item-compare-same-slot">
                    {t('pages:itemCompare.sameSlot')}
                  </span>
                )}
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
  const careerRestrictionsDiffer = leftItem && rightItem &&
    [...leftItem.careerRestriction].toSorted().join('|') !== [...rightItem.careerRestriction].toSorted().join('|');
  const careerRestrictionsIncompatible = leftItem && rightItem &&
    leftItem.careerRestriction.length > 0 &&
    rightItem.careerRestriction.length > 0 &&
    !leftItem.careerRestriction.some((career) => rightItem.careerRestriction.includes(career));
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
  const swapSelectedItems = () => {
    const next = new URLSearchParams(search);
    if (rightId) next.set('left', rightId);
    else next.delete('left');
    if (leftId) next.set('right', leftId);
    else next.delete('right');
    setSearch(next);
  };
  const renderSet = (item?: CompareItem) =>
    item?.itemSet?.name ?? t('pages:itemCompare.noSet');
  const formatEnumList = (namespace: string, values: string[]) =>
    values.length
      ? values.map((value) => t(`enums:${namespace}.${value}`, { defaultValue: value.toLowerCase().replaceAll('_', ' ') })).join(', ')
      : undefined;
  const statComparisons = leftItem && rightItem
    ? statNames.map((stat) => {
        const first = findStat(leftItem, stat);
        const second = findStat(rightItem, stat);
        const percentage = first?.percentage ?? second?.percentage ?? false;
        const sameUnits = first == null || second == null || first.percentage === second.percentage;
        const difference = sameUnits
          ? (second?.value ?? 0) - (first?.value ?? 0)
          : undefined;
        return { stat, first, second, percentage, difference };
      })
    : [];
  const firstHigherStats = statComparisons.filter(
    (entry) => entry.difference != null && entry.difference < 0,
  );
  const secondHigherStats = statComparisons.filter(
    (entry) => entry.difference != null && entry.difference > 0,
  );

  const itemRows: { key: string; left: ReactNode; right: ReactNode; difference?: number }[] =
    leftItem && rightItem
      ? [
          { key: 'slot', left: t(`enums:itemSlot.${leftItem.slot}`), right: t(`enums:itemSlot.${rightItem.slot}`) },
          { key: 'careerRestriction', left: formatEnumList('career', leftItem.careerRestriction) ?? t('pages:itemCompare.noRestriction'), right: formatEnumList('career', rightItem.careerRestriction) ?? t('pages:itemCompare.noRestriction') },
          { key: 'raceRestriction', left: formatEnumList('race', leftItem.raceRestriction) ?? t('pages:itemCompare.noRestriction'), right: formatEnumList('race', rightItem.raceRestriction) ?? t('pages:itemCompare.noRestriction') },
          { key: 'type', left: t(`enums:itemType.${leftItem.type}`), right: t(`enums:itemType.${rightItem.type}`) },
          { key: 'rarity', left: t(`enums:itemRarity.${leftItem.rarity}`), right: t(`enums:itemRarity.${rightItem.rarity}`) },
          { key: 'itemLevel', left: leftItem.itemLevel, right: rightItem.itemLevel, difference: numericDifference(leftItem.itemLevel, rightItem.itemLevel) },
          { key: 'levelRequirement', left: leftItem.levelRequirement, right: rightItem.levelRequirement, difference: numericDifference(leftItem.levelRequirement, rightItem.levelRequirement) },
          { key: 'renownRequirement', left: leftItem.renownRankRequirement, right: rightItem.renownRankRequirement, difference: numericDifference(leftItem.renownRankRequirement, rightItem.renownRankRequirement) },
          { key: 'armor', left: leftItem.armor, right: rightItem.armor, difference: numericDifference(leftItem.armor, rightItem.armor) },
          { key: 'damagePerSecond', left: formatScaledWeaponValue(leftItem.dps, 10), right: formatScaledWeaponValue(rightItem.dps, 10), difference: scaledDifference(leftItem.dps, rightItem.dps, 10) },
          { key: 'speed', left: formatScaledWeaponValue(leftItem.speed, 100), right: formatScaledWeaponValue(rightItem.speed, 100), difference: scaledDifference(leftItem.speed, rightItem.speed, 100) },
          { key: 'talismanSlots', left: leftItem.talismanSlots, right: rightItem.talismanSlots, difference: numericDifference(leftItem.talismanSlots, rightItem.talismanSlots) },
          { key: 'set', left: renderSet(leftItem), right: renderSet(rightItem) },
        ]
      : [];

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
              preferredSlot={rightItem?.slot}
              onSelect={(id) => setSelectedItem('left', id)}
              onClear={() => setSelectedItem('left', '')}
            />
            <ItemSearchBox
              id="item-compare-right"
              label={t('pages:itemCompare.chooseSecond')}
              selectedItem={rightItem}
              excludedId={leftId}
              preferredSlot={leftItem?.slot}
              onSelect={(id) => setSelectedItem('right', id)}
              onClear={() => setSelectedItem('right', '')}
            />
          </div>
          {leftId && rightId && (
            <div className="item-compare-picker-actions">
              <button className="button is-small" type="button" onClick={swapSelectedItems}>
                {t('pages:itemCompare.swapItems')}
              </button>
            </div>
          )}
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
            <section className="item-compare-summary" aria-labelledby="item-compare-summary-title">
              <div className="item-compare-summary-heading">
                <h2 id="item-compare-summary-title">{t('pages:itemCompare.statGainsLosses')}</h2>
                <p>{t('pages:itemCompare.rawDeltaNote')}</p>
              </div>
              {leftItem.slot !== rightItem.slot && (
                <p className="item-compare-slot-warning">{t('pages:itemCompare.differentSlotsNote')}</p>
              )}
              {careerRestrictionsIncompatible ? (
                <p className="item-compare-slot-warning">{t('pages:itemCompare.careerRestrictionsIncompatible')}</p>
              ) : careerRestrictionsDiffer && (
                <p className="item-compare-slot-warning">{t('pages:itemCompare.careerRestrictionDiffers')}</p>
              )}
              {statComparisons.length === 0 ? (
                <p className="help">{t('pages:itemCompare.noNumericStatDifferences')}</p>
              ) : (
                <div className="item-compare-summary-columns">
                  {[
                    { item: leftItem, entries: firstHigherStats },
                    { item: rightItem, entries: secondHigherStats },
                  ].map(({ item, entries }) => (
                    <div className="item-compare-summary-side" key={item.id}>
                      <strong>{t('pages:itemCompare.higherOnItem', { name: item.name })}</strong>
                      {entries.length === 0 ? (
                        <span className="help">{t('pages:itemCompare.noHigherStats')}</span>
                      ) : (
                        <ul>
                          {entries.map(({ stat, difference, percentage }) => (
                            <li key={stat}>
                              <span>{t(`enums:stat.${stat}`)}</span>
                              <strong>{formatDifference(Math.abs(difference ?? 0), percentage)}</strong>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
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
                    <th scope="col">{t('pages:itemCompare.deltaSecondMinusFirst')}</th>
                  </tr>
                </thead>
                <tbody>
                  {itemRows.map(({ key, left, right, difference }) => (
                    <tr key={key}>
                      <th scope="row">{t(`pages:itemCompare.${key}`)}</th>
                      <td>{left ?? '—'}</td>
                      <td>{right ?? '—'}</td>
                      <td>{formatDifference(difference)}</td>
                    </tr>
                  ))}
                  {statComparisons.map(({ stat, first, second, difference, percentage }) => {
                    return (
                      <tr key={stat}>
                        <th scope="row">{t(`enums:stat.${stat}`)}</th>
                        <td>{formatStat(first?.value, first?.percentage)}</td>
                        <td>{formatStat(second?.value, second?.percentage)}</td>
                        <td>{formatDifference(difference, percentage)}</td>
                      </tr>
                    );
                  })}
                  {statNames.length === 0 && (
                    <tr><th scope="row">{t('pages:itemCompare.stats')}</th><td>—</td><td>—</td><td>—</td></tr>
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
