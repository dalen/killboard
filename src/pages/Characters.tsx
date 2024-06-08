import { Container, Breadcrumb, Columns } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchBox } from '../components/SearchBox';
import { CharactersList } from '../components/CharactersList';
import { MonthlyLeaderboard } from '../components/MonthlyLeaderboard';
import { WeeklyLeaderboard } from '../components/WeeklyLeaderboard';

export function Characters(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();

  return (
    <Container max breakpoint="desktop" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/characters">{t('common:characters')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <SearchBox
        initialQuery={search.get('query') || ''}
        onSubmit={(event) => {
          search.set('query', event);
          setSearch(search);
        }}
        isPlayer
      />
      {search.get('query') ? (
        <CharactersList />
      ) : (
        <Columns>
          <Columns.Column size={6}>
            <MonthlyLeaderboard />
          </Columns.Column>
          <Columns.Column size={6}>
            <WeeklyLeaderboard />
          </Columns.Column>
        </Columns>
      )}
    </Container>
  );
}
