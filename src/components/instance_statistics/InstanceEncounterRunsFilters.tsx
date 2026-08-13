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

export const getInstanceEncounterRunsFilters = (search: URLSearchParams) => ({
  scoreboardEntryCount: { gte: 6 },
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
