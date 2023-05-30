import { Card, Columns } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const getQueueTypeFilters = (search: URLSearchParams) => {
  const queueType = search.get('queue_type');

  switch (queueType) {
    case 'standard':
    case 'solo':
    case 'city_siege':
    case 'group_ranked':
    case 'solo_ranked':
    case 'group_challenge':
      return {
        queueType: queueType?.toUpperCase(),
      };
  }

  return {};
};

export const getScenarioFilters = (search: URLSearchParams) => {
  return { ...getQueueTypeFilters(search) };
};

export const ScenarioFilters = (): JSX.Element => {
  const { t } = useTranslation('components');
  const [search, setSearch] = useSearchParams();

  const queueType = search.get('queue_type') || 'all';

  return (
    <Card mb={5}>
      <Card.Content>
        <Columns>
          <Columns.Column>
            <div className="field">
              <label className="label">{t('scenarioFilters.queueType')}</label>
              <div className="control">
                <div className="select">
                  <select
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
                    <option value="group_challenge">
                      {t('scenarioFilters.queueTypeGroupChallenge')}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </Columns.Column>
        </Columns>
      </Card.Content>
    </Card>
  );
};
