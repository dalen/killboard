import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { subDays } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { creatureLocationOptions } from '@/data/creatureFilterOptions';
import type { ReactElement } from 'react';

const ZONE_ACTIVITY_COMPARISON = gql`
  query GetZoneActivityComparison(
    $from: DateTime!
    $to: DateTime!
    $zoneA: ID!
    $zoneB: ID!
  ) {
    zoneA: kills(where: { time: { gte: $from, lt: $to }, zoneId: { eq: $zoneA } }) {
      totalCount
    }
    zoneB: kills(where: { time: { gte: $from, lt: $to }, zoneId: { eq: $zoneB } }) {
      totalCount
    }
  }
`;

const PERIOD_DAYS = {
  last24h: 1,
  last7d: 7,
  last30d: 30,
} as const;
type ComparisonPeriod = keyof typeof PERIOD_DAYS;

const DEFAULT_ZONE_A = '6';
const DEFAULT_ZONE_B = '105';
const sortedZones = [...creatureLocationOptions].sort((a, b) =>
  a.name.localeCompare(b.name) || Number(a.id) - Number(b.id),
);
const validZoneIds: ReadonlySet<string> = new Set(
  sortedZones.map((zone) => zone.id),
);
const utcDateTime = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});
const numberFormat = new Intl.NumberFormat();

type ZoneActivityComparisonData = {
  zoneA: { totalCount: number };
  zoneB: { totalCount: number };
};
type ZoneActivityComparisonVariables = {
  from: string;
  to: string;
  zoneA: string;
  zoneB: string;
};

const getZoneName = (id: string): string =>
  sortedZones.find((zone) => zone.id === id)?.name ?? `Zone #${id}`;

const isComparisonPeriod = (value: string | null): value is ComparisonPeriod =>
  value != null && Object.hasOwn(PERIOD_DAYS, value);

export const ZoneComparison = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages', 'components']);
  const [search, setSearch] = useSearchParams();
  const requestedZoneA = search.get('zoneA');
  const requestedZoneB = search.get('zoneB');
  const zoneA =
    requestedZoneA && validZoneIds.has(requestedZoneA)
      ? requestedZoneA
      : DEFAULT_ZONE_A;
  const zoneB =
    requestedZoneB && validZoneIds.has(requestedZoneB)
      ? requestedZoneB
      : DEFAULT_ZONE_B;
  const requestedPeriod = search.get('period');
  const period: ComparisonPeriod = isComparisonPeriod(requestedPeriod)
    ? requestedPeriod
    : 'last7d';

  const variables = useMemo<ZoneActivityComparisonVariables>(() => {
    const to = new Date();
    const from = subDays(to, PERIOD_DAYS[period]);
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      zoneA,
      zoneB,
    };
  }, [period, zoneA, zoneB]);

  const { loading, error, data } = useQuery<
    ZoneActivityComparisonData,
    ZoneActivityComparisonVariables
  >(ZONE_ACTIVITY_COMPARISON, {
    variables,
    skip: zoneA === zoneB,
  });

  const updateSearch = (key: 'zoneA' | 'zoneB' | 'period', value: string) => {
    const next = new URLSearchParams(search);
    next.set(key, value);
    setSearch(next);
  };

  const nameA = getZoneName(zoneA);
  const nameB = getZoneName(zoneB);
  const countA = data?.zoneA.totalCount ?? 0;
  const countB = data?.zoneB.totalCount ?? 0;
  const maxCount = Math.max(countA, countB, 1);

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/kills">{t('pages:killsPage.title')}</Link>
          </li>
          <li className="is-active">
            <span>{t('pages:zoneComparisonPage.title')}</span>
          </li>
        </ul>
      </nav>

      <nav
        className="tabs is-boxed mb-4"
        aria-label={t('pages:killsPage.sections')}
        style={{ overflowX: 'auto' }}
      >
        <ul style={{ minWidth: 'max-content' }}>
          <li>
            <Link to="/kills">{t('pages:killsPage.title')}</Link>
          </li>
          <li>
            <Link to="/activity">{t('pages:activityPage.title')}</Link>
          </li>
          <li className="is-active">
            <Link to="/zone-comparison">
              {t('pages:zoneComparisonPage.title')}
            </Link>
          </li>
        </ul>
      </nav>

      <main>
        <h1 className="title is-4 mb-2">
          {t('pages:zoneComparisonPage.title')}
        </h1>
        <p className="has-text-grey mb-4">
          {t('pages:zoneComparisonPage.description')}
        </p>

        <div className="columns is-multiline mx-0 mb-2">
          <div className="column is-5-desktop is-6-tablet is-12-mobile">
            <label className="label" htmlFor="zone-comparison-a">
              {t('pages:zoneComparisonPage.zoneA')}
            </label>
            <div className="select is-fullwidth">
              <select
                id="zone-comparison-a"
                value={zoneA}
                onChange={(event) => updateSearch('zoneA', event.target.value)}
              >
                {sortedZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} (#{zone.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="column is-5-desktop is-6-tablet is-12-mobile">
            <label className="label" htmlFor="zone-comparison-b">
              {t('pages:zoneComparisonPage.zoneB')}
            </label>
            <div className="select is-fullwidth">
              <select
                id="zone-comparison-b"
                value={zoneB}
                onChange={(event) => updateSearch('zoneB', event.target.value)}
              >
                {sortedZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} (#{zone.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="column is-2-desktop is-12-tablet is-12-mobile">
            <label className="label" htmlFor="zone-comparison-period">
              {t('pages:zoneComparisonPage.period')}
            </label>
            <div className="select is-fullwidth">
              <select
                id="zone-comparison-period"
                value={period}
                onChange={(event) =>
                  updateSearch('period', event.target.value)
                }
              >
                {(Object.keys(PERIOD_DAYS) as ComparisonPeriod[]).map(
                  (option) => (
                    <option key={option} value={option}>
                      {t(`components:killsFilters.${option}`)}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>

        <p className="is-size-7 has-text-grey mb-3">
          {t('pages:zoneComparisonPage.methodology')}
        </p>

        <section
          className="card mb-4"
          aria-label={t('pages:zoneComparisonPage.results')}
        >
          <div className="card-content">
            {zoneA === zoneB ? (
              <p>{t('pages:zoneComparisonPage.chooseDifferentZones')}</p>
            ) : loading ? (
              <progress className="progress" />
            ) : error ? (
              <ErrorMessage name={error.name} message={error.message} />
            ) : (
              <>
                <p className="is-size-7 has-text-grey mb-3">
                  {t('pages:zoneComparisonPage.coverage', {
                    from: utcDateTime.format(new Date(variables.from)),
                    to: utcDateTime.format(new Date(variables.to)),
                  })}
                </p>
                <div className="columns is-multiline mb-1">
                  {[
                    { id: zoneA, name: nameA, count: countA },
                    { id: zoneB, name: nameB, count: countB },
                  ].map((zone) => (
                    <div className="column is-6" key={zone.id}>
                      <div className="box mb-2">
                        <div className="is-flex is-justify-content-space-between is-align-items-center">
                          <strong>{zone.name}</strong>
                          <Link
                            to={`/zone_heatmap/${zone.id}?period=${period}`}
                          >
                            {t('pages:zoneComparisonPage.heatmap')}
                          </Link>
                        </div>
                        <p className="mt-2 mb-1">
                          {t('pages:zoneComparisonPage.sampleCount', {
                            count: numberFormat.format(zone.count),
                          })}
                        </p>
                        <progress
                          className="progress is-info is-small mb-0"
                          value={zone.count}
                          max={maxCount}
                          aria-label={t(
                            'pages:zoneComparisonPage.sampleCount',
                            { count: numberFormat.format(zone.count) },
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};
