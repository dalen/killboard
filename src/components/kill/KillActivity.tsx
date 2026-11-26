import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import {
  startOfMonth,
  startOfWeek,
  subDays,
  subMinutes,
  subMonths,
  subWeeks,
} from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Career, type Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { useSearchParams } from 'react-router';
import { type KillTimeZoneMode, formatKillTime } from './killTime';

const ACTIVE_CHARACTERS_SERIES = gql`
  query GetActiveCharactersSeries(
    $from: DateTime!
    $to: DateTime!
    $career: Career
  ) {
    activeCharactersSeries(from: $from, to: $to, career: $career) {
      hour
      order
      destruction
      total
    }
  }
`;

type ActivityPoint = Query['activeCharactersSeries'][number];

const getActivityRange = (period: string) => {
  const to = new Date();
  let from = subDays(to, 30);
  let rangeTo = to;

  switch (period) {
    case 'last30m': {
      from = subMinutes(to, 30);
      break;
    }
    case 'last1h': {
      from = subMinutes(to, 60);
      break;
    }
    case 'last2h': {
      from = subMinutes(to, 120);
      break;
    }
    case 'last4h': {
      from = subMinutes(to, 240);
      break;
    }
    case 'last7d': {
      from = subDays(to, 7);
      break;
    }
    case 'last30d': {
      from = subDays(to, 30);
      break;
    }
    case 'thisWeek': {
      from = startOfWeek(to, { weekStartsOn: 1 });
      break;
    }
    case 'lastWeek': {
      from = startOfWeek(subWeeks(to, 1), { weekStartsOn: 1 });
      rangeTo = startOfWeek(to, { weekStartsOn: 1 });
      break;
    }
    case 'thisMonth': {
      from = startOfMonth(to);
      break;
    }
    case 'lastMonth': {
      from = startOfMonth(subMonths(to, 1));
      rangeTo = startOfMonth(to);
      break;
    }
  }

  return { from, to: rangeTo };
};

export const KillActivity = ({
  defaultPeriod = 'all',
}: {
  defaultPeriod?: string;
}): React.ReactElement => {
  const { t } = useTranslation(['common', 'components']);
  const { width } = useWindowDimensions();
  const [search, setSearch] = useSearchParams();
  const period = search.get('period') || defaultPeriod;
  const timeZoneMode: KillTimeZoneMode =
    search.get('timeZone') === 'local' ? 'local' : 'altdorf';
  const chartRef = React.useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = React.useState<{
    index: number;
    left: number;
    top: number;
    above: boolean;
  } | null>(null);
  const isCompact = width <= 480;
  const svgWidth = isCompact ? 360 : 720;
  const svgHeight = isCompact ? 110 : 220;
  const padding = isCompact
    ? { top: 8, right: 8, bottom: 22, left: 28 }
    : { top: 16, right: 12, bottom: 34, left: 42 };
  const careerValue = search.get('activityCareer');
  const career = Object.values(Career).includes(careerValue as Career)
    ? (careerValue as Career)
    : undefined;
  const variables = React.useMemo(() => {
    const { from, to } = getActivityRange(period);

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      ...(career ? { career } : {}),
    };
  }, [career, period]);

  const { loading, error, data } = useQuery<Query>(ACTIVE_CHARACTERS_SERIES, {
    variables,
  });

  const activityPoints = data?.activeCharactersSeries ?? [];
  const rangeMilliseconds =
    Date.parse(variables.to) - Date.parse(variables.from);
  const dailyAverage = rangeMilliseconds > 24 * 60 * 60 * 1000;
  const points: ActivityPoint[] = React.useMemo(() => {
    if (!dailyAverage) {
      return activityPoints;
    }

    const dailyPoints = new Map<string, ActivityPoint[]>();
    for (const point of activityPoints) {
      const day = formatKillTime(new Date(point.hour), timeZoneMode, 'date');
      dailyPoints.set(day, [...(dailyPoints.get(day) ?? []), point]);
    }

    return [...dailyPoints.values()].map((dayPoints) => ({
      hour: dayPoints[0].hour,
      order: Math.round(
        dayPoints.reduce((total, point) => total + point.order, 0) /
          dayPoints.length,
      ),
      destruction: Math.round(
        dayPoints.reduce((total, point) => total + point.destruction, 0) /
          dayPoints.length,
      ),
      total: Math.round(
        dayPoints.reduce((total, point) => total + point.total, 0) /
          dayPoints.length,
      ),
    }));
  }, [activityPoints, dailyAverage, timeZoneMode]);
  const periodLabel =
    period === 'all'
      ? t('components:killActivity.allTimeRange')
      : t(`components:killsFilters.${period}`);
  const activityTitle = t('components:killActivity.title', {
    range: periodLabel,
  });
  const dailyAverageLabel = dailyAverage
    ? t('components:killActivity.dailyAverage')
    : '';
  const valueDescription = dailyAverage ? `${dailyAverageLabel}; ` : '';

  if (loading) {
    return (
      <div className="card mb-5">
        <div className="card-content">
          <p className="is-size-5 has-text-weight-semibold mb-2">
            {activityTitle}
          </p>
          <progress className="progress" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card mb-5">
        <div className="card-content">
          <p className="is-size-5 has-text-weight-semibold mb-2">
            {activityTitle}
          </p>
          <ErrorMessage name={error.name} message={error.message} />
        </div>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="card mb-5">
        <div className="card-content">
          <p className="is-size-5 has-text-weight-semibold mb-2">
            {activityTitle}
          </p>
          <p>{t('common:noResults')}</p>
        </div>
      </div>
    );
  }

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;
  const maxValue = Math.max(
    1,
    ...points.flatMap((point) => [point.order, point.destruction]),
  );
  const x = (index: number): number =>
    padding.left + (index / Math.max(points.length - 1, 1)) * plotWidth;
  const y = (value: number): number =>
    padding.top + plotHeight - (value / maxValue) * plotHeight;
  const orderLine = points
    .map((point, index) => `${x(index)},${y(point.order)}`)
    .join(' ');
  const destructionLine = points
    .map((point, index) => `${x(index)},${y(point.destruction)}`)
    .join(' ');
  const labelIndexes = [
    ...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1]),
  ];
  const showPointTooltip = (index: number, value: number): void => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    const bounds = chart.getBoundingClientRect();
    const pointX = (x(index) / svgWidth) * bounds.width;
    const pointY = (y(value) / svgHeight) * bounds.height;
    const tooltipWidth = Math.min(220, bounds.width - 12);
    const above = pointY >= bounds.height * 0.45;

    setHoveredPoint({
      index,
      left: Math.max(
        6,
        Math.min(pointX - tooltipWidth / 2, bounds.width - tooltipWidth - 6),
      ),
      top: above ? pointY - 10 : pointY + 12,
      above,
    });
  };

  return (
    <section className="card mb-5" aria-labelledby="kill-activity-title">
      <div className="card-content">
        <h2
          className="is-size-5 has-text-weight-semibold mb-1"
          id="kill-activity-title"
        >
          {activityTitle}
        </h2>
        <p className="has-text-grey mb-3">
          {t('components:killActivity.description')}
        </p>
        <div className="field mb-3">
          <label className="label" htmlFor="kill-activity-career">
            {t('components:killActivity.careerFilter')}
          </label>
          <div className="control">
            <div className="select is-fullwidth">
              <select
                id="kill-activity-career"
                value={career ?? 'all'}
                onChange={(event) => {
                  const next = new URLSearchParams(search);
                  if (event.target.value === 'all') {
                    next.delete('activityCareer');
                  } else {
                    next.set('activityCareer', event.target.value);
                  }
                  setSearch(next);
                }}
              >
                <option value="all">
                  {t('components:killActivity.allCareers')}
                </option>
                {Object.values(Career).map((careerOption) => (
                  <option key={careerOption} value={careerOption}>
                    {t(`enums:career.${careerOption}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="kill-activity-legend" aria-hidden="true">
          <span className="kill-activity-legend-order" />
          {t('components:killActivity.order')}
          <span className="kill-activity-legend-destruction" />
          {t('components:killActivity.destruction')}
        </div>
        <div className="kill-activity-chart-wrap">
          <svg
            ref={chartRef}
            className="kill-activity-chart"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            role="img"
            aria-label={t(
              dailyAverage
                ? 'components:killActivity.dailyChartLabel'
                : 'components:killActivity.chartLabel',
            )}
          >
            {[0, 0.5, 1].map((fraction) => {
              const gridY = padding.top + plotHeight * (1 - fraction);
              const value = Math.round(maxValue * fraction);

              return (
                <g key={fraction}>
                  <line
                    x1={padding.left}
                    x2={svgWidth - padding.right}
                    y1={gridY}
                    y2={gridY}
                    className="kill-activity-gridline"
                  />
                  <text
                    x={padding.left - 8}
                    y={gridY + 4}
                    textAnchor="end"
                    className="kill-activity-axis-label"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
            <polyline
              points={orderLine}
              className="kill-activity-line-order"
              fill="none"
            />
            <polyline
              points={destructionLine}
              className="kill-activity-line-destruction"
              fill="none"
            />
            {points.map((point, index) => (
              <g key={point.hour}>
                <circle
                  cx={x(index)}
                  cy={y(point.order)}
                  r="4"
                  className="kill-activity-point-order"
                  tabIndex={0}
                  aria-label={`${formatKillTime(new Date(point.hour), timeZoneMode, dailyAverage ? 'day' : 'full')}; ${valueDescription}${t('components:killActivity.order')}: ${point.order}; ${t('components:killActivity.destruction')}: ${point.destruction}; ${t('components:killActivity.total')}: ${point.total}`}
                  onPointerEnter={() => showPointTooltip(index, point.order)}
                  onFocus={() => showPointTooltip(index, point.order)}
                  onPointerLeave={() => setHoveredPoint(null)}
                  onBlur={() => setHoveredPoint(null)}
                >
                  <title>
                    {`${formatKillTime(new Date(point.hour), timeZoneMode, dailyAverage ? 'day' : 'full')} — ${valueDescription}${t('components:killActivity.order')}: ${point.order}; ${valueDescription}${t('components:killActivity.destruction')}: ${point.destruction}; ${t('components:killActivity.total')}: ${point.total}`}
                  </title>
                </circle>
                <circle
                  cx={x(index)}
                  cy={y(point.destruction)}
                  r="4"
                  className="kill-activity-point-destruction"
                  tabIndex={0}
                  aria-label={`${formatKillTime(new Date(point.hour), timeZoneMode, dailyAverage ? 'day' : 'full')}; ${valueDescription}${t('components:killActivity.order')}: ${point.order}; ${t('components:killActivity.destruction')}: ${point.destruction}; ${t('components:killActivity.total')}: ${point.total}`}
                  onPointerEnter={() =>
                    showPointTooltip(index, point.destruction)
                  }
                  onFocus={() => showPointTooltip(index, point.destruction)}
                  onPointerLeave={() => setHoveredPoint(null)}
                  onBlur={() => setHoveredPoint(null)}
                >
                  <title>
                    {`${formatKillTime(new Date(point.hour), timeZoneMode, dailyAverage ? 'day' : 'full')} — ${valueDescription}${t('components:killActivity.order')}: ${point.order}; ${valueDescription}${t('components:killActivity.destruction')}: ${point.destruction}; ${t('components:killActivity.total')}: ${point.total}`}
                  </title>
                </circle>
              </g>
            ))}
            {labelIndexes.map((index) => {
              let textAnchor: 'start' | 'end' | 'middle' = 'middle';
              if (index === 0) {
                textAnchor = 'start';
              } else if (index === points.length - 1) {
                textAnchor = 'end';
              }

              return (
                <text
                  key={index}
                  x={x(index)}
                  y={svgHeight - 5}
                  textAnchor={textAnchor}
                  className="kill-activity-axis-label"
                >
                  {formatKillTime(
                    new Date(points[index].hour),
                    timeZoneMode,
                    dailyAverage ? 'day' : 'chart',
                  )}
                </text>
              );
            })}
          </svg>
          {hoveredPoint && points[hoveredPoint.index] && (
            <div
              className={`kill-activity-tooltip${hoveredPoint.above ? ' kill-activity-tooltip--above' : ''}`}
              style={{ left: hoveredPoint.left, top: hoveredPoint.top }}
              role="status"
            >
              <strong>
                {formatKillTime(
                  new Date(points[hoveredPoint.index].hour),
                  timeZoneMode,
                  dailyAverage ? 'day' : 'full',
                )}
              </strong>
              {dailyAverage && <em>{dailyAverageLabel}</em>}
              <span>
                <i className="kill-activity-legend-order" />
                {t('components:killActivity.order')}:{' '}
                {points[hoveredPoint.index].order}
              </span>
              <span>
                <i className="kill-activity-legend-destruction" />
                {t('components:killActivity.destruction')}:{' '}
                {points[hoveredPoint.index].destruction}
              </span>
              <span>
                {t('components:killActivity.total')}:{' '}
                {points[hoveredPoint.index].total}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
