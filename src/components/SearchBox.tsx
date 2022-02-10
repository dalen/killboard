import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const SearchBox = ({
  initialQuery,
  onSubmit,
}: {
  initialQuery?: string;
  onSubmit?: (query: string) => void;
}): JSX.Element => {
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery ?? '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/search/${query}`);
        onSubmit && onSubmit(query);
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
