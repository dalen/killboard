import type { FormEvent, ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

const SEARCH_DEBOUNCE_MS = 300;

export const SearchBox = ({
  initialQuery,
  onSubmit,
  isPlayer,
}: {
  initialQuery?: string;
  onSubmit?: (query: string) => void;
  isPlayer?: boolean;
}): ReactElement => {
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(initialQuery ?? '');
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestQuery = useRef(query);
  latestQuery.current = query;

  useEffect(() => {
    const nextQuery = initialQuery ?? '';
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    latestQuery.current = nextQuery;
    setQuery(nextQuery);
  }, [initialQuery]);

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  useEffect(() => {
    const state = location.state;
    if (
      typeof state === 'object' &&
      state !== null &&
      'focusSearch' in state &&
      state.focusSearch === true
    ) {
      input.current?.focus();
    }
  }, [location.key, location.state]);

  const applyQuery = (value: string): void => {
    const normalized = value.trim();
    if (onSubmit) {
      onSubmit(normalized);
      return;
    }
    if (!normalized) {
      return;
    }
    const destination = isPlayer
      ? `/search/${encodeURIComponent(normalized)}`
      : `/search/guild/${encodeURIComponent(normalized)}`;
    void navigate(destination, { state: { focusSearch: true } });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    applyQuery(latestQuery.current);
  };

  return (
    <form onSubmit={handleSubmit} role="search">
      <div className="field mb-4">
        <p className="control has-icons-left has-icons-right">
          <input
            ref={input}
            className="input"
            type="search"
            aria-label={t('searchBox.placeholder') ?? ''}
            placeholder={t('searchBox.placeholder') ?? ''}
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              latestQuery.current = value;
              if (timer.current) {
                clearTimeout(timer.current);
              }
              timer.current = setTimeout(() => {
                timer.current = null;
                applyQuery(value);
              }, SEARCH_DEBOUNCE_MS);
            }}
          />
          <span className="icon is-small is-left" aria-hidden="true">
            <i className="fas fa-search" />
          </span>
        </p>
      </div>
    </form>
  );
};
