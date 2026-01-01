import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { Query } from '@/__generated__/graphql';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import clsx from 'clsx';
import { InstanceEncounterRunsFilters } from '@/components/instance_statistics/InstanceEncounterRunsFilters';
import { InstanceEncounterStatistics } from '@/components/instance_statistics/InstanceEncounterStatistics';

const INSTANCE_STATISTICS = gql`
  query InstanceEncounters($id: ID!) {
    instance(id: $id) {
      id
      name
      encounters {
        id
        name
      }
    }
  }
`;

export function InstanceStatistics() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<Query>(INSTANCE_STATISTICS, {
    variables: {
      id,
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading || !data?.instance?.encounters)
    return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const { instance } = data;

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
        <strong>{instance.name}</strong>
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
          {data.instance.encounters.map((instanceEncounter) => (
            <InstanceEncounterStatistics
              key={instanceEncounter?.id}
              name={instanceEncounter?.name ?? ''}
              instanceId={Number(id)}
              encounterId={Number(instanceEncounter?.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
