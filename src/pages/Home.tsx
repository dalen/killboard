import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { LatestKills } from '../components/kill/LatestKills';
import { WeeklyLeaderboard } from '../components/kill/WeeklyLeaderboard';
import { SearchBox } from '../components/global/SearchBox';
import { MonthlyLeaderboard } from '../components/kill/MonthlyLeaderboard';
import { MonthlyGuildLeaderboard } from '../components/kill/MonthlyLeaderboard.Guild';
import { WeeklyLeaderboardGuild } from '../components/kill/WeeklyLeaderboardGuild';
import { ScenarioFilters } from '../components/scenario/ScenarioFilters';
import { ScenarioList } from '../components/scenario/ScenarioList';
import { LatestSkirmishes } from '../components/skirmish/LatestSkirmishes';
import { TopSkirmishes } from '../components/skirmish/TopSkirmishes';
import { ReactElement } from 'react';

export function Home({
  tab,
}: {
  tab: 'players' | 'guilds' | 'scenarios' | 'skirmishes';
}): ReactElement {
  const { t } = useTranslation();

  return (
    <div className="container is-mobile mt-2">
      <div className="tabs is-fullwidth">
        <li className={clsx({ 'is-active': tab === 'players' })}>
          <Link to="/">{t('pages:home.showPlayerLeaderboard')}</Link>
        </li>
        <li className={clsx({ 'is-active': tab === 'guilds' })}>
          <Link to="/guilds">{t('pages:home.showGuildLeaderboard')}</Link>
        </li>
        <li className={clsx({ 'is-active': tab === 'scenarios' })}>
          <Link to="/scenarios">{t('pages:home.showScenarios')}</Link>
        </li>
        <li className={clsx({ 'is-active': tab === 'skirmishes' })}>
          <Link to="/skirmishes">{t('pages:home.showSkirmishes')}</Link>
        </li>
      </div>
      {tab === 'scenarios' && (
        <>
          <ScenarioFilters />
          <ScenarioList perPage={10} />
        </>
      )}
      {tab === 'players' && (
        <>
          <SearchBox isPlayer />
          <div className="columns">
            <div className="column is-6">
              <MonthlyLeaderboard />
            </div>
            <div className="column is-6">
              <WeeklyLeaderboard />
            </div>
          </div>
          <LatestKills />
        </>
      )}
      {tab === 'guilds' && (
        <>
          <SearchBox isPlayer={false} />
          <div className="columns">
            <div className="column is-6">
              <MonthlyGuildLeaderboard />
            </div>
            <div className="column is-6">
              <WeeklyLeaderboardGuild />
            </div>
          </div>
          <LatestKills />
        </>
      )}
      {tab === 'skirmishes' && (
        <>
          <TopSkirmishes />
          <LatestSkirmishes />
        </>
      )}
    </div>
  );
}
