import { gql, useQuery } from '@apollo/client';
import {
  format,
  formatISO,
  formatDuration,
  intervalToDuration,
} from 'date-fns';
import {
  Breadcrumb,
  Card,
  Columns,
  Container,
  Progress,
  Tabs,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { ScenarioKills } from '../components/ScenarioKills';
import { Query } from '../types';
import { ScenarioScoreboard } from '../components/ScenarioScoreboard';
import { ScenarioHeatmap } from '../components/ScenarioHeatmap';

const SCENARIO_INFO = gql`
  query GetScenarioInfo($id: ID) {
    scenario(id: $id) {
      instanceId
      scenario {
        id
        name
        zone {
          id
        }
      }
      startTime
      endTime
      winner
      points
      queueType
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
        team
        level
        renownRank
        quitter
        protection
        kills
        deathBlows
        deaths
        damage
        healing
        objectiveScore
        killsSolo
        killDamage
        healingSelf
        healingOthers
        protectionSelf
        protectionOthers
        damageReceived
        resurrectionsDone
        healingReceived
        protectionReceived
      }
    }
  }
`;

const ScenarioQueueTypes: { [key: number]: string } = {
  0: 'Standard',
  1: 'Group Ranked',
  2: 'Discordant Skirmish',
  3: 'Unused',
  4: 'City Siege',
  5: 'Solo Ranked',
  6: 'Group Challenge',
};

export const Scenario = ({
  tab,
}: {
  tab: 'scoreboard' | 'kills' | 'map';
}): JSX.Element => {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<Query>(SCENARIO_INFO, {
    variables: { id: id },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.scenario == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { scenario } = data;
  const startDate = new Date(scenario.startTime * 1000);
  const endDate = new Date(scenario.endTime * 1000);
  const duration = formatDuration(
    intervalToDuration({
      start: startDate,
      end: endDate,
    })
  );

  return (
    <Container max breakpoint={'widescreen'} mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/scenario/${id}`}>
            {t('pages:scenarioPage.scenarioId', { scenarioId: id })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Card mb={5}>
        <Card.Content>
          <Columns>
            <Columns.Column size={4}>
              <p className="is-size-4">
                <strong>{scenario.scenario.name}</strong>
              </p>
              <p>
                <strong>Date: </strong>
                {formatISO(startDate, { representation: 'date' })}
              </p>
              <p>
                <strong>Time: </strong>
                {format(startDate, 'HH:mm:ss')}
              </p>
              <p>
                <strong>Duration: </strong>
                {duration}
              </p>
              <p>
                <strong>Type: </strong>
                {ScenarioQueueTypes[scenario.queueType]}
              </p>
            </Columns.Column>
            <Columns.Column size={2} className="has-text-centered">
              <p>
                <img
                  src="/images/icons/scenario/order.png"
                  width={55}
                  height={55}
                  alt={t('pages:scenarioPage.order') ?? ''}
                />
              </p>
              <p className="is-size-4 scenario-score-order">
                {scenario.points?.[0]}
              </p>
              <p className="scenario-score-order">
                {t('pages:scenarioPage.order')}
              </p>
            </Columns.Column>
            <Columns.Column size={2} className="has-text-centered">
              <p>
                <img
                  src="/images/icons/scenario/destruction.png"
                  width={55}
                  height={55}
                  alt={t('pages:scenarioPage.destruction') ?? ''}
                />
              </p>
              <p className="is-size-4 scenario-score-destruction">
                {scenario.points?.[1]}
              </p>
              <p className="scenario-score-destruction">
                {t('pages:scenarioPage.destruction')}
              </p>
            </Columns.Column>
          </Columns>
        </Card.Content>
      </Card>
      <Tabs>
        <li className={tab === 'scoreboard' ? 'is-active' : ''}>
          <Link to={`/scenario/${id}`}>
            {t('pages:scenarioPage.scoreboard')}
          </Link>
        </li>
        <li className={tab === 'kills' ? 'is-active' : ''}>
          <Link to={`/scenario/${id}/kills`}>
            {t('pages:scenarioPage.kills')}
          </Link>
        </li>
        <li className={tab === 'map' ? 'is-active' : ''}>
          <Link to={`/scenario/${id}/map`}>{t('pages:scenarioPage.map')}</Link>
        </li>
      </Tabs>
      {tab === 'scoreboard' && (
        <ScenarioScoreboard entries={scenario.scoreboardEntries} />
      )}
      {tab === 'kills' && <ScenarioKills id={id || ''} />}
      {tab === 'map' && (
        <ScenarioHeatmap zoneId={scenario.scenario.zone.id} id={id || ''} />
      )}
    </Container>
  );
};
