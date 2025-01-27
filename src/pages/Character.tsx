import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CharacterInfo } from '../components/CharacterInfo';
import { CharacterRecentDeaths } from '../components/CharacterRecentDeaths';
import { CharacterRecentKills } from '../components/CharacterRecentKills';
import { KillsFilters } from '../components/KillsFilters';
import { ScenarioList } from '../components/ScenarioList';
import { ScenarioFilters } from '../components/ScenarioFilters';
import { CharacterArmory } from '../components/CharacterArmory';
import { ScenarioCount } from '../components/ScenarioCount';
import { CharacterLatestSkirmishes } from '../components/CharacterLatestSkirmishes';
import { ReactElement } from 'react';

export function Character({
  tab,
}: {
  tab: 'kills' | 'scenarios' | 'skirmishes' | 'armory';
}): ReactElement {
  const { t } = useTranslation(['common', 'pages']);

  const { id } = useParams();
  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
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
      <CharacterInfo id={Number(id)} />

      <div className="tabs">
        <li className={tab === 'kills' ? 'is-active' : ''}>
          <Link to={`/character/${id}`}>{t('pages:characterPage.kills')}</Link>
        </li>
        <li className={tab === 'scenarios' ? 'is-active' : ''}>
          <Link to={`/character/${id}/scenarios`}>
            {t('pages:characterPage.scenarios')}
          </Link>
        </li>
        <li className={tab === 'skirmishes' ? 'is-active' : ''}>
          <Link to={`/character/${id}/skirmishes`}>
            {t('pages:characterPage.skirmishes')}
          </Link>
        </li>
        <li className={tab === 'armory' ? 'is-active' : ''}>
          <Link to={`/character/${id}/armory`}>
            {t('pages:characterPage.armory')}
          </Link>
        </li>
      </div>

      {tab === 'kills' && (
        <>
          <KillsFilters />
          <div className="columns is-desktop">
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
          <ScenarioList characterId={id} />
        </div>
      )}
      {tab === 'skirmishes' && <CharacterLatestSkirmishes characterId={id} />}
      {tab === 'armory' && <CharacterArmory id={Number(id)} />}
    </div>
  );
}
