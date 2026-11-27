import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CharacterIdentityHeader } from '@/components/character/CharacterInfo';
import { CharacterRecentDeaths } from '@/components/character/CharacterRecentDeaths';
import { CharacterRecentKills } from '@/components/character/CharacterRecentKills';
import { KillsFilters } from '@/components/kill/KillsFilters';
import { ScenarioList } from '@/components/scenario/ScenarioList';
import { ScenarioFilters } from '@/components/scenario/ScenarioFilters';
import { CharacterArmory } from '@/components/character/CharacterArmory';
import { ScenarioCount } from '@/components/scenario/ScenarioCount';
import { CharacterLatestSkirmishes } from '@/components/character/CharacterLatestSkirmishes';
import type { ReactElement } from 'react';
import './Character.scss';

export const Character = ({
  tab,
}: {
  tab: 'kills' | 'scenarios' | 'skirmishes' | 'armory';
}): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);

  const { id } = useParams();
  return (
    <div className="container is-max-widescreen character-page">
      <nav className="breadcrumb character-breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/character/${id}`}>
              {t('pages:characterPage.characterId', { characterId: id })}
            </Link>
          </li>
        </ul>
      </nav>
      <CharacterIdentityHeader id={Number(id)} />

      <nav className="tabs is-boxed character-tabs" aria-label={t('pages:characterPage.characterNavigation')}>
        <ul>
        <li className={tab === 'kills' ? 'is-active' : ''}>
          <Link to={`/character/${id}`} aria-current={tab === 'kills' ? 'page' : undefined}><span className="warhammer-tab-label">{t('pages:characterPage.kills')}</span></Link>
        </li>
        <li className={tab === 'scenarios' ? 'is-active' : ''}>
          <Link to={`/character/${id}/scenarios`} aria-current={tab === 'scenarios' ? 'page' : undefined}>
            <span className="warhammer-tab-label">
            {t('pages:characterPage.scenarios')}
            </span>
          </Link>
        </li>
        <li className={tab === 'skirmishes' ? 'is-active' : ''}>
          <Link to={`/character/${id}/skirmishes`} aria-current={tab === 'skirmishes' ? 'page' : undefined}>
            <span className="warhammer-tab-label">
            {t('pages:characterPage.skirmishes')}
            </span>
          </Link>
        </li>
        <li className={tab === 'armory' ? 'is-active' : ''}>
          <Link to={`/character/${id}/armory`} aria-current={tab === 'armory' ? 'page' : undefined}>
            <span className="warhammer-tab-label">
            {t('pages:characterPage.armory')}
            </span>
          </Link>
        </li>
        </ul>
      </nav>

      <main className="character-page-content">
      {tab === 'kills' && (
        <>
          <KillsFilters />
          <div className="columns is-desktop character-kill-columns">
            <div className="column">
              <CharacterRecentKills id={Number(id)} />
            </div>
            <div className="column">
              <CharacterRecentDeaths id={Number(id)} />
            </div>
          </div>
        </>
      )}
      {tab === 'scenarios' && (
        <div>
          <ScenarioFilters />
          <div className="columns is-desktop">
            <div className="column">
              <ScenarioCount characterId={id} wins title="Wins" />
            </div>
            <div className="column">
              <ScenarioCount characterId={id} wins={false} title="Losses" />
            </div>
          </div>
          <ScenarioList characterId={id} perPage={25} />
        </div>
      )}
      {tab === 'skirmishes' && <CharacterLatestSkirmishes characterId={id} />}
      {tab === 'armory' && (
        <CharacterArmory id={Number(id)} />
      )}
      </main>
    </div>
  );
};
