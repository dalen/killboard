import type {
  DateTimeOperationFilterInput,
  ScenarioRecordFilterInput,
} from '@/__generated__/graphql';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import {
  WarhammerCheckbox,
  WarhammerDateInput,
  WarhammerFilterPanel,
  WarhammerSelect,
} from '@/components/global/WarhammerFormControls';

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
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
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
    if (dateRange.from) next.set('dateFrom', dateRange.from);
    else next.delete('dateFrom');
    if (dateRange.through) next.set('dateThrough', dateRange.through);
    else next.delete('dateThrough');
    setSearch(next);
  };

  const updateDateRange = (updates: Partial<ScenarioDateRange>) => {
    setDateRange((current) => ({ ...current, ...updates }));
    setDatePreset('custom');
  };

  const chooseDatePreset = (value: ScenarioDatePreset) => {
    setDatePreset(value);
    if (value !== 'custom') setDateRange(getPresetDateRange(value));
  };

  const queueOptions = [
    { value: 'all', label: t('scenarioFilters.queueTypeAll') },
    { value: 'standard', label: t('scenarioFilters.queueTypeStandard') },
    { value: 'solo', label: t('scenarioFilters.queueTypeSolo') },
    { value: 'city_siege', label: t('scenarioFilters.queueTypeCitySiege') },
    { value: 'group_ranked', label: t('scenarioFilters.queueTypeGroupRanked') },
    { value: 'solo_ranked', label: t('scenarioFilters.queueTypeSoloRanked') },
  ];
  const tierOptions = [
    { value: 'all', label: t('scenarioFilters.tierAll') },
    { value: '1', label: '1' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
  ];
  const dateOptions = [
    { value: '7d', label: t('scenarioFilters.last7Days') },
    { value: '30d', label: t('scenarioFilters.last30Days') },
    { value: '90d', label: t('scenarioFilters.last90Days') },
    { value: '6m', label: t('scenarioFilters.last6Months') },
    { value: '1y', label: t('scenarioFilters.lastYear') },
    { value: 'custom', label: t('scenarioFilters.customDates') },
  ];

  return (
    <WarhammerFilterPanel className="character-filters scenario-filters">
      <div
        className={`scenario-filter-grid${datePreset === 'custom' ? ' is-custom-date-range' : ''}`}
      >
        <WarhammerSelect
          id="queueType-select"
          label={t('scenarioFilters.queueType')}
          value={queueType}
          options={queueOptions}
          onChange={(value) => {
            const next = new URLSearchParams(search);
            next.set('queue_type', value);
            setSearch(next);
          }}
        />
        <WarhammerSelect
          id="tier-select"
          label={t('scenarioFilters.tier')}
          value={search.get('tier') || 'all'}
          options={tierOptions}
          onChange={(value) => {
            const next = new URLSearchParams(search);
            next.set('tier', value);
            setSearch(next);
          }}
        />
        <WarhammerSelect
          id="scenario-date-preset"
          label={t('scenarioFilters.dateRange')}
          value={datePreset}
          options={dateOptions}
          onChange={(value) => chooseDatePreset(value as ScenarioDatePreset)}
        />
        {datePreset === 'custom' && (
          <>
            <WarhammerDateInput
              id="scenario-date-from"
              label={t('scenarioFilters.dateFrom')}
              value={dateRange.from}
              max={dateRange.through || undefined}
              onChange={(from) => updateDateRange({ from })}
            />
            <WarhammerDateInput
              id="scenario-date-through"
              label={t('scenarioFilters.dateThrough')}
              value={dateRange.through}
              min={dateRange.from || undefined}
              onChange={(through) => updateDateRange({ through })}
            />
          </>
        )}
        <div className="scenario-filter-actions">
          <button className="button is-primary" type="button" onClick={applyDateFilters}>
            {t('scenarioFilters.applyDateFilters')}
          </button>
          {showPremadeOnly && (
            <WarhammerCheckbox
              id="scenario-premade-only"
              title="Scenarios with 6+ guild members only"
              checked={search.has('premadeOnly')}
              onChange={(checked) => {
                const next = new URLSearchParams(search);
                if (checked) next.set('premadeOnly', 'true');
                else next.delete('premadeOnly');
                setSearch(next);
              }}
            >
              {t('scenarioFilters.premadeOnly')}
            </WarhammerCheckbox>
          )}
        </div>
      </div>
    </WarhammerFilterPanel>
  );
};