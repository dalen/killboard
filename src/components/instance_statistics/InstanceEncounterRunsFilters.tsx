import { useSearchParams } from 'react-router';
import { type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { InstanceEncounterRunFilterInput } from '@/__generated__/graphql';

type DateRange = { from: string; through: string };

const getValidDate = (value: string | null): string => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? value
    : '';
};

const getLocalDateBoundary = (value: string, nextDay = false): string => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (nextDay) date.setDate(date.getDate() + 1);
  return date.toISOString();
};

const getCompletedEncountersFilters = (
  search: URLSearchParams,
): InstanceEncounterRunFilterInput => {
  const completed = search.get('completed');

  if (completed === '1') {
    return { completed: { eq: true } };
  }

  return {};
};

const getMinItemRatingFilters = (
  search: URLSearchParams,
): InstanceEncounterRunFilterInput => {
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
): InstanceEncounterRunFilterInput => {
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
): InstanceEncounterRunFilterInput => {
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

export const getInstanceEncounterRunsFilters = (search: URLSearchParams) => ({
  scoreboardEntryCount: { gte: 6 },
  ...(() => {
    const from = getValidDate(search.get('dateFrom'));
    const through = getValidDate(search.get('dateThrough'));
    const start: { gte?: string; lt?: string } = {};
    if (from) start.gte = getLocalDateBoundary(from);
    if (through) start.lt = getLocalDateBoundary(through, true);
    return Object.keys(start).length ? { start } : {};
  })(),
  ...getCompletedEncountersFilters(search),
  ...getMinItemRatingFilters(search),
  ...getAvgItemRatingFilters(search),
  ...getMaxItemRatingFilters(search),
});

export const InstanceEncounterRunsFilters = (): ReactElement => {
  const { t } = useTranslation(['components', 'pages']);
  const [search, setSearch] = useSearchParams();
  const [dateRange, setDateRange] = useState<DateRange>(() => ({
    from: getValidDate(search.get('dateFrom')),
    through: getValidDate(search.get('dateThrough')),
  }));
  const completed =
    search.get('completed') && Number(search.get('completed') ?? 0);
  const minItemRatingMin =
    search.get('minItemRatingMin') &&
    Number(search.get('minItemRatingMin') ?? 0);
  const minItemRatingMax =
    search.get('minItemRatingMax') &&
    Number(search.get('minItemRatingMax') ?? 0);
  const avgItemRatingMin =
    search.get('avgItemRatingMin') &&
    Number(search.get('avgItemRatingMin') ?? 0);
  const avgItemRatingMax =
    search.get('avgItemRatingMax') &&
    Number(search.get('avgItemRatingMax') ?? 0);
  const maxItemRatingMin =
    search.get('maxItemRatingMin') &&
    Number(search.get('maxItemRatingMin') ?? 0);
  const maxItemRatingMax =
    search.get('maxItemRatingMax') &&
    Number(search.get('maxItemRatingMax') ?? 0);

  useEffect(() => {
    setDateRange({
      from: getValidDate(search.get('dateFrom')),
      through: getValidDate(search.get('dateThrough')),
    });
  }, [search]);

  const applyDateFilters = () => {
    const next = new URLSearchParams(search);
    if (dateRange.from) next.set('dateFrom', dateRange.from);
    else next.delete('dateFrom');
    if (dateRange.through) next.set('dateThrough', dateRange.through);
    else next.delete('dateThrough');
    setSearch(next);
  };
  const invalidDateRange =
    dateRange.from && dateRange.through && dateRange.from > dateRange.through;

  return (
    <div className="card mb-5">
      <div className="card-content">
        <div className="columns is-multiline">
          <div className="column is-12">
            <div className="columns is-vcentered">
              <div className="column">
                <label className="label" htmlFor="instance-stats-date-from">
                  {t('pages:instanceRuns.dateFrom')}
                </label>
                <input
                  id="instance-stats-date-from"
                  className="input"
                  type="date"
                  value={dateRange.from}
                  onChange={(event) =>
                    setDateRange((current) => ({
                      ...current,
                      from: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="column">
                <label className="label" htmlFor="instance-stats-date-through">
                  {t('pages:instanceRuns.dateThrough')}
                </label>
                <input
                  id="instance-stats-date-through"
                  className="input"
                  type="date"
                  value={dateRange.through}
                  onChange={(event) =>
                    setDateRange((current) => ({
                      ...current,
                      through: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="column is-narrow">
                <button
                  className="button is-warning"
                  type="button"
                  disabled={Boolean(invalidDateRange)}
                  onClick={applyDateFilters}
                >
                  {t('components:scenarioFilters.applyDateFilters')}
                </button>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label" htmlFor="completed">
                Completed only
              </label>
              <div className="control">
                <input
                  id="completed"
                  type="checkbox"
                  checked={completed === 1}
                  onChange={(event) => {
                    search.set('completed', event.target.checked ? '1' : '0');
                    setSearch(search);
                  }}
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
                  value={minItemRatingMax ?? undefined}
                  onChange={(event) => {
                    search.set('minItemRatingMax', event.target.value);
                    setSearch(search);
                  }}
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
                  value={minItemRatingMin ?? undefined}
                  onChange={(event) => {
                    search.set('minItemRatingMin', event.target.value);
                    setSearch(search);
                  }}
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
                  value={avgItemRatingMax ?? undefined}
                  onChange={(event) => {
                    search.set('avgItemRatingMax', event.target.value);
                    setSearch(search);
                  }}
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
                  value={avgItemRatingMin ?? undefined}
                  onChange={(event) => {
                    search.set('avgItemRatingMin', event.target.value);
                    setSearch(search);
                  }}
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
                  value={maxItemRatingMax ?? undefined}
                  onChange={(event) => {
                    search.set('maxItemRatingMax', event.target.value);
                    setSearch(search);
                  }}
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
                  value={maxItemRatingMin ?? undefined}
                  onChange={(event) => {
                    search.set('maxItemRatingMin', event.target.value);
                    setSearch(search);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
