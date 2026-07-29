import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import {
  format,
  formatDuration,
  formatISO,
  intervalToDuration,
} from 'date-fns';

import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ScenarioKills } from '@/components/scenario/ScenarioKills';
import { ScenarioScoreboard } from '@/components/scenario/ScenarioScoreboard';
import { ScenarioHeatmap } from '@/components/scenario/ScenarioHeatmap';
import { ScenarioSkirmishes } from '@/components/scenario/ScenarioSkirmishes';
import type { ReactElement } from 'react';
import type { GetScenarioInfoQuery } from '@/__generated__/graphql';
import { assetUrl } from '@/utils';

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
      tier
      startTime
      endTime
      winner
      points
      queueType
      wasSurrender
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
  2: 'Random Scenario',
  3: 'Unused',
  4: 'City Siege',
  5: 'Solo Ranked',
  6: 'Group Challenge',
};

export const Scenario = ({
  tab,
}: {
  tab: 'scoreboard' | 'kills' | 'skirmishes' | 'map';
}): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<GetScenarioInfoQuery>(
    SCENARIO_INFO,
    {
      variables: { id },
    },
  );

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.scenario == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { scenario } = data;
  const startDate = new Date(scenario.startTime);
  const endDate = new Date(scenario.endTime);
  const duration = formatDuration(
    intervalToDuration({
      end: endDate,
      start: startDate,
    }),
  );
  const orderEntries = scenario.scoreboardEntries.filter(
    (entry) => entry.team === 0,
  );
  const destructionEntries = scenario.scoreboardEntries.filter(
    (entry) => entry.team === 1,
  );
  const topDamage = scenario.scoreboardEntries.toSorted(
    (left, right) => right.damage - left.damage,
  )[0];
  const topHealing = scenario.scoreboardEntries.toSorted(
    (left, right) => right.healing - left.healing,
  )[0];
  const topProtection = scenario.scoreboardEntries.toSorted(
    (left, right) => right.protection - left.protection,
  )[0];

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/scenarios">{t('common:scenarios')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/scenario/${id}`}>
              {t('pages:scenarioPage.scenarioId', { scenarioId: id })}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="card mb-4 scenario-detail-hero">
        <div className="card-content">
          <div className="columns">
            <div className="column is-4">
              <p className="is-size-4">
                <strong>{scenario.scenario.name}</strong>
              </p>
              <p>
                <strong>{t('pages:scenarioPage.date')}: </strong>
                {formatISO(startDate, { representation: 'date' })}
              </p>
              <p>
                <strong>{t('pages:scenarioPage.time')}: </strong>
                {format(startDate, 'HH:mm:ss')}
              </p>
              <p>
                <strong>{t('pages:scenarioPage.duration')}: </strong>
                {duration}
              </p>
              <p>
                <strong>{t('pages:scenarioPage.type')}: </strong>
                {ScenarioQueueTypes[scenario.queueType]}
              </p>
              <p>
                <strong>{t('pages:scenarioPage.tier')}: </strong>
                {scenario.tier}
              </p>
            </div>
            <div className="column is-2 has-text-centered">
              <p>
                <img
                  src={assetUrl('/images/icons/scenario/order.png')}
                  width={55}
                  height={55}
                  alt={t('pages:scenarioPage.order') ?? ''}
                />
              </p>
              <p
                className="is-size-4 scenario-score-order"
                title={t('pages:scenarioPage.order') ?? ''}
              >
                {scenario.points?.[0]}
              </p>
              {scenario.wasSurrender &&
              scenario.points[1] > scenario.points[0] ? (
                <img
                  src={assetUrl('/images/icons/scenario/surrender.png')}
                  width={40}
                  height={40}
                  title={t('pages:scenarioPage.surrender') ?? ''}
                  alt={t('pages:scenarioPage.surrender') ?? ''}
                />
              ) : (
                <div
                  style={{
                    display: 'inline-block',
                    height: '40px',
                    width: '40px',
                  }}
                />
              )}
            </div>
            <div className="column is-2 has-text-centered">
              <p>
                <img
                  src={assetUrl('/images/icons/scenario/destruction.png')}
                  width={55}
                  height={55}
                  alt={t('pages:scenarioPage.destruction') ?? ''}
                />
              </p>
              <p
                className="is-size-4 scenario-score-destruction"
                title={t('pages:scenarioPage.destruction') ?? ''}
              >
                {scenario.points?.[1]}
              </p>
              {scenario.wasSurrender &&
              scenario.points[0] > scenario.points[1] ? (
                <img
                  src={assetUrl('/images/icons/scenario/surrender.png')}
                  width={40}
                  height={40}
                  title="Surrender"
                  alt="Surrender"
                />
              ) : (
                <div
                  style={{
                    display: 'inline-block',
                    height: '40px',
                    width: '40px',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="scenario-detail-highlights mb-4">
        <div>
          <span>Players</span>
          <strong>
            {orderEntries.length} Order · {destructionEntries.length}{' '}
            Destruction
          </strong>
        </div>
        <div>
          <span>Top damage</span>
          <strong>
            {topDamage?.character.name ?? '—'} ·{' '}
            {Number(topDamage?.damage ?? 0).toLocaleString()}
          </strong>
        </div>
        <div>
          <span>Top healing</span>
          <strong>
            {topHealing?.character.name ?? '—'} ·{' '}
            {Number(topHealing?.healing ?? 0).toLocaleString()}
          </strong>
        </div>
        <div>
          <span>Top protection</span>
          <strong>
            {topProtection?.character.name ?? '—'} ·{' '}
            {Number(topProtection?.protection ?? 0).toLocaleString()}
          </strong>
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
};
