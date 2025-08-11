import { useSearchParams } from 'react-router';
import { InstanceEncounterRunFilterInput } from '@/__generated__/graphql';
import { ReactElement } from 'react';

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
  start: { gt: 0 },
  scoreboardEntryCount: { gte: 6 },
  ...getCompletedEncountersFilters(search),
  ...getMinItemRatingFilters(search),
  ...getAvgItemRatingFilters(search),
  ...getMaxItemRatingFilters(search),
});

export function InstanceEncounterRunsFilters(): ReactElement {
  const [search, setSearch] = useSearchParams();
  const completed =
    search.get('completed') && Number(search.get('completed') ?? 0);
  const minItemRatingMin =
    search.get('minItemRatingMin') &&
    Number(search.get('minItemRatingMin') ?? 0);
  const minItemRatingMax =
    search.get('minItemRatingMax') &&
    Number(search.get('minItemRatingMax') ?? 0);
  const avgItemRatingMin =
    search.get('minItemRatingMax') &&
    Number(search.get('avgItemRatingMin') ?? 0);
  const avgItemRatingMax =
    search.get('minItemRatingMax') &&
    Number(search.get('avgItemRatingMax') ?? 0);
  const maxItemRatingMin =
    search.get('maxItemRatingMax') &&
    Number(search.get('maxItemRatingMin') ?? 0);
  const maxItemRatingMax =
    search.get('maxItemRatingMax') &&
    Number(search.get('maxItemRatingMax') ?? 0);

  return (
    <div className="card mb-5">
      <div className="card-content">
        <div className="columns">
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
}
