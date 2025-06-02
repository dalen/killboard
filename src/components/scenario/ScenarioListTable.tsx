import { format, formatISO, intervalToDuration } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { ScenarioRecord } from '@/__generated__/graphql';
import { ReactElement } from 'react';
import clsx from 'clsx';

export function ScenarioListTable({
  data,
}: {
  data: ScenarioRecord[];
}): ReactElement {
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  const { t } = useTranslation(['common', 'components']);

  return (
    <div className="table-container">
      <table
        className={clsx(
          'table',
          'is-striped',
          'is-hoverable',
          'is-marginless',
          isMobile ? 'is-narrow' : 'is-fullwidth',
        )}
      >
        <thead>
          <tr>
            <th>{t('components:scenarioList.name')}</th>
            <th>{t('components:scenarioList.time')}</th>
            <th>{t('components:scenarioList.duration')}</th>
            <th align="center">{t('components:scenarioList.winner')}</th>
            <th align="right">{t('components:scenarioList.order')}</th>
            <th align="right">{t('components:scenarioList.destruction')}</th>
            <th aria-label="empty" />
          </tr>
        </thead>
        <tbody>
          {data.map((scenario) => {
            const startDate = new Date(scenario.startTime * 1000);
            const endDate = new Date(scenario.endTime * 1000);
            const duration = intervalToDuration({
              start: startDate,
              end: endDate,
            });

            return (
              <tr key={scenario.id}>
                <td>{scenario.scenario.name}</td>
                <td>
                  {' '}
                  <small>
                    {formatISO(startDate, { representation: 'date' })}
                    <br />
                    {format(startDate, 'HH:mm:ss')}
                  </small>
                </td>
                <td>
                  {t(
                    duration.hours === 0
                      ? 'components:scenarioList.scenarioDuration'
                      : 'components:scenarioList.scenarioDurationHour',
                    {
                      hours: duration.hours,
                      minutes: duration.minutes,
                      seconds: duration.seconds,
                    },
                  )}
                </td>
                <td align="center">
                  {scenario.winner === 0 ? (
                    <img
                      src="/images/icons/scenario/order.png"
                      width={40}
                      height={40}
                      alt="Order"
                    />
                  ) : (
                    <img
                      src="/images/icons/scenario/destruction.png"
                      width={40}
                      height={40}
                      alt="Destruction"
                    />
                  )}
                </td>
                <td align="right" className="scenariolist-score-order">
                  {scenario.points[0]}
                </td>
                <td align="right" className="scenariolist-score-destruction">
                  {scenario.points[1]}
                </td>
                <td>
                  <Link
                    to={`/scenario/${scenario.id}`}
                    className="button is-primary p-2 is-pulled-right"
                  >
                    {t('components:scenarioList.details')}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
