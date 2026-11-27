import {
  startOfMonth,
  startOfWeek,
  subDays,
  subMinutes,
  subMonths,
  subWeeks,
} from 'date-fns';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

const getPeriodFilters = (search: URLSearchParams, defaultPeriod: string) => {
  const period = search.get('period') || defaultPeriod;

  switch (period) {
    case 'last30m': {
      return {
        time: {
          gte: subMinutes(new Date(), 30).toISOString(),
        },
      };
    }

    case 'last1h': {
      return {
        time: {
          gte: subMinutes(new Date(), 60).toISOString(),
        },
      };
    }

    case 'last2h': {
      return {
        time: {
          gte: subMinutes(new Date(), 120).toISOString(),
        },
      };
    }

    case 'last4h': {
      return {
        time: {
          gte: subMinutes(new Date(), 240).toISOString(),
        },
      };
    }

    case 'last24h': {
      return {
        time: {
          gte: subMinutes(new Date(), 24 * 60).toISOString(),
        },
      };
    }

    case 'last7d': {
      return {
        time: {
          gte: subDays(new Date(), 7).toISOString(),
        },
      };
    }

    case 'last30d': {
      return {
        time: {
          gte: subDays(new Date(), 30).toISOString(),
        },
      };
    }

    case 'thisWeek': {
      return {
        time: {
          gte: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
        },
      };
    }

    case 'lastWeek': {
      return {
        time: {
          gte: startOfWeek(subWeeks(new Date(), 1), {
            weekStartsOn: 1,
          }).toISOString(),
          lte: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
        },
      };
    }

    case 'thisMonth': {
      return {
        time: {
          gte: startOfMonth(new Date()).toISOString(),
        },
      };
    }

    case 'lastMonth': {
      return {
        time: {
          gte: startOfMonth(subMonths(new Date(), 1)).toISOString(),
          lte: startOfMonth(new Date()).toISOString(),
        },
      };
    }
  }

  return { time: {} };
};

const getSoloKillsFilters = (search: URLSearchParams) => {
  if (search.get('soloOnly') === 'true') {
    return { soloOnly: true };
  }

  return {};
};

export const getCurrentFilters = (
  search: URLSearchParams,
  defaultPeriod = 'all',
  includeZone = false,
) => ({
  ...getPeriodFilters(search, defaultPeriod),
  ...getSoloKillsFilters(search),
  ...(includeZone && search.get('zoneId')
    ? { zoneId: { eq: search.get('zoneId') } }
    : {}),
});

export const KillsFilters = ({
  defaultPeriod = 'all',
  showTimeZone = false,
}: {
  defaultPeriod?: string;
  showTimeZone?: boolean;
}): ReactElement => {
  const { t } = useTranslation('components');
  const [search, setSearch] = useSearchParams();

  const period = search.get('period') || defaultPeriod;

  return (
    <div className="card mb-5">
      <div className="card-content">
        <div className="columns">
          <div className="column">
            <div className="select">
              <select
                value={period}
                onChange={(event) => {
                  search.set('period', event.target.value);
                  setSearch(search);
                }}
              >
                <option value="all">{t('killsFilters.allTime')}</option>
                <option value="last30m">{t('killsFilters.last30m')}</option>
                <option value="last1h">{t('killsFilters.last1h')}</option>
                <option value="last2h">{t('killsFilters.last2h')}</option>
                <option value="last4h">{t('killsFilters.last4h')}</option>
                <option value="last24h">{t('killsFilters.last24h')}</option>
                <option value="last7d">{t('killsFilters.last7d')}</option>
                <option value="last30d">{t('killsFilters.last30d')}</option>
                <option value="thisWeek">{t('killsFilters.thisWeek')}</option>
                <option value="lastWeek">{t('killsFilters.lastWeek')}</option>
                <option value="thisMonth">{t('killsFilters.thisMonth')}</option>
                <option value="lastMonth">{t('killsFilters.lastMonth')}</option>
              </select>
            </div>
          </div>
          <div className="column">
            <label className="label">
              <input
                type="checkbox"
                checked={search.get('soloOnly') === 'true'}
                onChange={(event) => {
                  if (event.target.checked) {
                    search.set('soloOnly', 'true');
                  } else {
                    search.delete('soloOnly');
                  }
                  setSearch(search);
                }}
              />{' '}
              {t('killsFilters.soloOnly')}
            </label>
          </div>
          {showTimeZone && (
            <div className="column">
              <label className="label" htmlFor="kills-time-zone">
                {t('killsFilters.timeZone')}
              </label>
              <div className="select">
                <select
                  id="kills-time-zone"
                  value={
                    search.get('timeZone') === 'local' ? 'local' : 'altdorf'
                  }
                  onChange={(event) => {
                    const next = new URLSearchParams(search);
                    if (event.target.value === 'local') {
                      next.set('timeZone', 'local');
                    } else {
                      next.delete('timeZone');
                    }
                    setSearch(next);
                  }}
                >
                  <option value="altdorf">
                    {t('killsFilters.altdorfTime')}
                  </option>
                  <option value="local">
                    {t('killsFilters.computerTime')}
                  </option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
