import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import type { SkirmishFilterInput } from '@/__generated__/graphql';
import type { ReactElement } from 'react';
import {
  WarhammerFilterPanel,
  WarhammerSelect,
} from '@/components/global/WarhammerFormControls';

const getLocationTypeFilter = (
  search: URLSearchParams,
): SkirmishFilterInput => {
  const locationType = search.get('type');

  if (locationType === 'rvr') {
    return {
      and: [
        { primaryZoneId: { neq: 6 } },
        { primaryZoneId: { neq: 11 } },
        { primaryZoneId: { neq: 100 } },
        { primaryZoneId: { neq: 106 } },
        { primaryZoneId: { neq: 200 } },
        { primaryZoneId: { neq: 206 } },
      ],
      scenarioId: { eq: 0 },
    };
  }

  if (locationType === 'rvrt1') {
    return {
      or: [
        { primaryZoneId: { eq: 6 } },
        { primaryZoneId: { eq: 11 } },
        { primaryZoneId: { eq: 100 } },
        { primaryZoneId: { eq: 106 } },
        { primaryZoneId: { eq: 200 } },
        { primaryZoneId: { eq: 206 } },
      ],
      scenarioId: { eq: 0 },
    };
  }

  if (locationType === 'scenario') {
    return {
      scenarioId: { neq: 0 },
    };
  }

  return {};
};

const getMinPlayersFilter = (search: URLSearchParams): SkirmishFilterInput => {
  const minPlayers = search.get('minPlayers');

  if (minPlayers === 'all' || !minPlayers) {
    return {};
  }

  return { numberOfPlayers: { gte: Number(minPlayers) } };
};

export const getskirmishFilters = (
  search: URLSearchParams,
): SkirmishFilterInput => ({
  ...getLocationTypeFilter(search),
  ...getMinPlayersFilter(search),
});

export const SkirmishFilters = (): ReactElement => {
  const { t } = useTranslation('components');
  const [search, setSearch] = useSearchParams();

  const locationType = search.get('type') || 'all';
  const minPlayers = search.get('minPlayers') || 'all';

  const locationOptions = [
    { value: 'all', label: t('skirmishFilters.locationTypeAll') },
    { value: 'rvr', label: t('skirmishFilters.locationTypeRvr') },
    { value: 'rvrt1', label: t('skirmishFilters.locationTypeRvrT1') },
    { value: 'scenario', label: t('skirmishFilters.locationTypeScenario') },
  ];
  const minPlayerOptions = [
    { value: 'all', label: t('skirmishFilters.minPlayersAll') },
    { value: '12', label: t('skirmishFilters.minPlayers12') },
    { value: '48', label: t('skirmishFilters.minPlayers48') },
    { value: '100', label: t('skirmishFilters.minPlayers100') },
  ];

  const updateFilter = (key: 'type' | 'minPlayers', value: string): void => {
    const next = new URLSearchParams(search);
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    setSearch(next);
  };

  return (
    <WarhammerFilterPanel className="character-filters">
      <div className="warhammer-filter-grid">
        <WarhammerSelect
          id="skirmish-location-type"
          label={t('skirmishFilters.locationType')}
          value={locationType}
          options={locationOptions}
          onChange={(value) => updateFilter('type', value)}
        />
        <WarhammerSelect
          id="skirmish-min-players"
          label={t('skirmishFilters.minPlayers')}
          value={minPlayers}
          options={minPlayerOptions}
          onChange={(value) => updateFilter('minPlayers', value)}
        />
      </div>
    </WarhammerFilterPanel>
  );
};
