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
  const inputRef = useRef<HTMLInputElement>(null);
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

  // navigateOnSubmit boxes (Home's player/guild tabs, plus the dedicated
  // Search/SearchGuild pages) can go from one page to a completely
  // different one mid-search: committing a debounced keystroke navigates
  // from e.g. /guilds to /search/guild/:query, which swaps in a whole new
  // route element and mounts a brand-new input. The old input's focus
  // goes with it, so without this the user has to click back into the
  // box to keep typing. Runs once per mount, which lines up with exactly
  // that one moment - staying on the same search results page for
  // further keystrokes only updates the URL param, it doesn't remount.
  useEffect(() => {
    if (!navigateOnSubmit) {
      return;
    }
    const input = inputRef.current;
    if (!input) {
      return;
    }
    input.focus();
    const end = input.value.length;
    input.setSelectionRange(end, end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            ref={inputRef}
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
