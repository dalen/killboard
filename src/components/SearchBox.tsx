import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function SearchBox({
  initialQuery,
  onSubmit,
  isPlayer,
}: {
  initialQuery?: string;
  onSubmit?: (query: string) => void;
  isPlayer?: boolean;
}): JSX.Element {
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery ?? '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(isPlayer ? `/search/${query}` : `/search/guild/${query}`);
        if (onSubmit) {
          onSubmit(query);
        }
      }}
    >
      <div className="field mb-4">
        <p className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="search"
            placeholder={t('searchBox.placeholder') ?? ''}
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
}
