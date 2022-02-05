import { Container } from 'react-bulma-components';
import { useParams } from 'react-router-dom';
import { CharacterRecentDeaths } from '../components/CharacterRecentDeaths';
import { CharacterRecentKills } from '../components/CharacterRecentKills';

export const Character = (): JSX.Element => {
  const { id } = useParams();
  return (
    <Container max breakpoint={'desktop'} mt={2}>
      <CharacterRecentKills id={Number(id)} />
      <CharacterRecentDeaths id={Number(id)} />
    </Container>
  );
};
