import {
  getUnixTime,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns/esm';
import { Card, Columns, Form } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { URLSearchParams } from 'url';

const getPeriodFilters = (search: URLSearchParams) => {
  const period = search.get('period');

  switch (period) {
    case 'thisWeek':
      return {
        from: getUnixTime(startOfWeek(new Date(), { weekStartsOn: 1 })),
      };

    case 'lastWeek':
      return {
        from: getUnixTime(
          startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 })
        ),
        to: getUnixTime(startOfWeek(new Date(), { weekStartsOn: 1 })),
      };

    case 'thisMonth':
      return {
        from: getUnixTime(startOfMonth(new Date())),
      };

    case 'lastMonth':
      return {
        from: getUnixTime(startOfMonth(subMonths(new Date(), 1))),
        to: getUnixTime(startOfMonth(new Date())),
      };
  }

  return {};
};

const getSoloKillsFilters = (search: URLSearchParams) => {
  if (search.has('soloOnly')) return { soloOnly: true };

  return {};
};

export const getCurrentFilters = (search: URLSearchParams) => ({ ...getPeriodFilters(search), ...getSoloKillsFilters(search) });

export function KillsFilters(): JSX.Element {
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
                  search.set('period', event.target.value);
                  setSearch(search);
                }}
              >
                <option value="all">{t('killsFilters.allTime')}</option>
                <option value="thisWeek">{t('killsFilters.thisWeek')}</option>
                <option value="lastWeek">{t('killsFilters.lastWeek')}</option>
                <option value="thisMonth">{t('killsFilters.thisMonth')}</option>
                <option value="lastMonth">{t('killsFilters.lastMonth')}</option>
              </select>
            </div>
          </Columns.Column>
          <Columns.Column>
            <Form.Label>
              <Form.Checkbox
                checked={search.has('soloOnly')}
                onChange={(event) => {
                  if (event.target.checked) search.set('soloOnly', 'true');
                  else search.delete('soloOnly');
                  setSearch(search);
                }}
              />{' '}
              {t('killsFilters.soloOnly')}
            </Form.Label>
          </Columns.Column>
        </Columns>
      </Card.Content>
    </Card>
  );
}
