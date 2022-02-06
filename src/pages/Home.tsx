import { Container } from 'react-bulma-components';
import { LatestKills } from '../components/LatestKills';
import { SearchBox } from '../components/SearchBox';

export const Home = (): JSX.Element => {
  return (
    <Container max breakpoint={'desktop'} mt={2}>
      <SearchBox />
      <LatestKills />
    </Container>
  );
};
