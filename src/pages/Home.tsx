import { useState } from 'react';
import { Container } from 'react-bulma-components';
import { useNavigate } from 'react-router-dom';
import { LatestKills } from '../components/LatestKills';

export const Home = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  return (
    <Container max breakpoint={'desktop'} mt={2}>
      <form onSubmit={(e) => navigate(`/search/${query}`)}>
        <div className="field">
          <p className="control has-icons-left has-icons-right">
            <input
              className="input"
              type="search"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-search"></i>
            </span>
          </p>
        </div>
      </form>
      <LatestKills />
    </Container>
  );
};
