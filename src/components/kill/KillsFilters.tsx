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
import {
  WarhammerCheckbox,
  WarhammerFilterPanel,
  WarhammerSelect,
} from '@/components/global/WarhammerFormControls';

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

  const periodOptions = [
    ['all', 'allTime'],
    ['last30m', 'last30m'],
    ['last1h', 'last1h'],
    ['last2h', 'last2h'],
    ['last4h', 'last4h'],
    ['last24h', 'last24h'],
    ['last7d', 'last7d'],
    ['last30d', 'last30d'],
    ['thisWeek', 'thisWeek'],
    ['lastWeek', 'lastWeek'],
    ['thisMonth', 'thisMonth'],
    ['lastMonth', 'lastMonth'],
  ].map(([value, label]) => ({ value, label: t(`killsFilters.${label}`) }));

  const updateParam = (key: string, value: string): void => {
    const next = new URLSearchParams(search);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearch(next);
  };

  return (
    <WarhammerFilterPanel className="character-filters">
      <div
        className={`warhammer-filter-grid kills-filter-grid${showTimeZone ? ' has-time-zone' : ''}`}
      >
        <WarhammerSelect
          id="kills-period"
          label={t('killsFilters.timePeriod')}
          value={period}
          options={periodOptions}
          onChange={(value) =>
            updateParam('period', value === defaultPeriod ? '' : value)
          }
        />
        <WarhammerCheckbox
          id="kills-solo-only"
          checked={search.get('soloOnly') === 'true'}
          onChange={(checked) => updateParam('soloOnly', checked ? 'true' : '')}
        >
          {t('killsFilters.soloOnly')}
        </WarhammerCheckbox>
        {showTimeZone && (
          <WarhammerSelect
            id="kills-time-zone"
            label={t('killsFilters.timeZone')}
            value={search.get('timeZone') === 'local' ? 'local' : 'altdorf'}
            options={[
              { value: 'altdorf', label: t('killsFilters.altdorfTime') },
              { value: 'local', label: t('killsFilters.computerTime') },
            ]}
            onChange={(value) =>
              updateParam('timeZone', value === 'local' ? 'local' : '')
            }
          />
        )}
      </div>
    </WarhammerFilterPanel>
  );
};
