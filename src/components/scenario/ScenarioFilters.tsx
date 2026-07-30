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

const getTimeFilters = (
  search: URLSearchParams,
): ScenarioRecordFilterInput => {
  const range = search.get('range') ?? '1h';
  const now = new Date();
  now.setSeconds(0, 0);
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
        start = new Date(`${startValue}T00:00:00`);
      }
      if (endValue) {
        end = new Date(`${endValue}T23:59:59.999`);
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
  const where: ScenarioRecordFilterInput = {
    ...getTierFilters(search),
    ...getTimeFilters(search),
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
