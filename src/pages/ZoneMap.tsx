import { gql, useQuery } from '@apollo/client';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ZoneHeatmap } from '@/components/ZoneHeatmap';
import { ReactElement } from 'react';
import { GetZoneHeatmapQuery } from '@/__generated__/graphql';

const ZONE_HEATMAP = gql`
  query GetZoneHeatmap($id: ID, $from: Long) {
    killsHeatmap(zoneId: $id, from: $from) {
      x
      y
      count
    }
  }
`;

export function ZoneMap(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const size = 500;

  const date =
    Math.round(new Date().setUTCHours(0, 0, 0, 0) / 1000) - 60 * 60 * 24 * 30;

  const { loading, error, data } = useQuery<GetZoneHeatmapQuery>(ZONE_HEATMAP, {
    variables: {
      id,
      from: date,
    },
  });

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.killsHeatmap == null || data.killsHeatmap.length === 0)
    return <ErrorMessage customText={t('common:notFound')} />;

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
      <ZoneHeatmap
        zoneId={Number(id).toString()}
        max={max}
        data={heatmapData}
        size={size}
      />
    </div>
  );
}
