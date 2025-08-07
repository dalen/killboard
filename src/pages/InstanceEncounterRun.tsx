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
import {
  INSTANCE_ENCOUNTER_RUN_SCOREBOARD_FRAGMENT,
  InstanceRunScoreboard,
} from '@/components/instance_run/InstanceRunScoreboard';
import { GetInstanceEncounterRunQuery } from '@/__generated__/graphql';

const INSTANCE_ENCOUNTER_RUN = gql`
  query GetInstanceEncounterRun($id: ID!) {
    instanceEncounterRun(id: $id) {
      id
      start
      end
      scoreboardEntries {
        ...InstanceEncounterRunScoreboardEntry
      }
      encounter {
        id
        name
      }
    }
  }

  ${INSTANCE_ENCOUNTER_RUN_SCOREBOARD_FRAGMENT}
`;

export function InstanceEncounterRun() {
  const { instanceRunId, id } = useParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<GetInstanceEncounterRunQuery>(
    INSTANCE_ENCOUNTER_RUN,
    {
      variables: {
        id,
      },
    },
  );

  if (loading || !data?.instanceEncounterRun)
    return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const { instanceEncounterRun } = data;

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
  const numTanks = instanceEncounterRun.scoreboardEntries.filter((e) =>
    [
      'IRON_BREAKER',
      'BLACK_ORC',
      'KNIGHT_OF_THE_BLAZING_SUN',
      'CHOSEN',
      'SWORD_MASTER',
      'BLACK_GUARD',
    ].includes(e.character.career),
  ).length;

  const numHealers = instanceEncounterRun.scoreboardEntries.filter(
    (e) =>
      [
        'RUNE_PRIEST',
        'SHAMAN',
        'WARRIOR_PRIEST',
        'ZEALOT',
        'ARCHMAGE',
        'DISCIPLE_OF_KHAINE',
      ].includes(e.character.career) && e.healing > e.damage,
  ).length;

  const numDPS =
    instanceEncounterRun.scoreboardEntries.length - numTanks - numHealers;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/instance-runs">{t('common:instanceRuns')}</Link>
          </li>
          <li>
            <Link to={`/instance-run/${instanceRunId}`}>
              {t('pages:instanceEncounterRun.instanceRunId', {
                id: instanceRunId,
              })}
            </Link>
          </li>
          <li className="is-active">
            <Link to={`/instance-run/${instanceRunId}/${id}`}>
              {t('pages:instanceEncounterRun.title', { id })}
            </Link>
          </li>
        </ul>
      </nav>

      <p className="is-size-4">
        <strong>{instanceEncounterRun.encounter?.name}</strong>
      </p>
      <div className="card mb-5">
        <div className="card-content">
          <article className="media">
            <div className="media-content">
              <p>
                <strong>{t('pages:instanceEncounterRun.startTime')}</strong>{' '}
                {formatISO(startDate, { representation: 'date' })}
                {format(startDate, 'HH:mm')}
              </p>
              <p>
                <strong>{t('pages:instanceEncounterRun.duration')}</strong>{' '}
                {duration}
              </p>
            </div>
            <div className="media-content">
              <p>
                <strong>{t('pages:instanceEncounterRun.itemRatingMin')}</strong>{' '}
                {itemRatingMin}
              </p>
              <p>
                <strong>
                  {t('pages:instanceEncounterRun.itemRatingAverage')}
                </strong>{' '}
                {itemRatingAverage.toFixed(0)}
              </p>
              <p>
                <strong>{t('pages:instanceEncounterRun.itemRatingMax')}</strong>{' '}
                {itemRatingMax}
              </p>
            </div>
            <div className="media-content">
              <p>
                <strong>{t('pages:instanceEncounterRun.numTanks')}</strong>{' '}
                {numTanks}
              </p>
              <p>
                <strong>{t('pages:instanceEncounterRun.numHealers')}</strong>{' '}
                {numHealers}
              </p>
              <p>
                <strong>{t('pages:instanceEncounterRun.numDps')}</strong>{' '}
                {numDPS}
              </p>
            </div>
          </article>
        </div>
      </div>

      <InstanceRunScoreboard entries={instanceEncounterRun.scoreboardEntries} />
    </div>
  );
}
