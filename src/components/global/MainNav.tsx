import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';

export const MainNav = (): ReactElement => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const databaseRef = useRef<HTMLDetailsElement>(null);
  const [databaseMenuPos, setDatabaseMenuPos] = useState({ top: 0, left: 0 });

  const isDatabaseActive =
    pathname.startsWith('/creature') ||
    pathname.startsWith('/instance') ||
    pathname.startsWith('/item') ||
    pathname.startsWith('/quest') ||
    pathname.startsWith('/storylines');

  useEffect(() => {
    const details = databaseRef.current;
    if (details == null) return undefined;

    const updatePosition = () => {
      const rect = details.getBoundingClientRect();
      const menuWidthEstimate = 200;
      const maxLeft = window.innerWidth - menuWidthEstimate - 8;
      setDatabaseMenuPos({
        top: rect.bottom,
        left: Math.min(rect.left, Math.max(8, maxLeft)),
      });
    };

    const handleToggle = () => {
      if (details.open) updatePosition();
    };

    const handleOutsideEvent = (event: Event) => {
      if (
        details.open &&
        event.target instanceof Node &&
        !details.contains(event.target)
      ) {
        details.open = false;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && details.open) details.open = false;
    };

    details.addEventListener('toggle', handleToggle);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('click', handleOutsideEvent);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      details.removeEventListener('toggle', handleToggle);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('click', handleOutsideEvent);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="container is-max-widescreen mt-2">
      <div className="tabs is-fullwidth">
        <li className={clsx({ 'is-active': pathname === '/' })}>
          <Link to="/">{t('pages:home.showPlayerLeaderboard')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname === '/guilds' })}>
          <Link to="/guilds">{t('pages:home.showGuildLeaderboard')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname === '/scenarios' })}>
          <Link to="/scenarios">{t('pages:home.showScenarios')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname === '/skirmishes' })}>
          <Link to="/skirmishes">{t('pages:home.showSkirmishes')}</Link>
        </li>
        <li className={clsx({ 'is-active': pathname === '/kills' })}>
          <Link to="/kills">{t('pages:killsPage.title')}</Link>
        </li>
        <li className={clsx('nav-database', { 'is-active': isDatabaseActive })}>
          <details className="nav-database-dropdown" ref={databaseRef}>
            <summary>{t('pages:home.showDatabase')}</summary>
            <div
              className="nav-database-menu"
              style={{ top: databaseMenuPos.top, left: databaseMenuPos.left }}
            >
              <Link to="/creatures">{t('pages:home.showCreatures')}</Link>
              <Link to="/instances">{t('pages:home.showInstances')}</Link>
              <Link to="/instance-runs">{t('pages:instanceRuns.title')}</Link>
              <Link to="/items">{t('pages:home.showItems')}</Link>
              <Link to="/quests">{t('pages:home.showQuests')}</Link>
              <Link to="/storylines">{t('pages:home.showStorylines')}</Link>
            </div>
          </details>
        </li>
      </div>
    </div>
  );
};
