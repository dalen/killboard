import { Columns, Container, Tabs } from 'react-bulma-components';
import clsx from 'clsx';
import { LatestKills } from '../components/LatestKills';
import { WeeklyLeaderboard } from '../components/WeeklyLeaderboard';
import { SearchBox } from '../components/SearchBox';
import { MonthlyLeaderboard } from '../components/MonthlyLeaderboard';
import { MonthlyGuildLeaderboard } from '../components/MonthlyLeaderboard.Guild';
import { useTranslation } from 'react-i18next';
import { WeeklyLeaderboardGuild } from '../components/WeeklyLeaderboardGuild';
import { Link } from 'react-router-dom';
import { ScenarioFilters } from '../components/ScenarioFilters';
import { ScenarioList } from '../components/ScenarioList';

export const Home = ({
  tab,
}: {
  tab: 'players' | 'guilds' | 'scenarios';
}): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container breakpoint={'mobile'} mt={2}>
      <Tabs fullwidth>
        <li className={clsx({ 'is-active': tab === 'players' })}>
          <Link to="/">{t('pages:home.showPlayerLeaderboard')}</Link>
        </li>
        <li className={clsx({ 'is-active': tab === 'guilds' })}>
          <Link to="/guilds">{t('pages:home.showGuildLeaderboard')}</Link>
        </li>
        <li className={clsx({ 'is-active': tab === 'scenarios' })}>
          <Link to="/scenarios">{t('pages:home.showScenarios')}</Link>
        </li>
      </Tabs>
      {tab === 'scenarios' && (
        <>
          <ScenarioFilters />
          <ScenarioList perPage={10} />
        </>
      )}
      {tab === 'players' && (
        <>
          <SearchBox isPlayer={true} />
          <Columns>
            <Columns.Column size={6}>
              <MonthlyLeaderboard />
            </Columns.Column>
            <Columns.Column size={6}>
              <WeeklyLeaderboard />
            </Columns.Column>
          </Columns>
          <LatestKills />
        </>
      )}
      {tab === 'guilds' && (
        <>
          <SearchBox isPlayer={false} />
          <Columns>
            <Columns.Column size={6}>
              <MonthlyGuildLeaderboard />
            </Columns.Column>
            <Columns.Column size={6}>
              <WeeklyLeaderboardGuild />
            </Columns.Column>
          </Columns>
          <LatestKills />
        </>
      )}
    </Container>
  );
};
