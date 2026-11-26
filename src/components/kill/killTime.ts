export type KillTimeZoneMode = 'altdorf' | 'local';

type KillTimeFormat = 'date' | 'time' | 'chart' | 'full' | 'day';

const getTimeZone = (mode: KillTimeZoneMode): string | undefined =>
  mode === 'altdorf' ? 'Europe/Zurich' : undefined;

export const formatKillTime = (
  date: Date,
  mode: KillTimeZoneMode,
  formatType: KillTimeFormat,
): string => {
  const timeZone = getTimeZone(mode);

  if (formatType === 'date') {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
    const values = Object.fromEntries(
      parts.map(({ type, value }) => [type, value]),
    );
    return `${values.year}-${values.month}-${values.day}`;
  }

  if (formatType === 'time') {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).format(date);
  }

  if (formatType === 'day') {
    return new Intl.DateTimeFormat(undefined, {
      timeZone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  if (formatType === 'chart') {
    return new Intl.DateTimeFormat(undefined, {
      timeZone,
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(date);
  }

  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
};
