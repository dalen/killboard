import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { InstanceRunFilterInput } from '@/__generated__/graphql';
import { ReactElement } from 'react';

const getInstanceFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const instance = search.get('instance');

  if (instance && instance !== 'all') {
    return { instanceId: { eq: Number(instance) } };
  }

  return {};
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
  start: { gt: 0 },
  scoreboardEntryCount: { gte: 6 },
  ...getInstanceFilters(search),
  ...getCompletedEncountersFilters(search),
  ...getMinItemRatingFilters(search),
  ...getAvgItemRatingFilters(search),
  ...getMaxItemRatingFilters(search),
});

export function InstanceRunsFilters(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();
  const instance = search.get('instance') ?? 'all';
  const completedEncounters =
    search.get('completedEncounters') &&
    Number(search.get('completedEncounters') ?? 0);
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
              <label className="label" htmlFor="instance-select">
                Instance
              </label>
              <div className="control">
                <div className="select">
                  <select
                    id="instance-select"
                    value={instance}
                    onChange={(event) => {
                      search.set('instance', event.target.value);
                      setSearch(search);
                    }}
                  >
                    <option value="all">{t('pages:instanceRuns.all')}</option>
                    <option value="260">Lost Vale</option>
                    <option value="176">Sigmar Crypts</option>
                    <option value="196">Bilerot</option>
                    <option value="160">Bastion Stair</option>
                    <option value="163">Thar&apos;Ignan</option>
                    <option value="164">Lord Slaurith</option>
                    <option value="165">Kaarn the Vanquisher</option>
                    <option value="166">Skull Lord Var&apos;Ithrok</option>
                    <option value="60">Gunbad</option>
                    <option value="63">Gunbad Nursery</option>
                    <option value="64">Gunbad Lab</option>
                    <option value="65">Squig Boss</option>
                    <option value="66">Gunbad Baracks</option>
                    <option value="33">Dragonback Pass (Order)</option>
                    <option value="37">Dragonback Pass (Destruction)</option>
                    <option value="152">Altdorf Sewers 1</option>
                    <option value="153">Altdorf Sewers 2</option>
                    <option value="169">Altdorf Sewers 3</option>
                    <option value="155">Sacellum 1</option>
                    <option value="156">Sacellum 2</option>
                    <option value="173">Sacellum 3</option>
                  </select>
                </div>
              </div>
            </div>
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
                  value={completedEncounters ?? undefined}
                  onChange={(event) => {
                    search.set('completedEncounters', event.target.value);
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
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-down" />
                </span>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="minItemRatingMin">
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
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-up" />
                </span>
              </div>
            </div>
          </div>
          <div className="column">
            <h6>Average item rating</h6>
            <div className="field">
              <label className="label" htmlFor="avgItemRatingMax">
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
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-down" />
                </span>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="avgItemRatingMin">
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
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-up" />
                </span>
              </div>
            </div>
          </div>
          <div className="column">
            <h6>Max item rating</h6>
            <div className="field">
              <label className="label" htmlFor="maxItemRatingMax">
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
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-down" />
                </span>
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="maxItemRatingMin">
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
                <span className="icon has-text-left">
                  <i className="fa-solid fa-arrow-up" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
