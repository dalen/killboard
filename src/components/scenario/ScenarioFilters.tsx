import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

const getQueueTypeFilters = (search: URLSearchParams) => {
  const queueType = search.get('queue_type');
  const premadeOnly = search.get('premadeOnly') === 'true' ? true : undefined;

  switch (queueType) {
    case 'standard':
    case 'solo':
    case 'city_siege':
    case 'group_ranked':
    case 'solo_ranked':
      return {
        queueType: queueType?.toUpperCase(),
        premadeOnly,
      };
  }

  return { premadeOnly };
};

export const getScenarioFilters = (search: URLSearchParams) => ({
  ...getQueueTypeFilters(search),
});

export function ScenarioFilters({
  showPremadeOnly = false,
}: {
  showPremadeOnly?: boolean;
}): ReactElement {
  const { t } = useTranslation('components');
  const [search, setSearch] = useSearchParams();

  const queueType = search.get('queue_type') || 'all';

  return (
    <div className="card mb-5">
      <div className="card-content">
        <div className="columns">
          <div className="column">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label" htmlFor="queueType-select">
                  {t('scenarioFilters.queueType')}
                </label>
              </div>
              <div className="field-body">
                <div className="control">
                  <div className="select">
                    <select
                      id="queueType-select"
                      value={queueType}
                      onChange={(event) => {
                        search.set('queue_type', event.target.value);
                        setSearch(search);
                      }}
                    >
                      <option value="all">
                        {t('scenarioFilters.queueTypeAll')}
                      </option>
                      <option value="standard">
                        {t('scenarioFilters.queueTypeStandard')}
                      </option>
                      <option value="solo">
                        {t('scenarioFilters.queueTypeSolo')}
                      </option>
                      <option value="city_siege">
                        {t('scenarioFilters.queueTypeCitySiege')}
                      </option>
                      <option value="group_ranked">
                        {t('scenarioFilters.queueTypeGroupRanked')}
                      </option>
                      <option value="solo_ranked">
                        {t('scenarioFilters.queueTypeSoloRanked')}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showPremadeOnly && (
            <div className="column">
              <label title="Scenarios with 6+ guild members only">
                <input
                  type="checkbox"
                  checked={search.has('premadeOnly')}
                  onChange={(event) => {
                    if (event.target.checked) search.set('premadeOnly', 'true');
                    else search.delete('premadeOnly');
                    setSearch(search);
                  }}
                />{' '}
                {t('scenarioFilters.premadeOnly')}
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
