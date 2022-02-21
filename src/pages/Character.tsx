import { Breadcrumb, Columns, Container } from 'react-bulma-components';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CharacterInfo } from '../components/CharacterInfo';
import { CharacterRecentDeaths } from '../components/CharacterRecentDeaths';
import { CharacterRecentKills } from '../components/CharacterRecentKills';
import { KillsFilters } from '../components/KillsFilters';

export const Character = (): JSX.Element => {
  const { t } = useTranslation(['common', 'pages']);

  const { id } = useParams();
  return (
    <Container max breakpoint={'widescreen'} mt={2}>
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
      <KillsFilters />
      <Columns breakpoint={'desktop'}>
        <Columns.Column>
          <CharacterRecentKills id={Number(id)} />
        </Columns.Column>
        <Columns.Column>
          <CharacterRecentDeaths id={Number(id)} />
        </Columns.Column>
      </Columns>
    </Container>
  );
};
