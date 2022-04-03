import { gql, useQuery } from '@apollo/client';
import { Container, Progress } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { ZoneHeatmap } from './ZoneHeatmap';
import { zoneCoordinates } from '../zoneCoordinates';
import _ from 'lodash';
import { HeatmapData } from 'heatmap.js';

const SCENARIO_KILL_POSITIONS = gql`
  query GetScenarioKillPositions(
    $id: String
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    kills(
      instanceId: $id
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      totalCount
      nodes {
        position {
          zoneId
          x
          y
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const ScenarioHeatmap = ({ id }: { id: string }): JSX.Element => {
  const { loading, error, data } = useQuery<Query>(SCENARIO_KILL_POSITIONS, {
    variables: { id, first: 50 },
  });

  const { t } = useTranslation(['common', 'components']);

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.kills?.nodes == null || data?.kills?.nodes.length === 0)
    return <ErrorMessage customText={t('common:notFound')} />;

  const kills = data.kills.nodes;
  const zoneId = kills[0].position.zoneId;

  const squares = 64;
  const zoneCoord = zoneCoordinates[Number(zoneId)];
  // or 1 here to avoid any div by zero errors
  const offsetX = zoneCoord['NW-X'];
  const offsetY = zoneCoord['NW-Y'];
  const zoneWidth = zoneCoord['SE-X'] - zoneCoord['NW-X'] || 1;
  const zoneHeight = zoneCoord['SE-Y'] - zoneCoord['NW-Y'] || 1;

  const killsCoords = kills.map((k) => [
    Math.round(((k.position.x - offsetX) * squares) / zoneWidth),
    Math.round(((k.position.y - offsetY) * squares) / zoneHeight),
  ]);

  console.log(killsCoords);

  console.log(_.countBy(killsCoords));

  const heatmapData = _.map(_.countBy(killsCoords), (k, v) => {
    console.log(k, v);
    return {
      x: Number(v.split(',')[0]) * 10,
      y: Number(v.split(',')[1]) * 10,
      value: k,
    };
  });

  const max = _.maxBy(heatmapData, (d) => d.value)?.value || 0;

  return (
    <Container breakpoint={'desktop'} max>
      <p className="mb-2">{t('components:scenarioHeatmap.description')}</p>
      <ZoneHeatmap
        zoneId={kills[0].position.zoneId}
        data={{ min: 0, max, data: heatmapData }}
        size={squares}
      />
    </Container>
  );
};
