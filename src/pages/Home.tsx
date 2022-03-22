import { Columns, Container, Tabs } from 'react-bulma-components';
import { LatestKills } from '../components/LatestKills';
import { WeeklyLeaderboard } from '../components/WeeklyLeaderboard';
import { SearchBox } from '../components/SearchBox';
import { MonthlyLeaderboard } from '../components/MonthlyLeaderboard';
import { MonthlyGuildLeaderboard } from '../components/MonthlyLeaderboard.Guild';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WeeklyLeaderboardGuild } from '../components/WeeklyLeaderboardGuild';
import { Link } from 'react-router-dom';

export const Home = (): JSX.Element => {
  const { t } = useTranslation();
  const [isPlayer, setIsPlayer] = useState(true);
  const switchToPlayers = () => setIsPlayer(true);
  const switchToGuilds = () => setIsPlayer(false);

  return (
    <Container breakpoint={'mobile'} mt={2}>
      <div className="columns is-flex pl-3 pb-3 pt-2">
        <Tabs>
          <li className={isPlayer ? 'is-active' : ''} onClick={switchToPlayers}>
            <Link to="#">{t('pages:home.showPlayerLeaderboard')}</Link>
          </li>
          <li className={!isPlayer ? 'is-active' : ''} onClick={switchToGuilds}>
            <Link to="#">{t('pages:home.showGuildLeaderboard')}</Link>
          </li>
        </Tabs>
      </div>
      <SearchBox isPlayer={isPlayer} />
      <Columns>
        <Columns.Column size={6}>
          {isPlayer && <MonthlyLeaderboard />}
          {!isPlayer && <MonthlyGuildLeaderboard />}
        </Columns.Column>
        <Columns.Column size={6}>
          {isPlayer && <WeeklyLeaderboard />}
          {!isPlayer && <WeeklyLeaderboardGuild />}
        </Columns.Column>
      </Columns>
      <LatestKills />
    </Container>
  );
};
