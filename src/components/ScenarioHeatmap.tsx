import { gql, useQuery } from '@apollo/client';
import { Container, Progress } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { ZoneHeatmap } from './ZoneHeatmap';
import { zoneCoordinates } from '../zoneCoordinates';
import _ from 'lodash';

const SCENARIO_KILL_POSITIONS = gql`
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

export const ScenarioHeatmap = ({
  zoneId,
  id,
}: {
  zoneId: string;
  id: string;
}): JSX.Element => {
  const zoneCoord = zoneCoordinates[Number(zoneId)];

  const { loading, error, data } = useQuery<Query>(SCENARIO_KILL_POSITIONS, {
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

  const heatmapData = data.killsHeatmap.map((point) => ({
    x: point.x * 10 + 5,
    y: point.y * 10 + 5,
    value: point.count,
  }));

  const max = _.maxBy(heatmapData, (d) => d.value)?.value || 1;

  return (
    <Container breakpoint={'desktop'} max>
      <p className="mb-2">{t('components:scenarioHeatmap.description')}</p>
      <ZoneHeatmap
        zoneId={zoneId}
        data={{ min: 0, max, data: heatmapData }}
        size={64}
      />
    </Container>
  );
};
