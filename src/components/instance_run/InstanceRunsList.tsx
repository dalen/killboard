import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import {
  format,
  formatDuration,
  formatISO,
  intervalToDuration,
} from 'date-fns';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { Query } from '@/__generated__/graphql';
import { Archetype } from '@/__generated__/graphql';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { SortConfigDirection, useSortableData } from '@/hooks/useSortableData';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getInstanceRunsFilters } from '@/components/instance_run/InstanceRunsFilters';
import { QueryPagination } from '@/components/global/QueryPagination';
import { parseIsoDuration } from '@/utils';
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

// The API's averageDuration aggregate isn't reliable for instances with a lot
// of history - runs that never got a proper `end` written (abandoned/never-
// closed sessions) can drag it into the thousands of days (see comment below
// on averageDurationParsed). Sampling the most recent runs and computing a
// duration average client-side, excluding implausible outliers, gives users
// something honest to look at in the meantime. This should go away once the
// API filters bad rows out of its own aggregate - see the notes for dalen.
// Capped at 50 because that's the API's hard per-request page-size ceiling
// (HC0051) - a bigger "sample" would need to paginate across multiple
// requests, which starts to look like the kind of separate client-side sync
// logic we're trying to avoid.
const DURATION_SAMPLE_SIZE = 50;
const MAX_PLAUSIBLE_DURATION_MS = 7 * 60 * 60 * 1000; // 7 hours

const INSTANCE_RUNS_DURATION_SAMPLE = gql`
  query GetInstanceRunsDurationSample(
    $first: Int
    $where: InstanceRunFilterInput
  ) {
    instanceRuns(first: $first, where: $where, order: { start: DESC }) {
      nodes {
        start
        end
      }
    }
  }
`;

interface InstanceRunRow {
  deaths: number;
  durationMs: number;
  encounters: number;
  end: string;
  id: string;
  instanceName: string;
  numDPS: number;
  numHealers: number;
  numTanks: number;
  start: string;
}

export const InstanceRunsList = () => {
  const perPage = 25;

  const [search] = useSearchParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading, refetch } = useQuery<Query>(INSTANCE_RUNS, {
    variables: {
      first: perPage,
      where: getInstanceRunsFilters(search),
    },
  });
  const { data: durationSampleData } = useQuery<Query>(
    INSTANCE_RUNS_DURATION_SAMPLE,
    {
      variables: {
        first: DURATION_SAMPLE_SIZE,
        where: getInstanceRunsFilters(search),
      },
    },
  );
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  const durationSample = useMemo(() => {
    const nodes = durationSampleData?.instanceRuns?.nodes ?? [];
    const durationsMs = nodes
      .map(
        (node) => new Date(node.end).getTime() - new Date(node.start).getTime(),
      )
      .filter((ms) => Number.isFinite(ms) && ms >= 0);
    const saneDurationsMs = durationsMs.filter(
      (ms) => ms <= MAX_PLAUSIBLE_DURATION_MS,
    );

    if (saneDurationsMs.length === 0) {
      return null;
    }

    return {
      averageMs:
        saneDurationsMs.reduce((a, b) => a + b, 0) / saneDurationsMs.length,
      excluded: durationsMs.length - saneDurationsMs.length,
      sampleSize: durationsMs.length,
    };
  }, [durationSampleData]);

  const rows = useMemo<InstanceRunRow[]>(
    () =>
      (data?.instanceRuns?.nodes ?? []).map((instanceRun) => {
        return {
          deaths: instanceRun.scoreboardEntries
            .map((entry) => entry.deaths)
            .reduce((a, b) => a + b, 0),
          durationMs:
            new Date(instanceRun.end).getTime() -
            new Date(instanceRun.start).getTime(),
          encounters: new Set(
            instanceRun.encounters.map((e) => e.encounterId),
          ).size,
          end: instanceRun.end,
          id: instanceRun.id,
          instanceName: instanceRun.instance.name,
          numDPS: instanceRun.scoreboardEntries.filter((entry) =>
            [Archetype.MeleeDps, Archetype.RangedDps].includes(
              entry.archetype,
            ),
          ).length,
          numHealers: instanceRun.scoreboardEntries.filter(
            (entry) => entry.archetype === Archetype.Healer,
          ).length,
          numTanks: instanceRun.scoreboardEntries.filter(
            (entry) => entry.archetype === Archetype.Tank,
          ).length,
          start: instanceRun.start,
        };
      }),
    [data],
  );

  const {
    items: sortedRows,
    requestSort,
    sortConfig,
  } = useSortableData(rows, {
    direction: SortConfigDirection.descending,
    key: 'start',
  });

  const getSortClass = (key: string): string => {
    if (!sortConfig || sortConfig.key !== key) {
      return '';
    }
    return sortConfig.direction;
  };

  if (data?.instanceRuns?.nodes?.length === 0) {
    return <p>{t('common:noResults')}</p>;
  }

  if (loading || data?.instanceRuns?.nodes == null) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const { pageInfo } = data.instanceRuns;

  // A meaningful chunk of instanceRuns rows never get a proper `end` written
  // (abandoned/never-closed sessions), which can drag the API's averageDuration
  // aggregate into the thousands of days for instances with a lot of history.
  // Prefer a duration computed from a recent sample with implausible outliers
  // (>7h) excluded - it's honest about its scope (see the note rendered below)
  // rather than hiding the problem or showing a nonsensical number. Fall back
  // to the raw API aggregate only when the sample query hasn't returned
  // anything usable yet.
  const averageDurationParsed = parseIsoDuration(
    data.instanceRuns.averageDuration,
  );
  const apiAverageIsPlausible = (averageDurationParsed.days ?? 0) < 1;

  let averageDuration = t('pages:instanceRuns.averageDurationUnavailable');
  if (durationSample != null) {
    averageDuration = formatDuration(
      intervalToDuration({ end: durationSample.averageMs, start: 0 }),
    );
  } else if (apiAverageIsPlausible) {
    averageDuration = formatDuration(averageDurationParsed);
  }

  return (
    <>
      <div className="card mb-5">
        <div className="card-content">
          <p>
            <strong>{`${t('pages:instanceRuns.averageDuration')} `}</strong>
            {averageDuration}
          </p>
          {durationSample != null && durationSample.excluded > 0 && (
            <p className="is-size-7 has-text-grey">
              {t('pages:instanceRuns.averageDurationSampleNote', {
                excluded: durationSample.excluded,
                sampleSize: durationSample.sampleSize,
              })}
            </p>
          )}
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
        <thead className="is-relative">
          <tr>
            <th
              className={clsx(
                'is-clickable',
                'has-text-link',
                getSortClass('start'),
              )}
              onClick={() => requestSort('start')}
            >
              {t('pages:instanceRuns.startTime')}
            </th>
            <th
              className={clsx(
                'is-clickable',
                'has-text-link',
                getSortClass('instanceName'),
              )}
              onClick={() => requestSort('instanceName')}
            >
              {t('pages:instanceRuns.instance')}
            </th>
            <th
              className={clsx(
                'is-clickable',
                'has-text-link',
                getSortClass('durationMs'),
              )}
              onClick={() => requestSort('durationMs')}
            >
              {t('pages:instanceRuns.duration')}
            </th>
            <th
              className={clsx(
                'is-clickable',
                'has-text-link',
                getSortClass('encounters'),
              )}
              onClick={() => requestSort('encounters')}
            >
              {t('pages:instanceRuns.encounters')}
            </th>
            <th
              align="center"
              className={clsx(
                'is-clickable',
                'has-text-link',
                getSortClass('deaths'),
              )}
              onClick={() => requestSort('deaths')}
            >
              {t('pages:instanceRuns.deaths')}
            </th>
            <th
              align="center"
              className={clsx(
                'is-clickable',
                'has-text-link',
                getSortClass('numTanks'),
              )}
              onClick={() => requestSort('numTanks')}
            >
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
            <th
              align="center"
              className={clsx(
                'is-clickable',
                'has-text-link',
                getSortClass('numHealers'),
              )}
              onClick={() => requestSort('numHealers')}
            >
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
            <th
              align="center"
              className={clsx(
                'is-clickable',
                'has-text-link',
                getSortClass('numDPS'),
              )}
              onClick={() => requestSort('numDPS')}
            >
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
          {sortedRows.map((row) => {
            const startDate = new Date(row.start);

            return (
              <tr key={row.id}>
                <td>
                  <small>
                    {formatISO(startDate, { representation: 'date' })}
                    <br />
                    {format(startDate, 'HH:mm')}
                  </small>
                </td>
                <td>{row.instanceName}</td>
                <td>
                  {formatDuration(
                    intervalToDuration({
                      end: new Date(row.end),
                      start: startDate,
                    }),
                  )}
                </td>
                <td>{row.encounters}</td>
                <td align="center">{row.deaths}</td>
                <td align="center">{row.numTanks}</td>
                <td align="center">{row.numHealers}</td>
                <td align="center">{row.numDPS}</td>
                <td>
                  <Link
                    to={`/instance-run/${row.id}`}
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
};
