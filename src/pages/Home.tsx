import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { LatestKills } from '@/components/kill/LatestKills';
import { WeeklyLeaderboard } from '@/components/kill/WeeklyLeaderboard';
import { SearchBox } from '@/components/global/SearchBox';
import { MonthlyLeaderboard } from '@/components/kill/MonthlyLeaderboard';
import { MonthlyGuildLeaderboard } from '@/components/kill/MonthlyLeaderboard.Guild';
import { WeeklyLeaderboardGuild } from '@/components/kill/WeeklyLeaderboardGuild';
import { ScenarioList } from '@/components/scenario/ScenarioList';
import { LatestSkirmishes } from '@/components/skirmish/LatestSkirmishes';
import { TopSkirmishes } from '@/components/skirmish/TopSkirmishes';
import type { ReactElement } from 'react';

export const Home = ({
  tab,
}: {
  tab: 'players' | 'guilds' | 'scenarios' | 'skirmishes';
}): ReactElement => {
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
        {/* These pages already exist in the site (each has its own route
            and full page layout) but weren't reachable from anywhere in
            the main nav - just linking out to them here, same as the tabs
            above, rather than rendering their content inline in Home. The
            ranked leaderboard page intentionally isn't added here. */}
        <li>
          <Link to="/items">{t('pages:home.showItems')}</Link>
        </li>
        <li>
          <Link to="/quests">{t('pages:home.showQuests')}</Link>
        </li>
        <li>
          <Link to="/creatures">{t('pages:home.showCreatures')}</Link>
        </li>
        <li>
          <Link to="/instances">{t('pages:home.showInstances')}</Link>
        </li>
        <li>
          <Link to="/storylines">{t('pages:home.showStorylines')}</Link>
        </li>
      </div>
      {tab === 'scenarios' && (
        <ScenarioList loadMore perPage={10} />
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
};
