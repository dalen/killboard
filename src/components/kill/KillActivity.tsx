import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Career, type Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { useSearchParams } from 'react-router';

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

export const KillActivity = (): React.ReactElement => {
  const { t } = useTranslation(['common', 'components']);
  const { width } = useWindowDimensions();
  const [search, setSearch] = useSearchParams();
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
    const to = new Date();
    const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      ...(career ? { career } : {}),
    };
  }, [career]);

  const { loading, error, data } = useQuery<Query>(ACTIVE_CHARACTERS_SERIES, {
    variables,
  });

  if (loading) {
    return (
      <div className="card mb-5">
        <div className="card-content">
          <p className="is-size-5 has-text-weight-semibold mb-2">
            {t('components:killActivity.title')}
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
            {t('components:killActivity.title')}
          </p>
          <ErrorMessage name={error.name} message={error.message} />
        </div>
      </div>
    );
  }

  const points = data?.activeCharactersSeries ?? [];

  if (points.length === 0) {
    return (
      <div className="card mb-5">
        <div className="card-content">
          <p className="is-size-5 has-text-weight-semibold mb-2">
            {t('components:killActivity.title')}
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
  const labelIndexes = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])];

  return (
    <section className="card mb-5" aria-labelledby="kill-activity-title">
      <div className="card-content">
        <h2
          className="is-size-5 has-text-weight-semibold mb-1"
          id="kill-activity-title"
        >
          {t('components:killActivity.title')}
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
        <svg
          className="kill-activity-chart"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          role="img"
          aria-label={t('components:killActivity.chartLabel')}
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
                r="2.5"
                className="kill-activity-point-order"
              >
                <title>
                  {`${format(new Date(point.hour), 'PPpp')} — ${t('components:killActivity.order')}: ${point.order}; ${t('components:killActivity.destruction')}: ${point.destruction}; ${t('components:killActivity.total')}: ${point.total}`}
                </title>
              </circle>
              <circle
                cx={x(index)}
                cy={y(point.destruction)}
                r="2.5"
                className="kill-activity-point-destruction"
              >
                <title>
                  {`${format(new Date(point.hour), 'PPpp')} — ${t('components:killActivity.order')}: ${point.order}; ${t('components:killActivity.destruction')}: ${point.destruction}; ${t('components:killActivity.total')}: ${point.total}`}
                </title>
              </circle>
            </g>
          ))}
          {labelIndexes.map((index) => (
            <text
              key={index}
              x={x(index)}
              y={svgHeight - 5}
              textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
              className="kill-activity-axis-label"
            >
              {format(new Date(points[index].hour), 'MMM d HH:mm')}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
};
