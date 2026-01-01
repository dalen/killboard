import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import {
  format,
  formatISO,
  formatDuration,
  intervalToDuration,
} from 'date-fns';

import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ScenarioKills } from '@/components/scenario/ScenarioKills';
import { ScenarioScoreboard } from '@/components/scenario/ScenarioScoreboard';
import { ScenarioHeatmap } from '@/components/scenario/ScenarioHeatmap';
import { ScenarioSkirmishes } from '@/components/scenario/ScenarioSkirmishes';
import { ReactElement } from 'react';
import { GetScenarioInfoQuery } from '@/__generated__/graphql';

export const SCENARIO_SCOREBOARD_FRAGMENT = gql`
  fragment ScenarioScoreboardEntry on ScenarioScoreboardEntry {
    character {
      id
      name
      career
    }
    guild {
      id
      name
      realm
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
`;

const SCENARIO_INFO = gql`
  query GetScenarioInfo($id: ID!) {
    scenario(id: $id) {
      id
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
        ...ScenarioScoreboardEntry
      }
    }
  }

  ${SCENARIO_SCOREBOARD_FRAGMENT}
`;

const ScenarioQueueTypes: Record<number, string> = {
  0: 'Standard',
  1: 'Group Ranked',
  2: 'Discordant Skirmish',
  3: 'Unused',
  4: 'City Siege',
  5: 'Solo Ranked',
  6: 'Group Challenge',
};

export function Scenario({
  tab,
}: {
  tab: 'scoreboard' | 'kills' | 'skirmishes' | 'map';
}): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<GetScenarioInfoQuery>(
    SCENARIO_INFO,
    {
      variables: { id },
    },
  );

  if (loading) return <progress className="progress" />;
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
    }),
  );

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/scenario/${id}`}>
              {t('pages:scenarioPage.scenarioId', { scenarioId: id })}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="card mb-5">
        <div className="card-content">
          <div className="columns">
            <div className="column is-4">
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
            </div>
            <div className="column is-2 has-text-centered">
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
            </div>
            <div className="column is-2 has-text-centered">
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
            </div>
          </div>
        </div>
      </div>
      <div className="tabs">
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
        <li className={tab === 'skirmishes' ? 'is-active' : ''}>
          <Link to={`/scenario/${id}/skirmishes`}>
            {t('pages:scenarioPage.skirmishes')}
          </Link>
        </li>
        <li className={tab === 'map' ? 'is-active' : ''}>
          <Link to={`/scenario/${id}/map`}>{t('pages:scenarioPage.map')}</Link>
        </li>
      </div>
      {tab === 'scoreboard' && (
        <ScenarioScoreboard entries={scenario.scoreboardEntries} />
      )}
      {tab === 'kills' && <ScenarioKills id={id || ''} />}
      {tab === 'skirmishes' && <ScenarioSkirmishes id={id || ''} />}
      {tab === 'map' && (
        <ScenarioHeatmap zoneId={scenario.scenario.zone.id} id={id || ''} />
      )}
    </div>
  );
}
