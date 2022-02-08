import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const SearchBox = ({
  initialQuery,
}: {
  initialQuery?: string;
}): JSX.Element => {
  const { t } = useTranslation('components');
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
            placeholder={t('searchBox.placeholder')}
            defaultValue={initialQuery}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search" />
          </span>
        </p>
      </div>
    </form>
  );
};
