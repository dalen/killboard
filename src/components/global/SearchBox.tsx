import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const DEBOUNCE_MS = 300;

export const SearchBox = ({
  initialQuery,
  onSubmit,
  isPlayer,
  navigateOnSubmit,
}: {
  initialQuery?: string;
  onSubmit?: (query: string) => void;
  isPlayer?: boolean;
  navigateOnSubmit?: boolean;
}): ReactElement => {
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep the field in sync if the caller resets initialQuery from outside
  // (e.g. browser back/forward changing the URL).
  useEffect(() => {
    setQuery(initialQuery ?? '');
  }, [initialQuery]);

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
    };
  }, []);

  const commit = (value: string): void => {
    clearTimeout(debounceRef.current);
    // navigateOnSubmit is only used by the dedicated player/guild search
    // pages, which are keyed off the query in the URL (/search/:query and
    // /search/guild/:query). Every other caller (Creatures, Items, Quests,
    // Instances, ...) just wants the callback -- it must NOT navigate,
    // since that used to unconditionally send users to guild search.
    if (navigateOnSubmit) {
      void navigate(isPlayer ? `/search/${value}` : `/search/guild/${value}`, {
        replace: true,
      });
    }
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        commit(query);
      }}
    >
      <div className="field mb-4">
        <p className="control has-icons-left has-icons-right">
          <input
            className="input"
            type="search"
            placeholder={t('searchBox.placeholder') ?? ''}
            value={query}
            onChange={(e) => {
              const { value } = e.target;
              setQuery(value);
              clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(
                () => commit(value),
                DEBOUNCE_MS,
              );
            }}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search" />
          </span>
        </p>
      </div>
    </form>
  );
};
