import { gql, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  Card,
  Container,
  Icon,
  Media,
  Progress,
  Table,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import {
  intervalToDuration,
  formatDuration,
  formatISO,
  format,
} from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { Archetype, Query } from '../types';
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
        archetype
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
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/instance-runs/">{t('common:instanceRuns')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/instance-run/${id}`}>
            {t('pages:instanceRun.title', { id })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <p className="is-size-4">
        <strong>{instanceRun.instance?.name}</strong>
      </p>
      <Card mb={5}>
        <Card.Content>
          <Media>
            <Media.Item>
              <p>
                <strong>{t('pages:instanceRun.startTime')}</strong>{' '}
                {formatISO(instanceStartDate, { representation: 'date' })}
                {format(instanceStartDate, 'HH:mm')}
              </p>
              <p>
                <strong>{t('pages:instanceRun.duration')}</strong>{' '}
                {instanceDuration}
              </p>
            </Media.Item>
            <Media.Item>
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
            </Media.Item>
            <Media.Item>
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
            </Media.Item>
          </Media>
        </Card.Content>
      </Card>

      <Table
        striped
        hoverable
        size={isMobile ? 'narrow' : 'fullwidth'}
        marginless
        mb={5}
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
                    <Icon.Text>
                      <Icon>
                        <i className="fas fa-star mr-2 has-text-warning" />
                      </Icon>
                      {instanceEncounterRun.encounter?.name}
                    </Icon.Text>
                  ) : (
                    <Icon.Text>
                      <Icon>
                        <i className="fa-solid fa-circle-exclamation  mr-2 has-text-danger" />
                      </Icon>
                      {instanceEncounterRun.encounter?.name}
                    </Icon.Text>
                  )}
                </td>
                <td>
                  <small>{duration}</small>
                </td>
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
      </Table>

      <InstanceRunScoreboard entries={data.instanceRun.scoreboardEntries} />
    </Container>
  );
}
