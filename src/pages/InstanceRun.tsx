import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  intervalToDuration,
  formatDuration,
  formatISO,
  format,
} from 'date-fns';
import { Link, useParams } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { Archetype } from '@/__generated__/graphql';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import {
  INSTANCE_RUN_SCOREBOARD_FRAGMENT,
  InstanceRunScoreboard,
} from '@/components/instance_run/InstanceRunScoreboard';
import clsx from 'clsx';
import { InstanceRunQuery } from '@/__generated__/graphql';

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
          itemRating
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

export function InstanceRun() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<InstanceRunQuery>(INSTANCE_RUN, {
    variables: {
      id,
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading || !data?.instanceRun?.encounters)
    return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const { instanceRun } = data;

  const instanceStartDate = new Date(instanceRun.start);
  const instanceEndDate = new Date(instanceRun.end);
  const instanceDurationObject = intervalToDuration({
    start: instanceStartDate,
    end: instanceEndDate,
  });

  const instanceDuration = formatDuration(instanceDurationObject);
  const instanceItemRatings = instanceRun.scoreboardEntries.map(
    (e) => e.itemRating,
  );
  const instanceItemRatingMin = Math.min(...instanceItemRatings);
  const instanceItemRatingMax = Math.max(...instanceItemRatings);
  const instanceItemRatingAverage =
    instanceItemRatings.reduce((a, b) => a + b) / instanceItemRatings.length;
  const instanceNumTanks = instanceRun.scoreboardEntries.filter(
    (e) => e.archetype === Archetype.Tank,
  ).length;
  const instanceNumHealers = instanceRun.scoreboardEntries.filter(
    (e) => e.archetype === Archetype.Healer,
  ).length;
  const instanceNumDPS = instanceRun.scoreboardEntries.filter((e) =>
    [Archetype.MeleeDps, Archetype.RangedDps].includes(e.archetype),
  ).length;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/instance-runs/">{t('common:instanceRuns')}</Link>
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
                <strong>{t('pages:instanceRun.itemRatingMin')}</strong>{' '}
                {instanceItemRatingMin}
              </p>
              <p>
                <strong>{t('pages:instanceRun.itemRatingAverage')}</strong>{' '}
                {instanceItemRatingAverage.toFixed(0)}
              </p>
              <p>
                <strong>{t('pages:instanceRun.itemRatingMax')}</strong>{' '}
                {instanceItemRatingMax}
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
            <th align="center">
              <span className="icon">
                <img
                  src="/images/icons/deaths.png"
                  width={36}
                  height={32}
                  alt={t('pages:instanceRun.deaths') ?? ''}
                  title={t('pages:instanceRun.deaths') ?? ''}
                />
              </span>
            </th>
            <th>{t('pages:instanceRun.itemRatingMin')}</th>
            <th>{t('pages:instanceRun.itemRatingAverage')}</th>
            <th>{t('pages:instanceRun.itemRatingMax')}</th>
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
          {data.instanceRun.encounters.map((instanceEncounterRun) => {
            const startDate = new Date(instanceEncounterRun.start);
            const endDate = new Date(instanceEncounterRun.end);
            const durationObject = intervalToDuration({
              start: startDate,
              end: endDate,
            });

            const duration = formatDuration(durationObject);
            const itemRatings = instanceEncounterRun.scoreboardEntries.map(
              (e) => e.itemRating,
            );
            const itemRatingMin = Math.min(...itemRatings);
            const itemRatingMax = Math.max(...itemRatings);
            const itemRatingAverage =
              itemRatings.reduce((a, b) => a + b) / itemRatings.length;
            const numTanks = instanceEncounterRun.scoreboardEntries.filter(
              (e) => e.archetype === Archetype.Tank,
            ).length;
            const numHealers = instanceEncounterRun.scoreboardEntries.filter(
              (e) => e.archetype === Archetype.Healer,
            ).length;
            const numDPS = instanceEncounterRun.scoreboardEntries.filter((e) =>
              [Archetype.MeleeDps, Archetype.RangedDps].includes(e.archetype),
            ).length;

            return (
              <tr key={instanceEncounterRun.id}>
                <td>
                  <small>
                    {formatISO(startDate, { representation: 'date' })}
                    <br />
                    {format(startDate, 'HH:mm')}
                  </small>
                </td>
                <td>
                  {' '}
                  {instanceEncounterRun.completed ? (
                    <span className="icon-text">
                      <span className="icon">
                        <i className="fas fa-star mr-2 has-text-warning" />
                      </span>
                      {instanceEncounterRun.encounter?.name}
                    </span>
                  ) : (
                    <span className="icon-text">
                      <span className="icon">
                        <i className="fa-solid fa-circle-exclamation  mr-2 has-text-danger" />
                      </span>
                      {instanceEncounterRun.encounter?.name}
                    </span>
                  )}
                </td>
                <td>
                  <small>{duration}</small>
                </td>
                <td align="center">
                  {instanceEncounterRun.scoreboardEntries
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
                    to={`/instance-run/${id}/${instanceEncounterRun.id}`}
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

      <InstanceRunScoreboard entries={data.instanceRun.scoreboardEntries} />
    </div>
  );
}
