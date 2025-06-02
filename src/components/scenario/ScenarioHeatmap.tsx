import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ZoneHeatmap } from '@/components/ZoneHeatmap';
import { ReactElement } from 'react';

const SCENARIO_HEATMAP = gql`
  query GetScenarioHeatmap($id: ID) {
    killsHeatmap(instanceId: $id) {
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
}): ReactElement {
  const { loading, error, data } = useQuery<Query>(SCENARIO_HEATMAP, {
    variables: {
      id,
    },
  });

  const { t } = useTranslation(['common', 'components']);

  const size = 500;

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
    <div>
      <p className="mb-2">{t('components:scenarioHeatmap.description')}</p>
      <ZoneHeatmap zoneId={zoneId} max={max} data={heatmapData} size={size} />
    </div>
  );
}
