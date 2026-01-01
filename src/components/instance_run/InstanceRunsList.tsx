import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import {
  intervalToDuration,
  formatDuration,
  formatISO,
  format,
} from 'date-fns';
import { Link, useSearchParams } from 'react-router';
import { Archetype, Query } from '@/__generated__/graphql';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getInstanceRunsFilters } from '@/components/instance_run/InstanceRunsFilters';
import { QueryPagination } from '@/components/global/QueryPagination';
import clsx from 'clsx';

const INSTANCE_RUNS = gql`
  query GetInstanceRuns(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: InstanceRunFilterInput
  ) {
    instanceRuns(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
      order: { start: DESC }
    ) {
      nodes {
        id
        instanceId
        start
        end
        completed
        instance {
          id
          name
        }
        scoreboardEntries {
          itemRating
          deaths
          archetype
          damage
          healing
        }
        encounters {
          encounterId
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
      totalCount
      averageDuration
      averageDeaths
    }
  }
`;

export function InstanceRunsList() {
  const perPage = 25;

  const [search] = useSearchParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading, refetch } = useQuery<Query>(INSTANCE_RUNS, {
    variables: {
      first: perPage,
      where: getInstanceRunsFilters(search),
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading || data?.instanceRuns?.nodes == null)
    return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const { pageInfo } = data.instanceRuns;

  const averageDurationObject = intervalToDuration({
    start: new Date(0),
    end: new Date(Math.round(data.instanceRuns.averageDuration)),
  });

  const averageDuration = formatDuration(averageDurationObject);

  return (
    <>
      <div className="card mb-5">
        <div className="card-content">
          <p>
            <strong>{`${t('pages:instanceRuns.averageDuration')} `}</strong>
            {averageDuration}
          </p>
        </div>
      </div>
      <table
        className={clsx(
          'table',
          'is-striped',
          'is-hoverable',
          'is-marginless',
          isMobile ? 'is-narrow' : 'is-fullwidth',
        )}
      >
        <thead>
          <tr>
            <th>{t('pages:instanceRuns.startTime')}</th>
            <th>{t('pages:instanceRuns.instance')}</th>
            <th>{t('pages:instanceRuns.duration')}</th>
            <th>{t('pages:instanceRuns.encounters')}</th>
            <th align="center">
              <span className="icon">
                <img
                  src="/images/icons/deaths.png"
                  width={36}
                  height={32}
                  alt={t('pages:instanceRuns.deaths') ?? ''}
                  title={t('pages:instanceRuns.deaths') ?? ''}
                />
              </span>
            </th>{' '}
            <th>{t('pages:instanceRuns.itemRatingMin')}</th>
            <th>{t('pages:instanceRuns.itemRatingAverage')}</th>
            <th>{t('pages:instanceRuns.itemRatingMax')}</th>
            <th align="center">
              <span className="icon">
                <img
                  src="/images/icons/protection.png"
                  width={28}
                  height={33}
                  alt={t('pages:instanceRuns.numTanks') ?? ''}
                  title={t('pages:instanceRuns.numTanks') ?? ''}
                />
              </span>
            </th>
            <th align="center">
              <span className="icon">
                <img
                  src="/images/icons/healing.png"
                  width={28}
                  height={28}
                  alt={t('pages:instanceRuns.numHealers') ?? ''}
                  title={t('pages:instanceRuns.numHealers') ?? ''}
                />
              </span>
            </th>
            <th align="center">
              <span className="icon">
                <img
                  src="/images/icons/damage.png"
                  width={30}
                  height={32}
                  alt={t('pages:instanceRuns.numDps') ?? ''}
                  title={t('pages:instanceRuns.numDps') ?? ''}
                />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.instanceRuns.nodes.map((instanceRun) => {
            const startDate = new Date(instanceRun.start);
            const endDate = new Date(instanceRun.end);
            const durationObject = intervalToDuration({
              start: startDate,
              end: endDate,
            });

            const duration = formatDuration(durationObject);
            const itemRatings = instanceRun.scoreboardEntries.map(
              (e) => e.itemRating,
            );
            const itemRatingMin = Math.min(...itemRatings);
            const itemRatingMax = Math.max(...itemRatings);
            const itemRatingAverage =
              itemRatings.reduce((a, b) => a + b) / itemRatings.length;
            const numTanks = instanceRun.scoreboardEntries.filter(
              (e) => e.archetype === Archetype.Tank,
            ).length;
            const numHealers = instanceRun.scoreboardEntries.filter(
              (e) => e.archetype === Archetype.Healer,
            ).length;
            const numDPS = instanceRun.scoreboardEntries.filter((e) =>
              [Archetype.MeleeDps, Archetype.RangedDps].includes(e.archetype),
            ).length;

            const numEncounters = new Set(
              instanceRun.encounters.map((e) => e.encounterId),
            ).size;

            return (
              <tr key={instanceRun.id}>
                <td>
                  <small>
                    {formatISO(startDate, { representation: 'date' })}
                    <br />
                    {format(startDate, 'HH:mm')}
                  </small>
                </td>
                <td>{instanceRun.instance.name}</td>
                <td>{duration}</td>
                <td>{numEncounters}</td>
                <td align="center">
                  {instanceRun.scoreboardEntries
                    .map((e) => e.deaths)
                    .reduce((a, b) => a + b, 0)}
                </td>
                <td align="center">{itemRatingMin}</td>
                <td align="center">{itemRatingAverage.toFixed(0)}</td>
                <td align="center">{itemRatingMax}</td>
                <td align="center">{numTanks}</td>
                <td align="center">{numHealers}</td>
                <td align="center">{numDPS}</td>
                <td>
                  <Link
                    to={`/instance-run/${instanceRun.id}`}
                    className="button is-primary p-2 is-pulled-right"
                  >
                    {t('common:details')}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </>
  );
}
