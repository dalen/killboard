import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { SkirmishFilterInput } from '@/__generated__/graphql';
import { ReactElement } from 'react';

const getLocationTypeFilter = (
  search: URLSearchParams,
): SkirmishFilterInput => {
  const locationType = search.get('type');

  if (locationType === 'rvr') {
    return {
      scenarioId: { eq: 0 },
      and: [
        { primaryZoneId: { neq: 6 } },
        { primaryZoneId: { neq: 11 } },
        { primaryZoneId: { neq: 100 } },
        { primaryZoneId: { neq: 106 } },
        { primaryZoneId: { neq: 200 } },
        { primaryZoneId: { neq: 206 } },
      ],
    };
  }

  if (locationType === 'rvrt1') {
    return {
      scenarioId: { eq: 0 },
      or: [
        { primaryZoneId: { eq: 6 } },
        { primaryZoneId: { eq: 11 } },
        { primaryZoneId: { eq: 100 } },
        { primaryZoneId: { eq: 106 } },
        { primaryZoneId: { eq: 200 } },
        { primaryZoneId: { eq: 206 } },
      ],
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

export function SkirmishFilters(): ReactElement {
  const { t } = useTranslation('components');
  const [search, setSearch] = useSearchParams();

  const locationType = search.get('type') || 'all';

  return (
    <div className="card mb-5">
      <div className="card-content">
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">
                {t('skirmishFilters.locationType')}
              </label>
              <select
                value={locationType}
                onChange={(event) => {
                  search.set('type', event.target.value);
                  setSearch(search);
                }}
              >
                <option value="all">
                  {t('skirmishFilters.locationTypeAll')}
                </option>
                <option value="rvr">
                  {t('skirmishFilters.locationTypeRvr')}
                </option>
                <option value="rvrt1">
                  {t('skirmishFilters.locationTypeRvrT1')}
                </option>
                <option value="scenario">
                  {t('skirmishFilters.locationTypeScenario')}
                </option>
              </select>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label">{t('skirmishFilters.minPlayers')}</label>
              <select
                onChange={(event) => {
                  search.set('minPlayers', event.target.value);
                  setSearch(search);
                }}
              >
                <option value="all">
                  {t('skirmishFilters.minPlayersAll')}
                </option>
                <option value="12">{t('skirmishFilters.minPlayers12')}</option>
                <option value="48">{t('skirmishFilters.minPlayers48')}</option>
                <option value="100">
                  {t('skirmishFilters.minPlayers100')}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
