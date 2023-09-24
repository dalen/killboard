import { gql, useQuery } from '@apollo/client';
import _ from 'lodash';
import { Progress, Container, Breadcrumb } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { ZoneHeatmap } from '../components/ZoneHeatmap';
import { Query } from '../types';
import { zoneCoordinates } from '../zoneCoordinates';

const ZONE_HEATMAP = gql`
  query GetZoneHeatmap(
    $id: ID
    $minX: UnsignedShort!
    $minY: UnsignedShort!
    $maxX: UnsignedShort!
    $maxY: UnsignedShort!
    $from: Long
  ) {
    killsHeatmap(
      zoneId: $id
      minX: $minX
      minY: $minY
      maxX: $maxX
      maxY: $maxY
      from: $from
    ) {
      x
      y
      count
    }
  }
`;

export function ZoneMap(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const zoneCoord = zoneCoordinates[Number(id)];

  const date =
    Math.round(new Date().setUTCHours(0, 0, 0, 0) / 1000) - 60 * 60 * 24 * 30;

  const { loading, error, data } = useQuery<Query>(ZONE_HEATMAP, {
    variables: {
      id,
      minX: zoneCoord['NW-X'],
      minY: zoneCoord['NW-Y'],
      maxX: zoneCoord['SE-X'],
      maxY: zoneCoord['SE-Y'],
      from: date,
    },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.killsHeatmap == null || data.killsHeatmap.length === 0)
    return <ErrorMessage customText={t('common:notFound')} />;

  const heatmapData = data.killsHeatmap.map(
    (point): [number, number, number] => [
      point.x * 10 + 5,
      point.y * 10 + 5,
      point.count,
    ],
  );

  const max = _.maxBy(heatmapData, (d) => d[2])?.[2] || 1;

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/zone_heatmap/${id}`}>
            {t('pages:mapPage.zoneId', { zoneId: id })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <ZoneHeatmap
        zoneId={Number(id).toString()}
        max={max}
        data={heatmapData}
        size={640}
      />
    </Container>
  );
}
