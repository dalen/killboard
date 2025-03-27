import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CharacterInfo } from '../components/character/CharacterInfo';
import { CharacterRecentDeaths } from '../components/character/CharacterRecentDeaths';
import { CharacterRecentKills } from '../components/character/CharacterRecentKills';
import { KillsFilters } from '../components/kill/KillsFilters';
import { ScenarioList } from '../components/scenario/ScenarioList';
import { ScenarioFilters } from '../components/scenario/ScenarioFilters';
import { CharacterArmory } from '../components/character/CharacterArmory';
import { ScenarioCount } from '../components/scenario/ScenarioCount';
import { CharacterLatestSkirmishes } from '../components/character/CharacterLatestSkirmishes';
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
