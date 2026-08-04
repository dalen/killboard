import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import type { InstanceRunFilterInput } from '@/__generated__/graphql';
import type { ReactElement } from 'react';
import { INSTANCE_GROUPS } from '@/utils/instanceGroups';

const getInstanceFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const instance = search.get('instance');

  if (!instance || instance === 'all') {
    return {};
  }

  const group = INSTANCE_GROUPS.find(
    (candidate) => candidate.id === Number(instance),
  );
  const instanceIds = group?.instanceIds ?? [Number(instance)];

  return instanceIds.length === 1
    ? { instanceId: { eq: instanceIds[0] } }
    : { instanceId: { in: instanceIds } };
};

const getCompletedEncountersFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const completedEncounters = search.get('completedEncounters');

  if (completedEncounters && completedEncounters !== '0') {
    return { completedEncounters: { gte: Number(completedEncounters) } };
  }

  return {};
};

export const getInstanceRunsFilters = (search: URLSearchParams) => ({
  ...getInstanceFilters(search),
  ...getCompletedEncountersFilters(search),
});

export const InstanceRunsFilters = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();
  const instance = search.get('instance') ?? 'all';
  const completedEncounters =
    search.get('completedEncounters') &&
    Number(search.get('completedEncounters') ?? 0);

  return (
    <div className="filter-grid">
      <label>
        <span>{t('pages:instanceRuns.instance')}</span>
        <div className="select">
          <select
            id="instance-select"
            value={instance}
            onChange={(event) => {
              search.set('instance', event.target.value);
              setSearch(search);
            }}
          >
            <option value="all">{t('pages:instanceRuns.all')}</option>
            {INSTANCE_GROUPS.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </label>
      <label>
        <span>{t('pages:instanceRuns.minCompletedEncounters')}</span>
        <input
          id="completedEncounters"
          className="input"
          type="number"
          step={1}
          placeholder="0"
          value={completedEncounters ?? undefined}
          onChange={(event) => {
            search.set('completedEncounters', event.target.value);
            setSearch(search);
          }}
        />
      </label>
    </div>
  );
};
