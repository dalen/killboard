import { Columns, Container } from 'react-bulma-components';
import { LatestKills } from '../components/LatestKills';
import { WeeklyLeaderboard } from '../components/WeeklyLeaderboard';
import { SearchBox } from '../components/SearchBox';
import { MonthlyLeaderboard } from '../components/MonthlyLeaderboard';

export const Home = (): JSX.Element => {
  return (
    <Container max breakpoint={'desktop'} mt={2}>
      <SearchBox />
      <Columns>
        <Columns.Column size={6}>
          <MonthlyLeaderboard />
        </Columns.Column>
        <Columns.Column size={6}>
          <WeeklyLeaderboard />
        </Columns.Column>
      </Columns>
      <LatestKills />
    </Container>
  );
};
