import { Columns, Container, Tabs } from 'react-bulma-components';
import { LatestKills } from '../components/LatestKills';
import { WeeklyLeaderboard } from '../components/WeeklyLeaderboard';
import { SearchBox } from '../components/SearchBox';
import { MonthlyLeaderboard } from '../components/MonthlyLeaderboard';
import { MonthlyGuildLeaderboard } from '../components/MonthlyLeaderboard.Guild';
import { useTranslation } from 'react-i18next';
import { WeeklyLeaderboardGuild } from '../components/WeeklyLeaderboardGuild';
import { Link } from 'react-router-dom';

export const Home = ({ tab }: { tab: 'players' | 'guilds' }): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container breakpoint={'mobile'} mt={2}>
      <div className="columns is-flex pl-3 pb-3 pt-2">
        <Tabs>
          <li className={tab === 'players' ? 'is-active' : ''}>
            <Link to="/">{t('pages:home.showPlayerLeaderboard')}</Link>
          </li>
          <li className={tab === 'guilds' ? 'is-active' : ''}>
            <Link to="/guilds">{t('pages:home.showGuildLeaderboard')}</Link>
          </li>
        </Tabs>
      </div>
      <SearchBox isPlayer={tab === 'players'} />
      <Columns>
        <Columns.Column size={6}>
          {tab === 'players' && <MonthlyLeaderboard />}
          {tab === 'guilds' && <MonthlyGuildLeaderboard />}
        </Columns.Column>
        <Columns.Column size={6}>
          {tab === 'players' && <WeeklyLeaderboard />}
          {tab === 'guilds' && <WeeklyLeaderboardGuild />}
        </Columns.Column>
      </Columns>
      <LatestKills />
    </Container>
  );
};
