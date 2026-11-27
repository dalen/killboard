import type {
  DateTimeOperationFilterInput,
  ScenarioRecordFilterInput,
} from '@/__generated__/graphql';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

const getQueueTypeFilters = (
  search: URLSearchParams,
): { queueType?: number; premadeOnly: boolean } => {
  const queueType = search.get('queue_type');
  const premadeOnly = search.get('premadeOnly') === 'true';

  switch (queueType) {
    case 'standard':
      return { queueType: 0, premadeOnly };
    case 'group_ranked':
      return { queueType: 1, premadeOnly };
    case 'solo':
      return { queueType: 2, premadeOnly };
    case 'city_siege':
      return { queueType: 4, premadeOnly };
    case 'solo_ranked':
      return { queueType: 5, premadeOnly };
  }

  return { premadeOnly };
};

const getTierFilters = (search: URLSearchParams): ScenarioRecordFilterInput => {
  const tier = search.get('tier');

  switch (tier) {
    case 'all': {
      return {};
    }
    case '1':
    case '2':
    case '3':
    case '4': {
      return {
        tier: { eq: Number(tier) },
      };
    }
  }

  return {};
};

const getValidDate = (value: string | null): string | undefined => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? undefined
    : value;
};

type ScenarioDatePreset = '7d' | '30d' | '90d' | '6m' | '1y' | 'custom';
type ScenarioDateRange = { from: string; through: string };

const getPresetDateRange = (
  preset: Exclude<ScenarioDatePreset, 'custom'>,
): ScenarioDateRange => {
  const today = new Date();
  let start: Date;

  switch (preset) {
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

  return {
    from: format(start, 'yyyy-MM-dd'),
    through: format(today, 'yyyy-MM-dd'),
  };
};

export const getScenarioDateRange = (
  search: URLSearchParams,
  defaultLast30Days = true,
): ScenarioDateRange => {
  const fromValue = search.get('dateFrom');
  const throughValue = search.get('dateThrough');

  if (defaultLast30Days && fromValue == null && throughValue == null) {
    return getPresetDateRange('30d');
  }

  return {
    from: getValidDate(fromValue) ?? '',
    through: getValidDate(throughValue) ?? '',
  };
};

const getMatchingDatePreset = (
  range: ScenarioDateRange,
): ScenarioDatePreset => {
  for (const preset of ['7d', '30d', '90d', '6m', '1y'] as const) {
    const presetRange = getPresetDateRange(preset);
    if (
      presetRange.from === range.from &&
      presetRange.through === range.through
    ) {
      return preset;
    }
  }
  return 'custom';
};

const getLocalDateBoundary = (value: string, nextDay = false): string => {
  const [year, month, day] = value.split('-').map(Number);
  const boundary = new Date(year, month - 1, day);
  if (nextDay) {
    boundary.setDate(boundary.getDate() + 1);
  }
  return boundary.toISOString();
};

const getStartDateFilter = (
  search: URLSearchParams,
  defaultLast30Days: boolean,
): DateTimeOperationFilterInput | undefined => {
  const { from, through } = getScenarioDateRange(search, defaultLast30Days);
  const filter: DateTimeOperationFilterInput = {};

  if (from) {
    filter.gte = getLocalDateBoundary(from);
  }
  if (through) {
    filter.lt = getLocalDateBoundary(through, true);
  }

  return Object.keys(filter).length ? filter : undefined;
};

export const getScenarioFilters = (
  search: URLSearchParams,
  {
    characterId,
    guildId,
    wins,
    defaultLast30Days = true,
  }: {
    characterId?: string;
    guildId?: string;
    wins?: boolean;
    defaultLast30Days?: boolean;
  } = {},
): ScenarioRecordFilterInput => {
  const { queueType, premadeOnly } = getQueueTypeFilters(search);
  const where: ScenarioRecordFilterInput = {
    ...getTierFilters(search),
  };
  const startTime = getStartDateFilter(search, defaultLast30Days);

  if (startTime) {
    where.startTime = startTime;
  }

  if (queueType !== undefined) {
    where.queueType = { eq: queueType };
  }

  const scoreboardEntry: Record<string, unknown> = {};
  if (characterId) scoreboardEntry.characterId = { eq: characterId };
  if (guildId) scoreboardEntry.guildId = { eq: guildId };
  if (wins !== undefined) scoreboardEntry.isWinner = { eq: wins };
  if (premadeOnly) scoreboardEntry.isGuildPremade = { eq: true };

  if (Object.keys(scoreboardEntry).length > 0) {
    where.scoreboardEntries = { some: scoreboardEntry };
  }

  return where;
};

export const ScenarioFilters = ({
  showPremadeOnly = false,
  defaultLast30Days = true,
}: {
  showPremadeOnly?: boolean;
  defaultLast30Days?: boolean;
}): ReactElement => {
  const { t } = useTranslation('components');
  const [search, setSearch] = useSearchParams();
  const [dateRange, setDateRange] = useState<ScenarioDateRange>(() =>
    getScenarioDateRange(search, defaultLast30Days),
  );
  const [datePreset, setDatePreset] = useState<ScenarioDatePreset>(() =>
    getMatchingDatePreset(dateRange),
  );

  const queueType = search.get('queue_type') || 'all';

  useEffect(() => {
    const nextRange = getScenarioDateRange(search, defaultLast30Days);
    setDateRange(nextRange);
    setDatePreset(getMatchingDatePreset(nextRange));
  }, [defaultLast30Days, search]);

  const applyDateFilters = () => {
    const next = new URLSearchParams(search);
    if (dateRange.from) {
      next.set('dateFrom', dateRange.from);
    } else {
      next.delete('dateFrom');
    }
    if (dateRange.through) {
      next.set('dateThrough', dateRange.through);
    } else {
      next.delete('dateThrough');
    }
    setSearch(next);
  };

  const updateDateRange = (updates: Partial<ScenarioDateRange>) => {
    setDateRange((current) => ({ ...current, ...updates }));
    setDatePreset('custom');
  };

  const chooseDatePreset = (value: ScenarioDatePreset) => {
    setDatePreset(value);
    if (value !== 'custom') {
      setDateRange(getPresetDateRange(value));
    }
  };

  return (
    <div className="card mb-5">
      <div className="card-content">
        <div className="columns is-multiline">
          <div className="column is-6-tablet is-2-desktop">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label" htmlFor="queueType-select">
                  {t('scenarioFilters.queueType')}
                </label>
              </div>
              <div className="field-body">
                <div className="control">
                  <div className="select">
                    <select
                      id="queueType-select"
                      value={queueType}
                      onChange={(event) => {
                        search.set('queue_type', event.target.value);
                        setSearch(search);
                      }}
                    >
                      <option value="all">
                        {t('scenarioFilters.queueTypeAll')}
                      </option>
                      <option value="standard">
                        {t('scenarioFilters.queueTypeStandard')}
                      </option>
                      <option value="solo">
                        {t('scenarioFilters.queueTypeSolo')}
                      </option>
                      <option value="city_siege">
                        {t('scenarioFilters.queueTypeCitySiege')}
                      </option>
                      <option value="group_ranked">
                        {t('scenarioFilters.queueTypeGroupRanked')}
                      </option>
                      <option value="solo_ranked">
                        {t('scenarioFilters.queueTypeSoloRanked')}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-6-tablet is-2-desktop">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label" htmlFor="tier-select">
                  {t('scenarioFilters.tier')}
                </label>
              </div>
              <div className="field-body">
                <div className="control">
                  <div className="select">
                    <select
                      id="tier-select"
                      value={search.get('tier') || 'all'}
                      onChange={(event) => {
                        search.set('tier', event.target.value);
                        setSearch(search);
                      }}
                    >
                      <option value="all">
                        {t('scenarioFilters.tierAll')}
                      </option>
                      <option value="1">1</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-6-tablet is-2-desktop">
            <div className="field">
              <label className="label" htmlFor="scenario-date-preset">
                {t('scenarioFilters.dateRange')}
              </label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    id="scenario-date-preset"
                    value={datePreset}
                    onChange={(event) =>
                      chooseDatePreset(
                        event.currentTarget.value as ScenarioDatePreset,
                      )
                    }
                  >
                    <option value="7d">
                      {t('scenarioFilters.last7Days')}
                    </option>
                    <option value="30d">
                      {t('scenarioFilters.last30Days')}
                    </option>
                    <option value="90d">
                      {t('scenarioFilters.last90Days')}
                    </option>
                    <option value="6m">{t('scenarioFilters.last6Months')}</option>
                    <option value="1y">{t('scenarioFilters.lastYear')}</option>
                    <option value="custom">
                      {t('scenarioFilters.customDates')}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="column is-12-mobile is-6-tablet is-3-desktop">
            <div className="field">
              <label className="label" htmlFor="scenario-date-from">
                {t('scenarioFilters.dateFrom')}
              </label>
              <div className="control">
                <input
                  className="input"
                  id="scenario-date-from"
                  type="date"
                  value={dateRange.from}
                  max={dateRange.through || undefined}
                  onChange={(event) =>
                    updateDateRange({ from: event.currentTarget.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="column is-12-mobile is-6-tablet is-3-desktop">
            <div className="field">
              <label className="label" htmlFor="scenario-date-through">
                {t('scenarioFilters.dateThrough')}
              </label>
              <div className="control">
                <input
                  className="input"
                  id="scenario-date-through"
                  type="date"
                  value={dateRange.through}
                  min={dateRange.from || undefined}
                  onChange={(event) =>
                    updateDateRange({ through: event.currentTarget.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="column is-12 has-text-right">
            <button
              className="button is-primary"
              type="button"
              onClick={applyDateFilters}
            >
              {t('scenarioFilters.applyDateFilters')}
            </button>
          </div>
          {showPremadeOnly && (
            <div className="column">
              <label title="Scenarios with 6+ guild members only">
                <input
                  type="checkbox"
                  checked={search.has('premadeOnly')}
                  onChange={(event) => {
                    if (event.target.checked) {
                      search.set('premadeOnly', 'true');
                    } else {
                      search.delete('premadeOnly');
                    }
                    setSearch(search);
                  }}
                />{' '}
                {t('scenarioFilters.premadeOnly')}
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
