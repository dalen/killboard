import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { subDays } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { WarhammerKillTabs } from '@/components/global/WarhammerKillTabs';
import {
  WarhammerFilterPanel,
  WarhammerSelect,
} from '@/components/global/WarhammerFormControls';
import './ZoneComparison.scss';
import { creatureLocationOptions } from '@/data/creatureFilterOptions';
import type { ReactElement } from 'react';

const ZONE_ACTIVITY_COMPARISON = gql`
  query GetZoneActivityComparison(
    $from: DateTime!
    $to: DateTime!
    $zoneA: ID!
    $zoneB: ID!
  ) {
    zoneA: kills(
      where: { time: { gte: $from, lt: $to }, zoneId: { eq: $zoneA } }
    ) {
      totalCount
    }
    zoneB: kills(
      where: { time: { gte: $from, lt: $to }, zoneId: { eq: $zoneB } }
    ) {
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
const sortedZones = [...creatureLocationOptions].sort(
  (a, b) => a.name.localeCompare(b.name) || Number(a.id) - Number(b.id),
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

      <WarhammerKillTabs active="zone-comparison" />

      <main>
        <h1 className="title is-5 mb-1">
          {t('pages:zoneComparisonPage.title')}
        </h1>
        <p className="has-text-grey mb-2">
          {t('pages:zoneComparisonPage.description')}
        </p>

        <WarhammerFilterPanel className="zone-comparison-filter-shell">
          <div className="warhammer-filter-grid zone-comparison-filter-grid">
            <WarhammerSelect
              id="zone-comparison-a"
              label={t('pages:zoneComparisonPage.zoneA')}
              value={zoneA}
              options={sortedZones.map((zone) => ({
                value: zone.id,
                label: zone.name,
              }))}
              onChange={(value) => updateSearch('zoneA', value)}
            />
            <WarhammerSelect
              id="zone-comparison-b"
              label={t('pages:zoneComparisonPage.zoneB')}
              value={zoneB}
              options={sortedZones.map((zone) => ({
                value: zone.id,
                label: zone.name,
              }))}
              onChange={(value) => updateSearch('zoneB', value)}
            />
            <WarhammerSelect
              id="zone-comparison-period"
              label={t('pages:zoneComparisonPage.period')}
              value={period}
              options={(Object.keys(PERIOD_DAYS) as ComparisonPeriod[]).map(
                (option) => ({
                  value: option,
                  label: t(`components:killsFilters.${option}`),
                }),
              )}
              onChange={(value) => updateSearch('period', value)}
            />
          </div>
        </WarhammerFilterPanel>

        <p className="is-size-7 has-text-grey mb-3">
          {t('pages:zoneComparisonPage.methodology')}
        </p>

        <section
          className="warhammer-window-panel zone-comparison-results mb-4"
          aria-label={t('pages:zoneComparisonPage.results')}
        >
          <div>
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
                <div className="zone-comparison-cards">
                  {[
                    { id: zoneA, name: nameA, count: countA },
                    { id: zoneB, name: nameB, count: countB },
                  ].map((zone) => (
                    <div className="zone-comparison-card" key={zone.id}>
                      <div className="zone-comparison-card-inner">
                        <div className="is-flex is-justify-content-space-between is-align-items-center">
                          <div className="is-flex is-align-items-center">
                            <img
                              className="zone-comparison-thumb"
                              src={`/images/maps/${zone.id}.webp`}
                              alt=""
                              loading="lazy"
                            />
                            <strong>{zone.name}</strong>
                          </div>
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
                        <div
                          className="zone-comparison-track"
                          role="img"
                          aria-label={t(
                            'pages:zoneComparisonPage.sampleCount',
                            { count: numberFormat.format(zone.count) },
                          )}
                        >
                          <span
                            style={{
                              width: `${(zone.count / maxCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <dl className="zone-comparison-summary">
                  <div>
                    <dt>{t('pages:zoneComparisonPage.combined')}</dt>
                    <dd>{numberFormat.format(countA + countB)}</dd>
                  </div>
                  <div>
                    <dt>{t('pages:zoneComparisonPage.difference')}</dt>
                    <dd>{numberFormat.format(Math.abs(countA - countB))}</dd>
                  </div>
                  <div>
                    <dt>{t('pages:zoneComparisonPage.relativeDifference')}</dt>
                    <dd>
                      {Math.min(countA, countB) === 0
                        ? t('pages:zoneComparisonPage.noBaseline')
                        : `${numberFormat.format(Math.round((Math.abs(countA - countB) / Math.min(countA, countB)) * 100))}%`}
                    </dd>
                  </div>
                </dl>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
