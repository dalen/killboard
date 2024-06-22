import { gql, useQuery } from '@apollo/client';
import { Breadcrumb, Container, Progress, Table } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import {
  intervalToDuration,
  formatDuration,
  formatISO,
  format,
} from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { Query } from '../types';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { InstanceRunScoreboard } from '../components/InstanceRunScoreboard';

const INSTANCE_RUN = gql`
  query GetInstanceRun($id: ID!) {
    instanceRun(id: $id) {
      id
      start
      end
      instance {
        id
        name
      }
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
      encounters {
        start
        end
        scoreboardEntries {
          itemRating
          deaths
          character {
            career
          }
          damage
          healing
        }
        encounter {
          name
        }
      }
    }
  }
`;

export function InstanceRun() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<Query>(INSTANCE_RUN, {
    variables: {
      id,
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading || !data?.instanceRun?.encounters) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/instance-run/${id}`}>
            {t('pages:instanceRun.title', { id })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Table
        striped
        hoverable
        size={isMobile ? 'narrow' : 'fullwidth'}
        marginless
      >
        <thead>
          <tr>
            <th>{t('pages:instanceRun.startTime')}</th>
            <th>{t('pages:instanceRun.encounter')}</th>
            <th>{t('pages:instanceRun.duration')}</th>
            <th>{t('pages:instanceRun.deaths')}</th>
            <th>{t('pages:instanceRun.itemRatingMin')}</th>
            <th>{t('pages:instanceRun.itemRatingAverage')}</th>
            <th>{t('pages:instanceRun.itemRatingMax')}</th>
            <th>{t('pages:instanceRun.numTanks')}</th>
            <th>{t('pages:instanceRun.numHealers')}</th>
            <th>{t('pages:instanceRun.numDps')}</th>
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
            // Skip seconds in the duration
            if (
              durationObject.days ||
              durationObject.hours ||
              durationObject.minutes
            ) {
              durationObject.seconds = undefined;
            }
            const duration = formatDuration(durationObject);
            const itemRatings = instanceEncounterRun.scoreboardEntries.map(
              (e) => e.itemRating,
            );
            const itemRatingMin = Math.min(...itemRatings);
            const itemRatingMax = Math.max(...itemRatings);
            const itemRatingAverage =
              itemRatings.reduce((a, b) => a + b) / itemRatings.length;
            const numTanks = instanceEncounterRun.scoreboardEntries.filter(
              (e) =>
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
              instanceEncounterRun.scoreboardEntries.length -
              numTanks -
              numHealers;

            return (
              <tr key={instanceEncounterRun.id}>
                <td>
                  <small>
                    {formatISO(startDate, { representation: 'date' })}
                    <br />
                    {format(startDate, 'HH:mm')}
                  </small>
                </td>
                <td>{instanceEncounterRun.encounter?.name}</td>
                <td>{duration}</td>
                <td>
                  {instanceEncounterRun.scoreboardEntries
                    .map((e) => e.deaths)
                    .reduce((a, b) => a + b, 0)}
                </td>
                <td>{itemRatingMin}</td>
                <td>{itemRatingAverage.toFixed(0)}</td>
                <td>{itemRatingMax}</td>
                <td>{numTanks}</td>
                <td>{numHealers}</td>
                <td>{numDPS}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <InstanceRunScoreboard entries={data.instanceRun.scoreboardEntries} />
    </Container>
  );
}
