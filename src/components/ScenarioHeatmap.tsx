import { gql, useQuery } from '@apollo/client';
import { Container, Progress } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { ZoneHeatmap } from './ZoneHeatmap';
import { zoneCoordinates } from '../zoneCoordinates';

const SCENARIO_HEATMAP = gql`
  query GetScenarioHeatmap(
    $id: ID
    $minX: UnsignedShort!
    $minY: UnsignedShort!
    $maxX: UnsignedShort!
    $maxY: UnsignedShort!
  ) {
    killsHeatmap(
      instanceId: $id
      minX: $minX
      minY: $minY
      maxX: $maxX
      maxY: $maxY
    ) {
      x
      y
      count
    }
  }
`;

export function ScenarioHeatmap({
  zoneId,
  id,
}: {
  zoneId: string;
  id: string;
}): JSX.Element {
  const zoneCoord = zoneCoordinates[Number(zoneId)];

  const { loading, error, data } = useQuery<Query>(SCENARIO_HEATMAP, {
    variables: {
      id,
      minX: zoneCoord['NW-X'],
      minY: zoneCoord['NW-Y'],
      maxX: zoneCoord['SE-X'],
      maxY: zoneCoord['SE-Y'],
    },
  });

  const { t } = useTranslation(['common', 'components']);

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
    <Container breakpoint="desktop" max>
      <p className="mb-2">{t('components:scenarioHeatmap.description')}</p>
      <ZoneHeatmap zoneId={zoneId} max={max} data={heatmapData} size={640} />
    </Container>
  );
}
