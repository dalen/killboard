import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import type { ReactElement } from 'react';

// Persistent top nav, rendered on every page (see App.tsx). Nav links are
// alphabetical by label. Items, Quests, Creatures, Instances, and
// Storylines each have their own route and full page layout; the
// ranked leaderboard page intentionally isn't added here.
export const MainNav = (): ReactElement => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div className="container is-mobile mt-2">
      <div className="tabs is-fullwidth">
        <li className={clsx({ 'is-active': pathname === '/class-activity' })}>
          <Link to="/class-activity">{t('pages:home.showClassActivity')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname.startsWith('/creature') })}>
          <Link to="/creatures">{t('pages:home.showCreatures')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname === '/guilds' })}>
          <Link to="/guilds">{t('pages:home.showGuildLeaderboard')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname.startsWith('/instance') })}>
          <Link to="/instances">{t('pages:home.showInstances')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname.startsWith('/item') })}>
          <Link to="/items">{t('pages:home.showItems')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname === '/' })}>
          <Link to="/">{t('pages:home.showPlayerLeaderboard')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname.startsWith('/quest') })}>
          <Link to="/quests">{t('pages:home.showQuests')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname === '/scenarios' })}>
          <Link to="/scenarios">{t('pages:home.showScenarios')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname === '/skirmishes' })}>
          <Link to="/skirmishes">{t('pages:home.showSkirmishes')}</Link>
        </li>
        <li
          className={clsx({ 'is-active': pathname.startsWith('/storylines') })}
        >
          <Link to="/storylines">{t('pages:home.showStorylines')}</Link>
        </li>
      </div>
    </div>
  );
};
