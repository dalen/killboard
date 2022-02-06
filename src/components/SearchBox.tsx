import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchBox = ({
  initialQuery,
}: {
  initialQuery?: string;
}): JSX.Element => {
  const [query, setQuery] = useState(initialQuery ?? '');
  const navigate = useNavigate();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/search/${query}`);
      }}
    >
      <div className="field">
        <p className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="search"
            placeholder="Search"
            defaultValue={initialQuery}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search"></i>
          </span>
        </p>
      </div>
    </form>
  );
};
