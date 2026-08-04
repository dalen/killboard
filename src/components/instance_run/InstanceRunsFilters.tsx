import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import type { InstanceRunFilterInput } from '@/__generated__/graphql';
import type { ReactElement } from 'react';

const getInstanceFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const instance = search.get('instance');

  if (instance && instance !== 'all') {
    return { instanceId: { eq: Number(instance) } };
  }

  return {};
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
            <option value="260">Lost Vale</option>
            <option value="176">Sigmar Crypts</option>
            <option value="196">Bilerot</option>
            <option value="160">Bastion Stair</option>
            <option value="163">Thar&apos;Ignan</option>
            <option value="164">Lord Slaurith</option>
            <option value="165">Kaarn the Vanquisher</option>
            <option value="166">Skull Lord Var&apos;Ithrok</option>
            <option value="60">Gunbad</option>
            <option value="63">Gunbad Nursery</option>
            <option value="64">Gunbad Lab</option>
            <option value="65">Squig Boss</option>
            <option value="66">Gunbad Baracks</option>
            <option value="36">Dragonback Pass (Order)</option>
            <option value="37">Dragonback Pass (Destruction)</option>
            <option value="152">Altdorf Sewers 1</option>
            <option value="153">Altdorf Sewers 2</option>
            <option value="169">Altdorf Sewers 3</option>
            <option value="155">Sacellum 1</option>
            <option value="156">Sacellum 2</option>
            <option value="173">Sacellum 3</option>
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
