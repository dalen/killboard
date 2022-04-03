import { gql, useQuery } from '@apollo/client';
import { format, formatISO, intervalToDuration } from 'date-fns';
import {
  Breadcrumb,
  Card,
  Container,
  Progress,
  Table,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { CareerIcon } from '../components/CareerIcon';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { ScenarioKills } from '../components/ScenarioKills';
import { Scenarios } from '../enums';
import { Query } from '../types';
import { useSortableData } from '../hooks/useSortableData';

const SCENARIO_INFO = gql`
  query GetScenarioInfo($id: ID) {
    scenario(id: $id) {
      instanceId
      scenarioId
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

export const Scenario = (): JSX.Element => {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<Query>(SCENARIO_INFO, {
    variables: { id: id },
  });

  //@todo use sortConfig to display up/down arrow on active thead or get rid of it
  const { items, requestSort, sortConfig } = useSortableData(
    data?.scenario?.scoreboardEntries || []
  );

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.scenario == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { scenario } = data;
  const startDate = new Date(scenario.startTime * 1000);
  const endDate = new Date(scenario.endTime * 1000);
  const duration = intervalToDuration({
    start: startDate,
    end: endDate,
  });

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
          <p className="is-size-4">
            <strong>{Scenarios[scenario.scenarioId]}</strong>
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
            {duration.minutes}:{duration.seconds}
          </p>
        </Card.Content>
      </Card>

      <Table className="is-fullwidth">
        <thead>
          <tr>
            <th
              align="left"
              onClick={() => requestSort('career')}
              className="is-clickable has-text-link"
            >
              {t('pages:scenarioPage.career')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('name')}
              className="is-clickable has-text-link"
            >
              {t('pages:scenarioPage.name')}
            </th>
            <th
              align="right"
              onClick={() => requestSort('level')}
              className="is-clickable has-text-link"
            >
              {t('pages:scenarioPage.rank')}
            </th>
            <th
              align="right"
              onClick={() => requestSort('kills')}
              className="is-clickable has-text-link"
            >
              {t('pages:scenarioPage.kills')}
            </th>
            <th
              align="right"
              onClick={() => requestSort('deaths')}
              className="is-clickable has-text-link"
            >
              {t('pages:scenarioPage.deaths')}
            </th>
            <th
              align="right"
              onClick={() => requestSort('deathBlows')}
              className="is-clickable has-text-link"
            >
              {t('pages:scenarioPage.dbs')}
            </th>
            <th
              align="right"
              onClick={() => requestSort('damage')}
              className="is-clickable has-text-link"
            >
              {t('pages:scenarioPage.damage')}
            </th>
            <th
              align="right"
              onClick={() => requestSort('healing')}
              className="is-clickable has-text-link"
            >
              {t('pages:scenarioPage.healing')}
            </th>
            <th
              align="right"
              onClick={() => requestSort('protection')}
              className="is-clickable has-text-link"
            >
              {t('pages:scenarioPage.protection')}
            </th>
            <th
              align="right"
              onClick={() => requestSort('objectiveScore')}
              className="is-clickable has-text-link"
            >
              {t('pages:scenarioPage.objectiveScore')}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((entry) => (
            <tr className={`scenario-scoreboard-row-team-${entry.team}`}>
              <td>
                <CareerIcon career={entry.character.career} />
              </td>
              <td>
                <Link to={`/character/${entry.character.id}`}>
                  {entry.character.name}
                </Link>
              </td>
              <td align="right">{entry.level}</td>
              <td align="right">{entry.kills}</td>
              <td align="right">{entry.deaths}</td>
              <td align="right">{entry.deathBlows}</td>
              <td align="right">{Number(entry.damage).toLocaleString()}</td>
              <td align="right">{Number(entry.healing).toLocaleString()}</td>
              <td align="right">{Number(entry.protection).toLocaleString()}</td>
              <td align="right">
                {Number(entry.objectiveScore).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ScenarioKills id={id || ''} />
    </Container>
  );
};
