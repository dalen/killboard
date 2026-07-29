import type { ScenarioRecordFilterInput } from '@/__generated__/graphql';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

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

export const ScenarioFilters = (): ReactElement => {
  const { t } = useTranslation('components');
  const [search, setSearch] = useSearchParams();

  const queueType = search.get('queue_type') || 'all';

  return (
    <div className="card mb-5">
      <div className="card-content">
        <div className="columns">
          <div className="column">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label" htmlFor="queueType-select">
                  {t('scenarioFilters.queueType')}
                </label>
              </div>
              <div className="field-body">
                <div className="control">
                  <div className="select">
                    <select
                      id="queueType-select"
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
                        {t('scenarioFilters.queueTypeDiscordant')}
                      </option>
                      <option value="city_siege">
                        {t('scenarioFilters.queueTypeCitySiege')}
                      </option>
                      <option value="group_challenge">
                        {t('scenarioFilters.queueTypeGroupChallenge')}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label" htmlFor="tier-select">
                  {t('scenarioFilters.tier')}
                </label>
              </div>
              <div className="field-body">
                <div className="control">
                  <div className="select">
                    <select
                      id="tier-select"
                      value={search.get('tier') || 'all'}
                      onChange={(event) => {
                        search.set('tier', event.target.value);
                        setSearch(search);
                      }}
                    >
                      <option value="all">
                        {t('scenarioFilters.tierAll')}
                      </option>
                      <option value="1">Tier 1</option>
                      <option value="3">Tier 2–3</option>
                      <option value="4">Tier 4</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
