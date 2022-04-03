import { Card, Columns } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const getQueueTypeFilters = (search: URLSearchParams) => {
  const queueType = search.get('queue_type');

  switch (queueType) {
    case 'standard':
    case 'duo':
    case 'city':
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

  const period = search.get('period') || 'all';

  return (
    <Card mb={5}>
      <Card.Content>
        <Columns>
          <Columns.Column>
            <div className="select">
              <select
                value={period}
                onChange={(event) => {
                  search.set('queue_type', event.target.value);
                  setSearch(search);
                }}
              >
                <option value="all">{t('scenarioFilters.queueTypeAll')}</option>
                <option value="standard">
                  {t('scenarioFilters.queueTypeStandard')}
                </option>
                <option value="duo">{t('scenarioFilters.queueTypeDuo')}</option>
                <option value="city">
                  {t('scenarioFilters.queueTypeCity')}
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
          </Columns.Column>
        </Columns>
      </Card.Content>
    </Card>
  );
};
