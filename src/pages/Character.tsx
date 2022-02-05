import { Breadcrumb, Columns, Container } from 'react-bulma-components';
import { Link, useParams } from 'react-router-dom';
import { CharacterInfo } from '../components/CharacterInfo';
import { CharacterRecentDeaths } from '../components/CharacterRecentDeaths';
import { CharacterRecentKills } from '../components/CharacterRecentKills';

export const Character = (): JSX.Element => {
  const { id } = useParams();
  return (
    <Container max breakpoint={'widescreen'} mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/character/${id}`}>Character #{id}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <CharacterInfo id={Number(id)} />
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