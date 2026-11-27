import { format, subDays, subMonths, subYears } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import type { InstanceRunFilterInput } from '@/__generated__/graphql';
import type { ReactElement } from 'react';
import {
  getInstanceRunFamily,
  INSTANCE_RUN_FAMILIES,
} from '@/components/instance_run/instanceRunFamilies';

const getInstanceFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const instance = search.get('instance');

  if (instance && instance !== 'all') {
    const family = getInstanceRunFamily(instance);
    if (family) return { instanceId: { in: family.ids.map(Number) } };
    return { instanceId: { eq: Number(instance) } };
  }

  return {};
};

const getStartDateFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const range = getInstanceRunDateRange(search);
  const start: NonNullable<InstanceRunFilterInput['start']> = {};

  if (range.from && /^\d{4}-\d{2}-\d{2}$/.test(range.from)) {
    const [year, month, day] = range.from.split('-').map(Number);
    start.gte = new Date(year, month - 1, day).toISOString();
  }

  if (range.through && /^\d{4}-\d{2}-\d{2}$/.test(range.through)) {
    const [year, month, day] = range.through.split('-').map(Number);
    start.lt = new Date(year, month - 1, day + 1).toISOString();
  }

  return Object.keys(start).length ? { start } : {};
};

type InstanceRunPeriod = '7d' | '30d' | '90d' | '6m' | '1y' | 'custom';
type InstanceRunDateRange = { from: string; through: string };
const instanceRunPeriods: InstanceRunPeriod[] = [
  '7d',
  '30d',
  '90d',
  '6m',
  '1y',
  'custom',
];

const formatDateInput = (date: Date) => format(date, 'yyyy-MM-dd');

const getPresetDateRange = (
  period: Exclude<InstanceRunPeriod, 'custom'>,
): InstanceRunDateRange => {
  const today = new Date();
  let start: Date;
  switch (period) {
    case '7d':
      start = subDays(today, 6);
      break;
    case '30d':
      start = subDays(today, 29);
      break;
    case '90d':
      start = subDays(today, 89);
      break;
    case '6m':
      start = subMonths(today, 6);
      break;
    case '1y':
      start = subYears(today, 1);
      break;
  }
  return { from: formatDateInput(start), through: formatDateInput(today) };
};

const getValidDate = (value: string | null): string => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? value
    : '';
};

const getSelectedPeriod = (search: URLSearchParams): InstanceRunPeriod => {
  const period = search.get('period');
  if (instanceRunPeriods.includes(period as InstanceRunPeriod)) {
    return period as InstanceRunPeriod;
  }
  return search.has('from') || search.has('through') ? 'custom' : '7d';
};

export const getInstanceRunDateRange = (
  search: URLSearchParams,
): InstanceRunDateRange => {
  const period = getSelectedPeriod(search);
  if (period !== 'custom') return getPresetDateRange(period);
  const from = getValidDate(search.get('from'));
  const through = getValidDate(search.get('through'));
  // Treat an empty custom URL as the safe default instead of an all-history query.
  return !from && !through ? getPresetDateRange('7d') : { from, through };
};

const getCompletedEncountersFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const completedEncounters = search.get('completedEncounters');

  if (completedEncounters && completedEncounters !== '0') {
    return { completedEncounters: { gte: Number(completedEncounters) } };
  }

  return {};
};

const getMinItemRatingFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const minItemRatingMin = search.get('minItemRatingMin');
  const minItemRatingMax = search.get('minItemRatingMax');

  if (
    minItemRatingMin &&
    minItemRatingMin !== '0' &&
    minItemRatingMax &&
    minItemRatingMax !== '0'
  ) {
    return {
      minItemRating: {
        gte: Number(minItemRatingMin),
        lte: Number(minItemRatingMax),
      },
    };
  }

  if (minItemRatingMin && minItemRatingMin !== '0') {
    return {
      minItemRating: {
        gte: Number(minItemRatingMin),
      },
    };
  }

  if (minItemRatingMax && minItemRatingMax !== '0') {
    return {
      minItemRating: {
        lte: Number(minItemRatingMax),
      },
    };
  }

  return {};
};

const getAvgItemRatingFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const avgItemRatingMin = search.get('avgItemRatingMin');
  const avgItemRatingMax = search.get('avgItemRatingMax');

  if (
    avgItemRatingMin &&
    avgItemRatingMin !== '0' &&
    avgItemRatingMax &&
    avgItemRatingMax !== '0'
  ) {
    return {
      averageItemRating: {
        gte: Number(avgItemRatingMin),
        lte: Number(avgItemRatingMax),
      },
    };
  }

  if (avgItemRatingMin && avgItemRatingMin !== '0') {
    return {
      averageItemRating: {
        gte: Number(avgItemRatingMin),
      },
    };
  }

  if (avgItemRatingMax && avgItemRatingMax !== '0') {
    return {
      averageItemRating: {
        lte: Number(avgItemRatingMax),
      },
    };
  }

  return {};
};

const getMaxItemRatingFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const maxItemRatingMin = search.get('maxItemRatingMin');
  const maxItemRatingMax = search.get('maxItemRatingMax');

  if (
    maxItemRatingMin &&
    maxItemRatingMin !== '0' &&
    maxItemRatingMax &&
    maxItemRatingMax !== '0'
  ) {
    return {
      maxItemRating: {
        gte: Number(maxItemRatingMin),
        lte: Number(maxItemRatingMax),
      },
    };
  }

  if (maxItemRatingMin && maxItemRatingMin !== '0') {
    return {
      maxItemRating: {
        gte: Number(maxItemRatingMin),
      },
    };
  }

  if (maxItemRatingMax && maxItemRatingMax !== '0') {
    return {
      maxItemRating: {
        lte: Number(maxItemRatingMax),
      },
    };
  }

  return {};
};

export const getInstanceRunsFilters = (search: URLSearchParams) => ({
  // Hide empty dungeon records by default, while keeping Sewers and Sacellum visible.
  // Boss kills remain visible regardless of party size.
  or: [
    { completedEncounters: { gte: 1 } },
    {
      instanceId: {
        in: INSTANCE_RUN_FAMILIES.filter(
          (family) =>
            family.key === 'altdorf-sewers' || family.key === 'sacellum',
        ).flatMap((family) => family.ids.map(Number)),
      },
    },
  ],
  ...getInstanceFilters(search),
  ...getStartDateFilters(search),
  ...getCompletedEncountersFilters(search),
  ...getMinItemRatingFilters(search),
  ...getAvgItemRatingFilters(search),
  ...getMaxItemRatingFilters(search),
});

export const InstanceRunsFilters = ({
  onApply,
}: {
  onApply: () => void;
}): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();
  const [draft, setDraft] = useState(() => new URLSearchParams(search));
  const searchKey = search.toString();

  useEffect(() => {
    setDraft(new URLSearchParams(searchKey));
  }, [searchKey]);

  const updateDraft = (key: string, value: string) => {
    setDraft((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key === 'from' || key === 'through') next.set('period', 'custom');
      return next;
    });
  };

  const applyFilters = (values = draft) => {
    const next = new URLSearchParams(values);
    const period = getSelectedPeriod(next);
    next.set('period', period);
    if (period !== 'custom') {
      next.delete('from');
      next.delete('through');
    }
    next.delete('after');
    next.delete('before');
    setSearch(next);
    onApply();
  };

  const requestedInstance = draft.get('instance') ?? 'all';
  const instance =
    getInstanceRunFamily(requestedInstance)?.key ?? requestedInstance;
  const period = getSelectedPeriod(draft);
  const range = period === 'custom'
    ? {
        from: getValidDate(draft.get('from')),
        through: getValidDate(draft.get('through')),
      }
    : getPresetDateRange(period);
  const from = range.from;
  const through = range.through;
  const invalidCustomRange =
    period === 'custom' &&
    (!from || !through || from > through);

  return (
    <div className="card mb-5">
      <form
        className="card-content instance-runs-filter-form"
        onSubmit={(event) => {
          event.preventDefault();
          applyFilters();
        }}
      >
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label" htmlFor="instance-run-period">
                {t('pages:instanceRuns.timePeriod')}
              </label>
              <div className="select">
                <select
                  id="instance-run-period"
                  value={period}
                  onChange={(event) => {
                    const next = new URLSearchParams(draft);
                    next.set('period', event.currentTarget.value);
                    if (event.currentTarget.value !== 'custom') {
                      next.delete('from');
                      next.delete('through');
                    }
                    setDraft(next);
                  }}
                >
                  <option value="7d">{t('pages:instanceRuns.last7Days')}</option>
                  <option value="30d">{t('pages:instanceRuns.last30Days')}</option>
                  <option value="90d">{t('pages:instanceRuns.last90Days')}</option>
                  <option value="6m">{t('pages:instanceRuns.last6Months')}</option>
                  <option value="1y">{t('pages:instanceRuns.lastYear')}</option>
                  <option value="custom">{t('pages:instanceRuns.customDateRange')}</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="instance-select">
                Instance
              </label>
              <div className="control">
                <div className="select">
                  <select
                    id="instance-select"
                    value={instance}
                    onChange={(event) => {
                      const next = new URLSearchParams(draft);
                      if (event.target.value === 'all') next.delete('instance');
                      else next.set('instance', event.target.value);
                      setDraft(next);
                      applyFilters(next);
                    }}
                  >
                    <option value="all">{t('pages:instanceRuns.all')}</option>
                    <option value="260">Lost Vale</option>
                    <option value="176">Sigmar Crypts</option>
                    <option value="196">Bilerot</option>
                    <option value="bastion-stair">Bastion Stair</option>
                    <option value="gunbad">Gunbad</option>
                    <option value="36">Dragonback Pass (Order)</option>
                    <option value="37">Dragonback Pass (Destruction)</option>
                    <option value="altdorf-sewers">Altdorf Sewers</option>
                    <option value="sacellum">Sacellum</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column">
                <label className="label" htmlFor="instance-run-from">
                  {t('pages:instanceRuns.dateFrom')}
                </label>
                <input
                  id="instance-run-from"
                  className="input"
                  type="date"
                  value={from}
                  disabled={period !== 'custom'}
                  required={period === 'custom'}
                  max={through || undefined}
                  onChange={(event) => updateDraft('from', event.target.value)}
                />
              </div>
              <div className="column">
                <label className="label" htmlFor="instance-run-through">
                  {t('pages:instanceRuns.dateThrough')}
                </label>
                <input
                  id="instance-run-through"
                  className="input"
                  type="date"
                  value={through}
                  disabled={period !== 'custom'}
                  required={period === 'custom'}
                  min={from || undefined}
                  onChange={(event) =>
                    updateDraft('through', event.target.value)
                  }
                />
              </div>
            </div>
            {invalidCustomRange && (
              <p className="help is-danger" role="alert">
                {t('pages:instanceRuns.customRangeRequired')}
              </p>
            )}
            <div className="field">
              <label className="label" htmlFor="completedEncounters">
                Min completed encounters
              </label>
              <div className="control">
                <input
                  id="completedEncounters"
                  className="input"
                  type="number"
                  step={1}
                  placeholder="0"
                  value={draft.get('completedEncounters') ?? ''}
                  onChange={(event) =>
                    updateDraft('completedEncounters', event.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="column">
            <h6>Min item rating</h6>
            <div className="field">
              <label className="label" htmlFor="minItemRatingMax">
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-down" />
                </span>
                Below
              </label>
              <div className="control">
                <input
                  id="minItemRatingMax"
                  className="input"
                  type="number"
                  step={1}
                  placeholder="0"
                  value={draft.get('minItemRatingMax') ?? ''}
                  onChange={(event) =>
                    updateDraft('minItemRatingMax', event.target.value)
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="minItemRatingMin">
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-up" />
                </span>
                Above
              </label>
              <div className="control">
                <input
                  id="minItemRatingMin"
                  className="input"
                  type="number"
                  step={1}
                  placeholder="0"
                  value={draft.get('minItemRatingMin') ?? ''}
                  onChange={(event) =>
                    updateDraft('minItemRatingMin', event.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="column">
            <h6>Average item rating</h6>
            <div className="field">
              <label className="label" htmlFor="avgItemRatingMax">
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-down" />
                </span>
                Below
              </label>
              <div className="control">
                <input
                  id="avgItemRatingMax"
                  className="input"
                  type="number"
                  step={1}
                  placeholder="0"
                  value={draft.get('avgItemRatingMax') ?? ''}
                  onChange={(event) =>
                    updateDraft('avgItemRatingMax', event.target.value)
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="avgItemRatingMin">
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-up" />
                </span>
                Above
              </label>
              <div className="control">
                <input
                  id="avgItemRatingMin"
                  className="input"
                  type="number"
                  step={1}
                  placeholder="0"
                  value={draft.get('avgItemRatingMin') ?? ''}
                  onChange={(event) =>
                    updateDraft('avgItemRatingMin', event.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="column">
            <h6>Max item rating</h6>
            <div className="field">
              <label className="label" htmlFor="maxItemRatingMax">
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-down" />
                </span>
                Below
              </label>
              <div className="control">
                <input
                  id="maxItemRatingMax"
                  className="input"
                  type="number"
                  step={1}
                  placeholder="0"
                  value={draft.get('maxItemRatingMax') ?? ''}
                  onChange={(event) =>
                    updateDraft('maxItemRatingMax', event.target.value)
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="maxItemRatingMin">
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-up" />
                </span>
                Above
              </label>
              <div className="control">
                <input
                  id="maxItemRatingMin"
                  className="input"
                  type="number"
                  step={1}
                  placeholder="0"
                  value={draft.get('maxItemRatingMin') ?? ''}
                  onChange={(event) =>
                    updateDraft('maxItemRatingMin', event.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="is-flex is-justify-content-flex-end mt-2">
          <button
            className="button is-primary"
            type="submit"
            disabled={invalidCustomRange}
          >
            {t('pages:instanceRuns.applyFilters')}
          </button>
        </div>
      </form>
    </div>
  );
};
