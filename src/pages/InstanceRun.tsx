import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import {
  format,
  formatDuration,
  formatISO,
  intervalToDuration,
} from 'date-fns';
import { Link, useParams } from 'react-router';
import { Fragment, useState } from 'react';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { Archetype } from '@/__generated__/graphql';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import {
  INSTANCE_RUN_SCOREBOARD_FRAGMENT,
  InstanceRunScoreboard,
} from '@/components/instance_run/InstanceRunScoreboard';
import clsx from 'clsx';
import type { InstanceRunQuery } from '@/__generated__/graphql';
import type { ReactElement } from 'react';

const INSTANCE_RUN = gql`
  query InstanceRun($id: ID!) {
    instanceRun(id: $id) {
      id
      start
      end
      instance {
        id
        name
      }
      scoreboardEntries {
        ...InstanceRunScoreboardEntry
      }
      encounters {
        id
        start
        end
        completed
        instanceId
        encounterId
        scoreboardEntries {
          archetype
          deaths
          damage
          healing
        }
        encounter {
          name
        }
      }
    }
  }

  ${INSTANCE_RUN_SCOREBOARD_FRAGMENT}
`;

export const InstanceRun = (): ReactElement => {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<InstanceRunQuery>(INSTANCE_RUN, {
    variables: {
      id,
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;
  const [expandedEncounters, setExpandedEncounters] = useState<Set<string>>(
    new Set(),
  );

  if (loading || !data?.instanceRun?.encounters) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const { instanceRun } = data;

  const instanceStartDate = new Date(instanceRun.start);
  const instanceEndDate = new Date(instanceRun.end);
  const instanceDurationObject = intervalToDuration({
    end: instanceEndDate,
    start: instanceStartDate,
  });

  const instanceDuration = formatDuration(instanceDurationObject);
  const instanceNumTanks = instanceRun.scoreboardEntries.filter(
    (e) => e.archetype === Archetype.Tank,
  ).length;
  const instanceNumHealers = instanceRun.scoreboardEntries.filter(
    (e) => e.archetype === Archetype.Healer,
  ).length;
  const instanceNumDPS = instanceRun.scoreboardEntries.filter((e) =>
    [Archetype.MeleeDps, Archetype.RangedDps].includes(e.archetype),
  ).length;

  // A boss that took a few pulls to down shows up as several encounter
  // attempts sharing the same encounterId. Group them: the attempt that
  // finally killed it (or the last attempt, if it never went down) is the
  // visible row, and the earlier wiped pulls on that same boss nest under it
  // as collapsible detail instead of flat-listing every pull as its own row.
  const encounterAttemptsByEncounterId = new Map<
    string,
    typeof instanceRun.encounters
  >();
  for (const attempt of instanceRun.encounters) {
    const attempts =
      encounterAttemptsByEncounterId.get(attempt.encounterId) ?? [];
    attempts.push(attempt);
    encounterAttemptsByEncounterId.set(attempt.encounterId, attempts);
  }
  const encounterGroups = [...encounterAttemptsByEncounterId.values()].map(
    (attempts) => {
      const downedAttempts = attempts.filter((attempt) => attempt.completed);
      const primary =
        downedAttempts.length > 0
          ? downedAttempts.at(-1)!
          : attempts.at(-1)!;
      return {
        primary,
        wiped: attempts.filter((attempt) => attempt.id !== primary.id),
      };
    },
  );

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/instances/">{t('common:instances')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/instance-run/${id}`}>
              {t('pages:instanceRun.title', { id })}
            </Link>
          </li>
        </ul>
      </nav>

      <p className="is-size-4">
        <strong>{instanceRun.instance?.name}</strong>
      </p>
      <div className="card mb-5">
        <div className="card-content">
          <article className="media">
            <div className="media-content">
              <p>
                <strong>{t('pages:instanceRun.startTime')}</strong>{' '}
                {formatISO(instanceStartDate, { representation: 'date' })}{' '}
                {format(instanceStartDate, 'HH:mm')}
              </p>
              <p>
                <strong>{t('pages:instanceRun.duration')}</strong>{' '}
                {instanceDuration}
              </p>
            </div>
            <div className="media-content">
              <p>
                <strong>{t('pages:instanceRun.numTanks')}</strong>{' '}
                {instanceNumTanks}
              </p>
              <p>
                <strong>{t('pages:instanceRun.numHealers')}</strong>{' '}
                {instanceNumHealers}
              </p>
              <p>
                <strong>{t('pages:instanceRun.numDps')}</strong>{' '}
                {instanceNumDPS}
              </p>
            </div>
          </article>
        </div>
      </div>

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
            <th>{t('pages:instanceRun.startTime')}</th>
            <th>{t('pages:instanceRun.encounter')}</th>
            <th>{t('pages:instanceRun.duration')}</th>
            <th align="center">{t('pages:instanceRun.deaths')}</th>
            <th align="center">
              <span className="icon">
                <img
                  src="/images/icons/protection.png"
                  width={28}
                  height={33}
                  alt={t('pages:instanceRun.numTanks') ?? ''}
                  title={t('pages:instanceRun.numTanks') ?? ''}
                />
              </span>
            </th>
            <th align="center">
              <span className="icon">
                <img
                  src="/images/icons/healing.png"
                  width={28}
                  height={28}
                  alt={t('pages:instanceRun.numHealers') ?? ''}
                  title={t('pages:instanceRun.numHealers') ?? ''}
                />
              </span>
            </th>
            <th align="center">
              <span className="icon">
                <img
                  src="/images/icons/damage.png"
                  width={30}
                  height={32}
                  alt={t('pages:instanceRun.numDps') ?? ''}
                  title={t('pages:instanceRun.numDps') ?? ''}
                />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {encounterGroups.map(({ primary, wiped }) => {
            const startDate = new Date(primary.start);
            const endDate = new Date(primary.end);
            const duration = formatDuration(
              intervalToDuration({ end: endDate, start: startDate }),
            );
            const numTanks = primary.scoreboardEntries.filter(
              (e) => e.archetype === Archetype.Tank,
            ).length;
            const numHealers = primary.scoreboardEntries.filter(
              (e) => e.archetype === Archetype.Healer,
            ).length;
            const numDPS = primary.scoreboardEntries.filter((e) =>
              [Archetype.MeleeDps, Archetype.RangedDps].includes(e.archetype),
            ).length;
            const expanded = expandedEncounters.has(primary.id);

            return (
              <Fragment key={primary.id}>
                <tr>
                  <td>
                    <small>
                      {formatISO(startDate, { representation: 'date' })}
                      <br />
                      {format(startDate, 'HH:mm')}
                    </small>
                  </td>
                  <td>
                    {' '}
                    {primary.completed ? (
                      <span className="icon-text">
                        <span className="icon">
                          <i className="fas fa-star mr-2 has-text-warning" />
                        </span>
                        {primary.encounter?.name}
                      </span>
                    ) : (
                      <span className="icon-text">
                        <span className="icon">
                          <i className="fa-solid fa-circle-exclamation  mr-2 has-text-danger" />
                        </span>
                        {primary.encounter?.name}
                      </span>
                    )}
                    {wiped.length > 0 && (
                      <>
                        {' '}
                        <button
                          type="button"
                          className="button is-small is-ghost has-text-grey p-0"
                          onClick={() =>
                            setExpandedEncounters((current) => {
                              const next = new Set(current);
                              if (next.has(primary.id)) {
                                next.delete(primary.id);
                              } else {
                                next.add(primary.id);
                              }
                              return next;
                            })
                          }
                        >
                          {t('pages:instanceRun.wipedAttempts', {
                            count: wiped.length,
                          })}{' '}
                          {expanded ? '▾' : '▸'}
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    <small>{duration}</small>
                  </td>
                  <td align="center">
                    {primary.scoreboardEntries
                      .map((e) => e.deaths)
                      .reduce((a, b) => a + b, 0)}
                  </td>
                  <td align="center">{numTanks}</td>
                  <td align="center">{numHealers}</td>
                  <td align="center">{numDPS}</td>
                  <td>
                    <Link
                      to={`/instance-run/${id}/${primary.id}`}
                      className="button is-primary p-2 is-pulled-right"
                    >
                      {t('common:details')}
                    </Link>
                  </td>
                </tr>
                {expanded &&
                  wiped.map((attempt) => {
                    const attemptStart = new Date(attempt.start);
                    const attemptEnd = new Date(attempt.end);
                    const attemptDuration = formatDuration(
                      intervalToDuration({
                        end: attemptEnd,
                        start: attemptStart,
                      }),
                    );
                    const attemptNumTanks = attempt.scoreboardEntries.filter(
                      (e) => e.archetype === Archetype.Tank,
                    ).length;
                    const attemptNumHealers =
                      attempt.scoreboardEntries.filter(
                        (e) => e.archetype === Archetype.Healer,
                      ).length;
                    const attemptNumDPS = attempt.scoreboardEntries.filter(
                      (e) =>
                        [Archetype.MeleeDps, Archetype.RangedDps].includes(
                          e.archetype,
                        ),
                    ).length;

                    return (
                      <tr key={attempt.id} className="has-text-grey">
                        <td>
                          <small>
                            {'↳ '}
                            {formatISO(attemptStart, {
                              representation: 'date',
                            })}{' '}
                            {format(attemptStart, 'HH:mm')}
                          </small>
                        </td>
                        <td>
                          <span className="icon-text">
                            <span className="icon">
                              <i className="fa-solid fa-circle-exclamation mr-2 has-text-danger" />
                            </span>
                            {attempt.encounter?.name}
                          </span>
                        </td>
                        <td>
                          <small>{attemptDuration}</small>
                        </td>
                        <td align="center">
                          {attempt.scoreboardEntries
                            .map((e) => e.deaths)
                            .reduce((a, b) => a + b, 0)}
                        </td>
                        <td align="center">{attemptNumTanks}</td>
                        <td align="center">{attemptNumHealers}</td>
                        <td align="center">{attemptNumDPS}</td>
                        <td>
                          <Link
                            to={`/instance-run/${id}/${attempt.id}`}
                            className="button is-small p-2 is-pulled-right"
                          >
                            {t('common:details')}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </Fragment>
            );
          })}
        </tbody>
      </table>

      <InstanceRunScoreboard entries={data.instanceRun.scoreboardEntries} />
    </div>
  );
};
