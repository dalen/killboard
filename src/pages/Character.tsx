import { Breadcrumb, Columns, Container, Tabs } from 'react-bulma-components';
import { Link, useParams } from 'react-router-dom';
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

export function Character({
  tab,
}: {
  tab: 'kills' | 'scenarios' | 'skirmishes' | 'armory';
}): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);

  const { id } = useParams();
  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/character/${id}`}>
            {t('pages:characterPage.characterId', { characterId: id })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <CharacterInfo id={Number(id)} />

      <Tabs>
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
      </Tabs>

      {tab === 'kills' && (
        <>
          <KillsFilters />
          <Columns breakpoint="desktop">
            <Columns.Column>
              <CharacterRecentKills id={Number(id)} />
            </Columns.Column>
            <Columns.Column>
              <CharacterRecentDeaths id={Number(id)} />
            </Columns.Column>
          </Columns>
        </>
      )}
      {tab === 'scenarios' && (
        <div>
          <ScenarioFilters />
          <Columns breakpoint="desktop">
            <Columns.Column>
              <ScenarioCount characterId={id} wins title="Wins" />
            </Columns.Column>
            <Columns.Column>
              <ScenarioCount characterId={id} wins={false} title="Losses" />
            </Columns.Column>
          </Columns>
          <ScenarioList characterId={id} />
        </div>
      )}
      {tab === 'skirmishes' && <CharacterLatestSkirmishes characterId={id} />}
      {tab === 'armory' && <CharacterArmory id={Number(id)} />}
    </Container>
  );
}
