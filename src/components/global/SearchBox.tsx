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
  // Tracks the last value *this component* pushed out via commit(), so the
  // effect below can tell "the URL changed because we just typed and our
  // own debounced commit landed" apart from "the URL changed for some
  // other reason (browser back/forward, parent reset)". Without that
  // distinction, every commit's resulting initialQuery update would
  // immediately feed back in and could clobber a keystroke (e.g.
  // backspace) typed in the gap before that round trip resolved.
  const lastCommittedRef = useRef(initialQuery ?? '');

  useEffect(() => {
    const next = initialQuery ?? '';
    if (next !== lastCommittedRef.current) {
      lastCommittedRef.current = next;
      setQuery(next);
    }
  }, [initialQuery]);

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
    };
  }, []);

  const commit = (value: string): void => {
    clearTimeout(debounceRef.current);
    lastCommittedRef.current = value;
    // navigateOnSubmit is only used by the dedicated player/guild search
    // pages, which are keyed off the query in the URL (/search/:query and
    // /search/guild/:query). Every other caller (Creatures, Items, Quests,
    // Instances, ...) just wants the callback -- it must NOT navigate,
    // since that used to unconditionally send users to guild search.
    //
    // An empty value gets its own destination instead of navigating to
    // `/search/guild/` (trailing empty segment). There's no route for
    // that exact shape, and bare `/search/guild` actually matches the
    // player route `/search/:query` with query="guild" - landing back on
    // this box showing the literal word "guild" instead of clearing.
    if (navigateOnSubmit) {
      if (value) {
        void navigate(
          isPlayer ? `/search/${value}` : `/search/guild/${value}`,
          { replace: true },
        );
      } else {
        void navigate(isPlayer ? '/' : '/guilds', { replace: true });
      }
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
