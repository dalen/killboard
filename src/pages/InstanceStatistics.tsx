import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { useMemo } from 'react';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import type { Query } from '@/__generated__/graphql';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import clsx from 'clsx';
import { InstanceEncounterRunsFilters } from '@/components/instance_statistics/InstanceEncounterRunsFilters';
import { InstanceEncounterStatistics } from '@/components/instance_statistics/InstanceEncounterStatistics';
import type { ReactElement } from 'react';
import { getInstanceGroupByIdOrFallback } from '@/utils/instanceGroups';

const INSTANCE_STATISTICS = gql`
  query InstanceEncounters($ids: [ID!]) {
    instances(where: { id: { in: $ids } }) {
      nodes {
        id
        name
        encounters {
          id
          name
        }
      }
    }
  }
`;

interface EncounterRow {
  encounterId: number;
  instanceId: number;
  name: string;
}

export const InstanceStatistics = (): ReactElement => {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'pages']);
  // A handful of instance IDs are really just one wing of a larger dungeon
  // (see src/utils/instanceGroups.ts) - query every underlying instance ID
  // in the group so this page shows one combined encounter list for the
  // whole dungeon rather than just whichever wing the URL happens to name.
  const group = id ? getInstanceGroupByIdOrFallback(Number(id)) : undefined;
  const { data, error, loading } = useQuery<Query>(INSTANCE_STATISTICS, {
    skip: !group,
    variables: {
      ids: group?.instanceIds ?? [],
    },
  });

  const rows = useMemo<EncounterRow[]>(
    () =>
      (data?.instances?.nodes ?? []).flatMap((instance) =>
        (instance.encounters ?? [])
          .filter(
            (encounter): encounter is { id: string; name: string } =>
              encounter != null,
          )
          .map((encounter) => ({
            encounterId: Number(encounter.id),
            instanceId: Number(instance.id),
            name: encounter.name,
          })),
      ),
    [data],
  );

  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading || !data?.instances) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/instances/">{t('common:instances')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/instance-statistics/${id}`}>
              {t('pages:instanceRun.title', { id })}
            </Link>
          </li>
        </ul>
      </nav>

      <p className="is-size-4">
        <strong>{group?.name}</strong>
      </p>

      <InstanceEncounterRunsFilters />
      <table
        className={clsx(
          'table',
          'is-striped',
          'is-hoverable',
          'is-marginless',
          isMobile ? 'is-narrow' : 'is-fullwidth',
          'mb-5',
        )}
      >
        <thead>
          <tr>
            <th>{t('pages:instanceStatistics.encounter')}</th>
            <th>{t('pages:instanceStatistics.medianDuration')}</th>
            <th>
              <span className="icon mr-1">
                <img
                  src="/images/icons/deaths.png"
                  width={18}
                  height={16}
                  alt={t('pages:instanceStatistics.medianDeaths') ?? ''}
                  title={t('pages:instanceStatistics.medianDeaths') ?? ''}
                />
              </span>
              {t('pages:instanceStatistics.medianDeaths')}
            </th>
            <th>
              <span className="icon mr-1">
                <img
                  src="/images/icons/deaths.png"
                  width={18}
                  height={16}
                  alt={t('pages:instanceStatistics.averageDeaths') ?? ''}
                  title={t('pages:instanceStatistics.averageDeaths') ?? ''}
                />
              </span>
              {t('pages:instanceStatistics.averageDeaths')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <InstanceEncounterStatistics
              key={`${row.instanceId}-${row.encounterId}`}
              name={row.name}
              instanceId={row.instanceId}
              encounterId={row.encounterId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
