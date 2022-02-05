import { Container } from 'react-bulma-components';
import { LatestKills } from '../components/LatestKills';

export const Home = (): JSX.Element => {
  return (
    <Container max breakpoint={'desktop'} mt={2}>
      <LatestKills />
    </Container>
  );
};
