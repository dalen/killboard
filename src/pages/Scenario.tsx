import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { formatDuration, intervalToDuration } from 'date-fns';

import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { formatKillTime, type KillTimeZoneMode } from '@/components/kill/killTime';
import { ScenarioKills } from '@/components/scenario/ScenarioKills';
import { ScenarioScoreboard } from '@/components/scenario/ScenarioScoreboard';
import { ScenarioHeatmap } from '@/components/scenario/ScenarioHeatmap';
import { ScenarioSkirmishes } from '@/components/scenario/ScenarioSkirmishes';
import type { ReactElement } from 'react';
import type { GetScenarioInfoQuery } from '@/__generated__/graphql';
import './Scenario.scss';

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
  2: 'Discordant Skirmish',
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
  const { t } = useTranslation(['common', 'pages', 'components']);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const timeZoneMode: KillTimeZoneMode =
    searchParams.get('timeZone') === 'local' ? 'local' : 'altdorf';

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
  const mostKillsByTeam = ([0, 1] as const).map((team) =>
    Math.max(
      0,
      ...(scenario.scoreboardEntries ?? [])
        .filter((entry) => entry.team === team)
        .map((entry) => Number(entry.kills)),
    ),
  );

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb scenario-breadcrumb" aria-label="breadcrumbs">
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
      <div className="card mb-5">
        <div className="card-content">
          <div className="columns">
            <div className="column is-4">
              <p className="is-size-4">
                <strong>{scenario.scenario.name}</strong>
              </p>
              <p>
                <strong>{t('pages:scenarioPage.date')}: </strong>
                {formatKillTime(startDate, timeZoneMode, 'date')}
              </p>
              <p>
                <strong>{t('pages:scenarioPage.time')}: </strong>
                {formatKillTime(startDate, timeZoneMode, 'time')}{' '}
                <span className="select is-small scenario-time-zone-select">
                  <select
                    aria-label={t('components:killsFilters.timeZone')}
                    value={timeZoneMode}
                    onChange={(event) => {
                      const nextSearchParams = new URLSearchParams(searchParams);
                      if (event.target.value === 'local') {
                        nextSearchParams.set('timeZone', 'local');
                      } else {
                        nextSearchParams.delete('timeZone');
                      }
                      setSearchParams(nextSearchParams, { replace: true });
                    }}
                  >
                    <option value="altdorf">
                      {t('components:killsFilters.altdorfTime')}
                    </option>
                    <option value="local">
                      {t('components:killsFilters.computerTime')}
                    </option>
                  </select>
                </span>
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
                  src="/images/icons/scenario/order.png"
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
              <p className="is-size-7 scenario-most-kills scenario-most-kills--order">
                {t('components:scenarioScoreboard.mostKills')}: <strong>{mostKillsByTeam[0]}</strong>
              </p>
              {scenario.wasSurrender &&
              scenario.points[1] > scenario.points[0] ? (
                <img
                  src="/images/icons/scenario/surrender.png"
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
                  src="/images/icons/scenario/destruction.png"
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
              <p className="is-size-7 scenario-most-kills scenario-most-kills--destruction">
                {t('components:scenarioScoreboard.mostKills')}: <strong>{mostKillsByTeam[1]}</strong>
              </p>
              {scenario.wasSurrender &&
              scenario.points[0] > scenario.points[1] ? (
                <img
                  src="/images/icons/scenario/surrender.png"
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
      <div className="tabs scenario-detail-tabs">
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
