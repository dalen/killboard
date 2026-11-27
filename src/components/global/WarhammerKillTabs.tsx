import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { ReactElement } from 'react';
import './WarhammerProfileStyles.scss';

type KillSection = 'kills' | 'activity' | 'zone-comparison';

const SECTIONS: { id: KillSection; to: string; label: string }[] = [
  { id: 'kills', to: '/kills', label: 'pages:killsPage.title' },
  { id: 'activity', to: '/activity', label: 'pages:activityPage.title' },
  {
    id: 'zone-comparison',
    to: '/zone-comparison',
    label: 'pages:zoneComparisonPage.title',
  },
];

export const WarhammerKillTabs = ({
  active,
}: {
  active: KillSection;
}): ReactElement => {
  const { t } = useTranslation('pages');

  return (
    <nav
      className="tabs is-boxed warhammer-profile-tabs"
      aria-label={t('killsPage.sections')}
    >
      <ul>
        {SECTIONS.map((section) => (
          <li
            className={section.id === active ? 'is-active' : undefined}
            key={section.id}
          >
            <Link
              to={section.to}
              aria-current={section.id === active ? 'page' : undefined}
            >
              <span className="warhammer-tab-label">{t(section.label)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
