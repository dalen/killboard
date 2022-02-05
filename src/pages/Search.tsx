import { gql, useQuery } from '@apollo/client';
import {
  Container,
  Progress,
  Table,
  Notification,
} from 'react-bulma-components';
import { Link, useParams } from 'react-router-dom';
import { CareerIcon } from '../components/CareerIcon';
import { Query } from '../types';

const SEARCH_CHARACTERS = gql`
  query SearchCharacters($query: String!) {
    characters(where: { name: { contains: $query } }) {
      nodes {
        id
        name
        career
        renownRank
        level
      }
    }
  }
`;

export const Search = (): JSX.Element => {
  const { query } = useParams();
  const { loading, error, data } = useQuery<Query>(SEARCH_CHARACTERS, {
    variables: { query },
  });

  if (loading) return <Progress />;
  if (error)
    return (
      <Notification color={'danger'}>
        <p>Error :(</p>
        <pre>{error.name}</pre>
        <pre>{error.message}</pre>
      </Notification>
    );

  if (data?.characters?.nodes == null)
    return (
      <Notification color={'danger'}>
        <p>Not found</p>
      </Notification>
    );

  return (
    <Container max breakpoint={'desktop'} mt={2}>
      <Table striped hoverable size="fullwidth">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Level</th>
            <th>RR</th>
          </tr>
        </thead>
        <tbody>
          {data.characters.nodes.map((character) => (
            <tr>
              <td>
                <CareerIcon career={character.career} />
              </td>
              <td>
                <Link to={`/character/${character.id}`}>{character.name}</Link>
              </td>
              <td>{character.level}</td>
              <td>{character.renownRank}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
