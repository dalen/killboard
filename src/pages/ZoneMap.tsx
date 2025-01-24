import { gql, useQuery } from '@apollo/client';
import _ from 'lodash';
import { Progress, Container, Breadcrumb } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { ZoneHeatmap } from '../components/ZoneHeatmap';
import { Query } from '../types';

const ZONE_HEATMAP = gql`
  query GetZoneHeatmap($id: ID, $from: Long) {
    killsHeatmap(zoneId: $id, from: $from) {
      x
      y
      count
    }
  }
`;

export function ZoneMap(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const size = 500;

  const date =
    Math.round(new Date().setUTCHours(0, 0, 0, 0) / 1000) - 60 * 60 * 24 * 30;

  const { loading, error, data } = useQuery<Query>(ZONE_HEATMAP, {
    variables: {
      id,
      from: date,
    },
  });

  if (loading) return <Progress />;
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
        size={size}
      />
    </Container>
  );
}
