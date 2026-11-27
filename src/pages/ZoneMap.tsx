import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ZoneHeatmap } from '@/components/ZoneHeatmap';
import type { ReactElement } from 'react';
import type { GetZoneHeatmapQuery } from '@/__generated__/graphql';
import './ZoneMap.scss';

const ZONE_HEATMAP = gql`
  query GetZoneHeatmap($id: ID, $from: Long) {
    killsHeatmap(zoneId: $id, from: $from) {
      x
      y
      count
    }
  }
`;

const PERIOD_OPTIONS = ['last24h', 'last7d', 'last30d'] as const;
type HeatmapPeriod = (typeof PERIOD_OPTIONS)[number];

const getPeriodStart = (period: HeatmapPeriod): number => {
  const rangeSeconds = {
    last24h: 24 * 60 * 60,
    last7d: 7 * 24 * 60 * 60,
    last30d: 30 * 24 * 60 * 60,
  }[period];
  return Math.floor(Date.now() / 1000) - rangeSeconds;
};

export const ZoneMap = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const [search, setSearch] = useSearchParams();
  const selectedPeriod = search.get('period');
  const period: HeatmapPeriod = PERIOD_OPTIONS.includes(
    selectedPeriod as HeatmapPeriod,
  )
    ? (selectedPeriod as HeatmapPeriod)
    : 'last30d';

  const size = 500;
  const from = useMemo(() => getPeriodStart(period), [period]);

  const { loading, error, data } = useQuery<GetZoneHeatmapQuery>(ZONE_HEATMAP, {
    variables: {
      from,
      id,
    },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.killsHeatmap == null || data.killsHeatmap.length === 0) {
    return <ErrorMessage customText={t('pages:mapPage.noResults')} />;
  }

  const heatmapData = data.killsHeatmap.map(
    (point): [number, number, number] => [
      point.x * (size / 64) + size / 64 / 2,
      point.y * (size / 64) + size / 64 / 2,
      point.count,
    ],
  );

  const max = _.maxBy(heatmapData, (d) => d[2])?.[2] || 1;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/zone_heatmap/${id}`}>
              {t('pages:mapPage.zoneId', { zoneId: id })}
            </Link>
          </li>
        </ul>
      </nav>
      <section className="card mb-4 zone-heatmap-controls">
        <div className="card-content">
          <div className="zone-heatmap-heading">
            <div>
              <h1 className="title is-4">{t('pages:mapPage.title')}</h1>
              <p className="has-text-grey is-size-7">
                {t('pages:mapPage.description')}
              </p>
            </div>
            <div className="field mb-0">
              <label className="label" htmlFor="zone-heatmap-period">
                {t('pages:mapPage.period')}
              </label>
              <div className="select">
                <select
                  id="zone-heatmap-period"
                  value={period}
                  onChange={(event) => {
                    const next = new URLSearchParams(search);
                    if (event.target.value === 'last30d') {
                      next.delete('period');
                    } else {
                      next.set('period', event.target.value);
                    }
                    setSearch(next);
                  }}
                >
                  {PERIOD_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {t(`components:killsFilters.${option}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      <p className="mb-4">
        <Link to={`/kills?period=${period}&zoneId=${encodeURIComponent(id || '')}`}>
          {t('pages:mapPage.viewZoneKills')}
        </Link>
      </p>
      <ZoneHeatmap
        zoneId={Number(id).toString()}
        max={max}
        data={heatmapData}
        size={size}
      />
    </div>
  );
};
