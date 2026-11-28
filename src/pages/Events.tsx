import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { Event as ApiEvent } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { formatKillTime } from '@/components/kill/killTime';
import type { ReactElement, ReactNode } from 'react';
import '../components/global/WarhammerProfileStyles.scss';
import './Events.scss';

const EVENT_CALENDAR = gql`
  query GetEventCalendar {
    events {
      __typename
      name
      startTime
      endTime
    }
  }
`;

type EventTypeName = 'LiveEvent' | 'CitySiegeEvent' | 'ZandriExpeditionEvent';
type CalendarEvent = Pick<ApiEvent, 'name' | 'startTime' | 'endTime'> & {
  __typename: EventTypeName;
};
interface EventCalendarQuery {
  events: CalendarEvent[];
}

const localDateTime = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const getEventTypeLabel = (
  type: EventTypeName,
  t: (key: string) => string,
): string => {
  if (type === 'CitySiegeEvent') {
    return t('pages:eventCalendar.citySiege');
  }
  if (type === 'ZandriExpeditionEvent') {
    return t('pages:eventCalendar.zandriExpedition');
  }
  return t('pages:eventCalendar.liveEvent');
};

const getDate = (value: string | null | undefined): Date | null => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const Events = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<EventCalendarQuery>(EVENT_CALENDAR);
  const now = Date.now();

  if (error) {
    return (
      <div className="container is-max-widescreen mt-2">
        <ErrorMessage name={error.name} message={error.message} />
      </div>
    );
  }

  const allEvents = data?.events ?? [];
  const schedule = allEvents
    .flatMap((event) => {
      const start = getDate(event.startTime);
      const end = getDate(event.endTime);
      if (!start) {
        return [];
      }
      const active = end != null && start.getTime() <= now && end.getTime() > now;
      const upcoming = start.getTime() > now && (end == null || end.getTime() > now);
      if (!active && !upcoming) {
        return [];
      }
      return [{ event, start, end, active }];
    })
    .toSorted((left, right) => left.start.getTime() - right.start.getTime());

  let scheduleContent: ReactNode = null;
  if (loading) {
    scheduleContent = <progress className="progress" aria-label={t('common:loading')} />;
  } else if (schedule.length === 0) {
    scheduleContent = (
      <p className="event-calendar-empty">
        {allEvents.length === 0
          ? t('pages:eventCalendar.noEvents')
          : t('pages:eventCalendar.noUpcoming')}
      </p>
    );
  } else {
    scheduleContent = (
      <ol className="event-calendar-list">
        {schedule.map(({ event, start, end, active }) => {
          const eventType: EventTypeName = Reflect.get(event, '__typename');
          const type = getEventTypeLabel(eventType, t);
          const startLocal = localDateTime.format(start);
          const startServer = formatKillTime(start, 'altdorf', 'full');
          const endLocal = end ? localDateTime.format(end) : null;
          const endServer = end ? formatKillTime(end, 'altdorf', 'full') : null;
          return (
            <li key={`${eventType}-${event.name}-${event.startTime}`}>
              <article className="event-calendar-row" aria-label={`${type}: ${event.name}`}>
                <div className="event-calendar-summary">
                  <div className="event-calendar-labels">
                    <span className="event-calendar-type">{type}</span>
                    <span className={`event-calendar-status${active ? ' is-active' : ''}`}>
                      {active ? t('pages:eventCalendar.active') : t('pages:eventCalendar.upcoming')}
                    </span>
                  </div>
                  <h2>{event.name}</h2>
                </div>
                <dl className="event-calendar-times">
                  <div>
                    <dt>{t('pages:eventCalendar.starts')}</dt>
                    <dd>
                      <time dateTime={event.startTime}>
                        <span>{t('pages:eventCalendar.localTime')}: {startLocal}</span>
                        <span>{t('pages:eventCalendar.serverTime')}: {startServer}</span>
                      </time>
                    </dd>
                  </div>
                  {end && event.endTime && (
                    <div>
                      <dt>{t('pages:eventCalendar.ends')}</dt>
                      <dd>
                        <time dateTime={event.endTime}>
                          <span>{t('pages:eventCalendar.localTime')}: {endLocal}</span>
                          <span>{t('pages:eventCalendar.serverTime')}: {endServer}</span>
                        </time>
                      </dd>
                    </div>
                  )}
                </dl>
              </article>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <main className="container is-max-widescreen mt-2 event-calendar-page">
      <nav className="breadcrumb" aria-label={t('common:breadcrumbs')}>
        <ul>
          <li><Link to="/">{t('common:home')}</Link></li>
          <li className="is-active" aria-current="page">
            <Link to="/events">{t('pages:eventCalendar.title')}</Link>
          </li>
        </ul>
      </nav>

      <header className="event-calendar-heading">
        <h1 className="is-size-4 is-family-secondary is-uppercase">
          {t('pages:eventCalendar.title')}
        </h1>
        <p>{t('pages:eventCalendar.description')}</p>
      </header>

      <section className="warhammer-window-panel event-calendar-panel" aria-label={t('pages:eventCalendar.title')}>
        <p className="event-calendar-coverage" role="note">
          {loading
            ? t('common:loading')
            : t('pages:eventCalendar.coverage', { count: schedule.length })}
        </p>

        {scheduleContent}
      </section>
    </main>
  );
};
