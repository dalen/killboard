import { Container, Breadcrumb, Columns } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchBox } from '../components/SearchBox';
import { GuildsList } from '../components/GuildsList';
import { MonthlyGuildLeaderboard } from '../components/MonthlyLeaderboard.Guild';
import { WeeklyLeaderboardGuild } from '../components/WeeklyLeaderboardGuild';

export function Guilds(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();
  return (
    <Container max breakpoint="desktop" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/guilds">{t('common:guilds')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <SearchBox
        initialQuery={search.get('query') || ''}
        onSubmit={(event) => {
          search.set('query', event);
          setSearch(search);
        }}
      />
      {search.get('query') ? (
        <GuildsList />
      ) : (
        <Columns>
          <Columns.Column size={6}>
            <MonthlyGuildLeaderboard />
          </Columns.Column>
          <Columns.Column size={6}>
            <WeeklyLeaderboardGuild />
          </Columns.Column>
        </Columns>
      )}
    </Container>
  );
}
