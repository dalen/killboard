import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { type ReactElement, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ErrorMessage } from '@/components/global/ErrorMessage';

const QUERY = gql`
  query GetEvents {
    events {
      eventType: __typename
      name
      startTime
      endTime
    }
  }
`;

interface EventEntry {
  eventType: string;
  name: string;
  startTime: string;
  endTime: string | null;
}

interface EventQueryData {
  events: EventEntry[];
}

const SERVER_TIME_ZONE = 'Europe/Zurich';

const localDateTime = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const serverDateTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: SERVER_TIME_ZONE,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short',
});

const eventType = (typeName?: string): string => {
  switch (typeName) {
    case 'CitySiegeEvent': {
      return 'City Siege';
    }
    case 'ZandriExpeditionEvent': {
      return 'Expedition';
    }
    default: {
      return 'Live Event';
    }
  }
};

const durationLabel = (milliseconds: number): string => {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const minutesPerDay = 24 * 60;
  const days = Math.floor(totalMinutes / minutesPerDay);
  const hours = Math.floor((totalMinutes % minutesPerDay) / 60);
  const minutes = totalMinutes % 60;
  return `${days > 0 ? `${days}d ` : ''}${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
};

const EventCard = ({
  event,
  now,
}: {
  event: EventEntry;
  now: number;
}): ReactElement => {
  const start = new Date(event.startTime).getTime();
  const end = event.endTime == null ? null : new Date(event.endTime).getTime();
  const active = start <= now && (end == null || end > now);
  const target = now < start ? start : end;

  return (
    <article className={`event-card${active ? ' event-card-active' : ''}`}>
      <header className="event-card-header">
        <span className="event-card-type">{eventType(event.eventType)}</span>
        <span className="tag is-dark">
          {active ? 'Active now' : 'Upcoming'}
        </span>
      </header>
      <h2 className="title is-5 mt-3 mb-3">
        {event.name ?? eventType(event.eventType)}
      </h2>
      <dl className="event-times">
        <div>
          <dt>Starts</dt>
          <dd>
            <span>
              <strong>Local</strong> {localDateTime.format(start)}
            </span>
            <span>
              <strong>Server</strong> {serverDateTime.format(start)}
            </span>
          </dd>
        </div>
        {end != null && (
          <div>
            <dt>Ends</dt>
            <dd>
              <span>
                <strong>Local</strong> {localDateTime.format(end)}
              </span>
              <span>
                <strong>Server</strong> {serverDateTime.format(end)}
              </span>
            </dd>
          </div>
        )}
      </dl>
      {target != null && (
        <p className="event-countdown">
          {now < start ? 'Starts' : 'Ends'} in {durationLabel(target - now)}
        </p>
      )}
    </article>
  );
};

export const Events = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { loading, error, data } = useQuery<EventQueryData>(QUERY);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = globalThis.setInterval(() => setNow(Date.now()), 30_000);
    return () => globalThis.clearInterval(timer);
  }, []);

  const events = useMemo(
    () =>
      [...(data?.events ?? [])]
        .filter(
          (event) =>
            event.endTime == null || new Date(event.endTime).getTime() > now,
        )
        .sort((left, right) => {
          const leftStart = new Date(left.startTime).getTime();
          const rightStart = new Date(right.startTime).getTime();
          const leftActive =
            leftStart <= now &&
            (left.endTime == null || new Date(left.endTime).getTime() > now);
          const rightActive =
            rightStart <= now &&
            (right.endTime == null || new Date(right.endTime).getTime() > now);
          return (
            Number(rightActive) - Number(leftActive) || leftStart - rightStart
          );
        }),
    [data?.events, now],
  );

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/events">{t('common:events')}</Link>
          </li>
        </ul>
      </nav>
      <header className="has-text-centered mb-5">
        <h1 className="title">{t('pages:events.title')}</h1>
        <p className="subtitle is-6">{t('pages:events.description')}</p>
      </header>
      {events.length === 0 ? (
        <div className="notification is-dark">
          No active or upcoming events were returned.
        </div>
      ) : (
        <section className="event-grid" aria-label="Active and upcoming events">
          {events.map((event) => (
            <EventCard
              key={`${event.eventType}-${event.name}-${event.startTime}`}
              event={event}
              now={now}
            />
          ))}
        </section>
      )}
    </div>
  );
};
