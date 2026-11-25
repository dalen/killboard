import {
  startOfMonth,
  startOfWeek,
  subMinutes,
  subMonths,
  subWeeks,
} from 'date-fns';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

const getPeriodFilters = (search: URLSearchParams) => {
  const period = search.get('period');

  switch (period) {
    case 'last30m':
      return {
        time: {
          gte: subMinutes(new Date(), 30).toISOString(),
        },
      };

    case 'last1h':
      return {
        time: {
          gte: subMinutes(new Date(), 60).toISOString(),
        },
      };

    case 'last2h':
      return {
        time: {
          gte: subMinutes(new Date(), 120).toISOString(),
        },
      };

    case 'last4h':
      return {
        time: {
          gte: subMinutes(new Date(), 240).toISOString(),
        },
      };

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
  if (search.has('soloOnly')) {
    return { soloOnly: true };
  }

  return {};
};

export const getCurrentFilters = (search: URLSearchParams) => ({
  ...getPeriodFilters(search),
  ...getSoloKillsFilters(search),
});

export const KillsFilters = (): ReactElement => {
  const { t } = useTranslation('components');
  const [search, setSearch] = useSearchParams();

  const period = search.get('period') || 'all';

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
                checked={search.has('soloOnly')}
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
        </div>
      </div>
    </div>
  );
};
