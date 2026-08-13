import type { ScenarioRecordFilterInput } from '@/__generated__/graphql';

const getQueueTypeFilters = (
  search: URLSearchParams,
): { queueType?: number } => {
  const queueType = search.get('queue_type');

  switch (queueType) {
    case 'standard': {
      return { queueType: 0 };
    }
    case 'solo': {
      return { queueType: 2 };
    }
    case 'city_siege': {
      return { queueType: 4 };
    }
    case 'group_challenge': {
      return { queueType: 6 };
    }
  }

  return {};
};

const getTierFilters = (search: URLSearchParams): ScenarioRecordFilterInput => {
  const tier = search.get('tier');

  switch (tier) {
    case 'all': {
      return {};
    }
    case '1':
    case '2':
    case '3':
    case '4': {
      return {
        tier: { eq: Number(tier) },
      };
    }
  }

  return {};
};

// A 'from'/'to' filter value can either be a plain YYYY-MM-DD date (from the
// date picker inputs) or a full ISO timestamp. Shared links bake in the
// latter so a shared link always reproduces the same absolute time window,
// instead of drifting when a relative range is reinterpreted later.
export const parseFilterDate = (value: string, endOfDay: boolean): Date =>
  value.includes('T')
    ? new Date(value)
    : new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00'}`);

const getTimeFilters = (
  search: URLSearchParams,
  defaultRange: '1h' | 'recent',
): ScenarioRecordFilterInput => {
  const range = search.get('range') ?? defaultRange;
  // Round "now" down to a 5-minute bucket instead of using the exact
  // current time. GetTimeFilters recomputes on every mount (e.g. leaving
  // /scenarios to view a character, then coming back), and Apollo's cache
  // only matches identical query variables — even a few seconds' drift in
  // "now" would produce a different startTime.gte on each mount and force
  // a full refetch instead of reusing the cache. Bucketing keeps the same
  // variables (and cache hit) for repeat visits within the same 5-minute
  // window. The explicit Refresh button still bypasses the cache entirely.
  const now = new Date();
  now.setMinutes(Math.floor(now.getMinutes() / 5) * 5, 0, 0);
  let start: Date | undefined;
  let end: Date | undefined;

  switch (range) {
    case '1h': {
      start = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    }
    case '24h': {
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    }
    case '7d': {
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    }
    case '30d': {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    }
    case '90d': {
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    }
    case 'ytd': {
      start = new Date(now.getFullYear(), 0, 1);
      break;
    }
    case 'custom': {
      const startValue = search.get('from');
      const endValue = search.get('to');
      if (startValue) {
        start = parseFilterDate(startValue, false);
      }
      if (endValue) {
        end = parseFilterDate(endValue, true);
      }
      break;
    }
  }

  if (!start && !end) {
    return {};
  }

  return {
    startTime: {
      ...(start && !Number.isNaN(start.getTime())
        ? { gte: start.toISOString() }
        : {}),
      ...(end && !Number.isNaN(end.getTime())
        ? { lte: end.toISOString() }
        : {}),
    },
  };
};

export const getScenarioFilters = (
  search: URLSearchParams,
  {
    characterId,
    guildId,
    wins,
  }: { characterId?: string; guildId?: string; wins?: boolean } = {},
): ScenarioRecordFilterInput => {
  const { queueType } = getQueueTypeFilters(search);
  const defaultRange = characterId || guildId ? 'recent' : '1h';
  const where: ScenarioRecordFilterInput = {
    ...getTierFilters(search),
    ...getTimeFilters(search, defaultRange),
  };

  if (queueType !== undefined) {
    where.queueType = { eq: queueType };
  }

  const scoreboardEntry: Record<string, unknown> = {};
  if (characterId) {
    scoreboardEntry.characterId = { eq: characterId };
  }
  if (guildId) {
    scoreboardEntry.guildId = { eq: guildId };
  }
  if (wins !== undefined) {
    scoreboardEntry.isWinner = { eq: wins };
  }
  if (Object.keys(scoreboardEntry).length > 0) {
    where.scoreboardEntries = { some: scoreboardEntry };
  }

  return where;
};
