import { gql, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  Card,
  Container,
  Media,
  Progress,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import {
  intervalToDuration,
  formatDuration,
  formatISO,
  format,
} from 'date-fns';
import { Link, useParams } from 'react-router';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { Query } from '../types';
import { InstanceRunScoreboard } from '../components/InstanceRunScoreboard';

const INSTANCE_ENCOUNTER_RUN = gql`
  query GetInstanceEncounterRun($id: ID!) {
    instanceEncounterRun(id: $id) {
      id
      start
      end
      scoreboardEntries {
        character {
          id
          name
          career
        }
        guild {
          id
          name
          heraldry {
            emblem
            pattern
            color1
            color2
            shape
          }
        }
        level
        renownRank
        itemRating
        deaths
        damage
        killDamage
        healing
        healingSelf
        healingOthers
        protection
        protectionSelf
        protectionOthers
        damageReceived
        resurrectionsDone
        healingReceived
        protectionReceived
      }
      encounter {
        id
        name
      }
    }
  }
`;

export function InstanceEncounterRun() {
  const { instanceRunId, id } = useParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<Query>(INSTANCE_ENCOUNTER_RUN, {
    variables: {
      id,
    },
  });

  if (loading || !data?.instanceEncounterRun) return <Progress />;
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
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/instance-runs">{t('common:instanceRuns')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/instance-run/${instanceRunId}`}>
            {t('pages:instanceEncounterRun.instanceRunId', {
              id: instanceRunId,
            })}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/instance-run/${instanceRunId}/${id}`}>
            {t('pages:instanceEncounterRun.title', { id })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <p className="is-size-4">
        <strong>{instanceEncounterRun.encounter?.name}</strong>
      </p>
      <Card mb={5}>
        <Card.Content>
          <Media>
            <Media.Item>
              <p>
                <strong>{t('pages:instanceEncounterRun.startTime')}</strong>{' '}
                {formatISO(startDate, { representation: 'date' })}
                {format(startDate, 'HH:mm')}
              </p>
              <p>
                <strong>{t('pages:instanceEncounterRun.duration')}</strong>{' '}
                {duration}
              </p>
            </Media.Item>
            <Media.Item>
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
            </Media.Item>
            <Media.Item>
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
            </Media.Item>
          </Media>
        </Card.Content>
      </Card>

      <InstanceRunScoreboard entries={instanceEncounterRun.scoreboardEntries} />
    </Container>
  );
}
