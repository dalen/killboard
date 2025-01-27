import {
  getUnixTime,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import { ReactElement } from 'react';
import { Card, Columns, Form } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { URLSearchParams } from 'url';

const getPeriodFilters = (search: URLSearchParams) => {
  const period = search.get('period');

  switch (period) {
    case 'thisWeek':
      return {
        time: {
          gte: getUnixTime(startOfWeek(new Date(), { weekStartsOn: 1 })),
        },
      };

    case 'lastWeek':
      return {
        time: {
          gte: getUnixTime(
            startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
          ),
          lte: getUnixTime(startOfWeek(new Date(), { weekStartsOn: 1 })),
        },
      };

    case 'thisMonth':
      return {
        time: {
          gte: getUnixTime(startOfMonth(new Date())),
        },
      };

    case 'lastMonth':
      return {
        time: {
          gte: getUnixTime(getUnixTime(startOfMonth(subMonths(new Date(), 1)))),
          lte: getUnixTime(startOfMonth(new Date())),
        },
      };
  }

  return { time: {} };
};

const getSoloKillsFilters = (search: URLSearchParams) => {
  if (search.has('soloOnly')) return { soloOnly: true };

  return {};
};

export const getCurrentFilters = (search: URLSearchParams) => ({
  ...getPeriodFilters(search),
  ...getSoloKillsFilters(search),
});

export function KillsFilters(): ReactElement {
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
