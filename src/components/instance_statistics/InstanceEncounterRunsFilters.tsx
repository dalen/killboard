import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import type { InstanceEncounterRunFilterInput } from '@/__generated__/graphql';
import type { ReactElement } from 'react';

const getCompletedEncountersFilters = (
  search: URLSearchParams,
): InstanceEncounterRunFilterInput => {
  const completed = search.get('completed');

  if (completed === '1') {
    return { completed: { eq: true } };
  }

  return {};
};

// The API's `start` filter is a DateTime field, not a raw timestamp number -
// passing the number 0 (as this used to) makes the whole request 400 with
// "DateTime cannot coerce the given value JSON element of type Number".
// The Unix epoch as an ISO-8601 string keeps the original intent (exclude
// any zero/unset start dates) with a value the API actually accepts.
const EPOCH = '1970-01-01T00:00:00.000Z';

export const getInstanceEncounterRunsFilters = (search: URLSearchParams) => ({
  scoreboardEntryCount: { gte: 6 },
  start: { gt: EPOCH },
  ...getCompletedEncountersFilters(search),
});

export const InstanceEncounterRunsFilters = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();
  const completed =
    search.get('completed') && Number(search.get('completed') ?? 0);

  return (
    <div className="filter-grid">
      <label>
        <span>{t('pages:instanceStatistics.completedOnly')}</span>
        <input
          id="completed"
          type="checkbox"
          checked={completed === 1}
          onChange={(event) => {
            search.set('completed', event.target.checked ? '1' : '0');
            setSearch(search);
          }}
        />
      </label>
    </div>
  );
};
