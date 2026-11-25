import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import Tippy from '@tippyjs/react';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import type { GetQuestsQuery, QuestFilterInput } from '@/__generated__/graphql';
import { QuestRepeatableType, SortEnumType } from '@/__generated__/schema-types';
import type { QuestSortInput } from '@/__generated__/schema-types';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { SearchBox } from '@/components/global/SearchBox';
import { GoldPrice } from '@/components/GoldPrice';
import { ItemPopup } from '@/components/item/ItemPopup';
import { questTypeIcon } from '../utils';
import { QueryPagination } from '@/components/global/QueryPagination';
import { type ReactElement, useEffect, useState } from 'react';
import clsx from 'clsx';

const QUESTS = gql`
  query GetQuests(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: QuestFilterInput
    $order: [QuestSortInput!]
  ) {
    quests(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
      order: $order
    ) {
      nodes {
        id
        name
        minLevel
        type {
          isGroup
          isTravel
          isTome
          isRvR
          isPlayerKill
          isEpic
        }
        repeatableType
        xp
        gold
        choiceCount
        rewardsChoice {
          count
          item {
            id
            iconUrl
            name
          }
        }
        rewardsGiven {
          count
          item {
            id
            iconUrl
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

const getQuestNameFilter = (search: URLSearchParams): QuestFilterInput => {
  const name = search.get('name');

  if (!name) {
    return {};
  }

  return { name: { contains: name } };
};

const getQuestMinLevelFilter = (search: URLSearchParams): QuestFilterInput => {
  const minLevel = search.get('minLevel');
  const maxLevel = search.get('maxLevel');
  const parsedMinLevel = minLevel === null || minLevel === '' ? undefined : Number(minLevel);
  const parsedMaxLevel = maxLevel === null || maxLevel === '' ? undefined : Number(maxLevel);
  const validMinLevel =
    parsedMinLevel !== undefined &&
    Number.isInteger(parsedMinLevel) &&
    parsedMinLevel >= 0 &&
    parsedMinLevel <= 40;
  const validMaxLevel =
    parsedMaxLevel !== undefined &&
    Number.isInteger(parsedMaxLevel) &&
    parsedMaxLevel >= 0 &&
    parsedMaxLevel <= 40;

  if (!validMinLevel && !validMaxLevel) {
    return {};
  }

  return {
    minLevel: {
      ...(validMinLevel ? { gte: parsedMinLevel } : {}),
      ...(validMaxLevel ? { lte: parsedMaxLevel } : {}),
    },
  };
};

const questTypeFlags = {
  epic: 'isEpic',
  group: 'isGroup',
  playerKill: 'isPlayerKill',
  rvr: 'isRvR',
  tome: 'isTome',
  travel: 'isTravel',
} as const;

const getQuestTypeFilter = (search: URLSearchParams): QuestFilterInput => {
  const type = search.get('type');
  if (!type || !(type in questTypeFlags)) {
    return {};
  }
  const flag = questTypeFlags[type as keyof typeof questTypeFlags];
  return { type: { eq: { [flag]: true } } };
};

const getQuestRepeatabilityFilter = (
  search: URLSearchParams,
): QuestFilterInput => {
  const repeatability = search.get('repeatability');
  if (
    !Object.values(QuestRepeatableType).includes(
      repeatability as QuestRepeatableType,
    )
  ) {
    return {};
  }
  return { repeatableType: { eq: repeatability as QuestRepeatableType } };
};

const getSort = (search: URLSearchParams): QuestSortInput[] => {
  const field = search.get('sort');
  if (field !== 'minLevel' && field !== 'xp' && field !== 'gold') {
    return [];
  }
  const direction = search.get('direction') === 'DESC' ? SortEnumType.Desc : SortEnumType.Asc;
  return [{ [field]: direction }];
};

const getAriaSort = (search: URLSearchParams, field: string) => {
  if (search.get('sort') !== field) {
    return 'none' as const;
  }
  return search.get('direction') === 'DESC' ? ('descending' as const) : ('ascending' as const);
};

const getFilters = (search: URLSearchParams): QuestFilterInput => ({
  ...getQuestNameFilter(search),
  ...getQuestMinLevelFilter(search),
  ...getQuestTypeFilter(search),
  ...getQuestRepeatabilityFilter(search),
});

export const Quests = (): ReactElement => {
  const [search, setSearch] = useSearchParams();
  const [perPage, setPerPage] = useState(15);
  const [minLevelDraft, setMinLevelDraft] = useState(search.get('minLevel') ?? '');
  const [maxLevelDraft, setMaxLevelDraft] = useState(search.get('maxLevel') ?? '');
  const { t } = useTranslation(['common', 'pages', 'enums']);

  useEffect(() => {
    setMinLevelDraft(search.get('minLevel') ?? '');
    setMaxLevelDraft(search.get('maxLevel') ?? '');
  }, [search]);

  const { loading, error, data, refetch } = useQuery<GetQuestsQuery>(QUESTS, {
    variables: {
      first: perPage,
      where: getFilters(search),
      order: getSort(search),
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  const updateFilters = (updates: Record<string, string>) => {
    const nextSearch = new URLSearchParams(search);
    for (const [key, value] of Object.entries(updates)) {
      if (value === '' || value === 'all') {
        nextSearch.delete(key);
      } else {
        nextSearch.set(key, value);
      }
    }
    setSearch(nextSearch);
    void refetch({
      after: undefined,
      before: undefined,
      first: perPage,
      last: undefined,
      where: getFilters(nextSearch),
      order: getSort(nextSearch),
    });
  };

  const applyLevelRange = () => {
    updateFilters({ minLevel: minLevelDraft, maxLevel: maxLevelDraft });
  };

  const updateSort = (field: 'minLevel' | 'xp' | 'gold') => {
    const active = search.get('sort') === field;
    let direction = 'ASC';
    if (active && search.get('direction') !== 'ASC') {
      direction = 'ASC';
    } else if (active) {
      direction = 'DESC';
    }
    updateFilters({ sort: field, direction });
  };

  const sortHeader = (field: 'minLevel' | 'xp' | 'gold', label: string) => {
    const active = search.get('sort') === field;
    const direction = active ? (search.get('direction') ?? 'ASC') : undefined;
    return (
      <button
        className="button is-ghost p-0 has-text-weight-bold"
        type="button"
        aria-label={`${label}${direction ? `, ${direction === 'ASC' ? 'ascending' : 'descending'}` : ''}`}
        onClick={() => updateSort(field)}
      >
        {label}
        {active && (
          <span className="ml-1">{direction === 'ASC' ? '▲' : '▼'}</span>
        )}
      </button>
    );
  };

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.quests?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const entries = data.quests.nodes;
  const { pageInfo } = data.quests;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <div className="ml-2">{t('pages:quests.title')}</div>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <div className="columns is-multiline">
            <div className="column is-12-tablet is-4-desktop">
              <div className="field">
                <label className="label">{t('pages:quests.search')}</label>
                <SearchBox
                  initialQuery={search.get('name') || ''}
                  onSubmit={(event) => {
                    updateFilters({ name: event || '' });
                  }}
                />
              </div>
            </div>
            <div className="column is-6-tablet is-2-desktop">
              <div className="field">
                <label className="label" htmlFor="quest-min-level">
                  {t('pages:quests.minLevel')}
                </label>
                <input
                  className="input"
                  id="quest-min-level"
                  type="number"
                  min={0}
                  max={40}
                  step={1}
                  value={minLevelDraft}
                  onChange={(event) => {
                    const { value } = event.target;
                    const parsedValue = Number(value);
                    if (
                      value === '' ||
                      (Number.isInteger(parsedValue) &&
                        parsedValue >= 0 &&
                        parsedValue <= 40)
                    ) {
                      setMinLevelDraft(value);
                    }
                  }}
                  onBlur={applyLevelRange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.currentTarget.blur();
                    }
                  }}
                />
              </div>
            </div>
            <div className="column is-6-tablet is-2-desktop">
              <div className="field">
                <label className="label" htmlFor="quest-max-level">
                  {t('pages:quests.maxLevel')}
                </label>
                <input
                  className="input"
                  id="quest-max-level"
                  type="number"
                  min={0}
                  max={40}
                  step={1}
                  value={maxLevelDraft}
                  onChange={(event) => {
                    const { value } = event.target;
                    const parsedValue = Number(value);
                    if (
                      value === '' ||
                      (Number.isInteger(parsedValue) &&
                        parsedValue >= 0 &&
                        parsedValue <= 40)
                    ) {
                      setMaxLevelDraft(value);
                    }
                  }}
                  onBlur={applyLevelRange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.currentTarget.blur();
                    }
                  }}
                />
              </div>
            </div>
            <div className="column is-6-tablet is-2-desktop">
              <div className="field">
                <label className="label" htmlFor="quest-type">{t('pages:quests.type')}</label>
                <div className="select is-fullwidth">
                  <select id="quest-type" value={search.get('type') ?? 'all'} onChange={(event) => updateFilters({ type: event.target.value })}>
                    <option value="all">{t('pages:quests.allTypes')}</option>
                    {(['group', 'travel', 'tome', 'rvr', 'playerKill', 'epic'] as const).map((type) => (
                      <option key={type} value={type}>{t(`pages:quests.typeOptions.${type}`)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="column is-6-tablet is-2-desktop">
              <div className="field">
                <label className="label" htmlFor="quest-repeatability">{t('pages:quests.repeatability')}</label>
                <div className="select is-fullwidth">
                  <select id="quest-repeatability" value={search.get('repeatability') ?? 'all'} onChange={(event) => updateFilters({ repeatability: event.target.value })}>
                    <option value="all">{t('pages:quests.allRepeatability')}</option>
                    <option value={QuestRepeatableType.None}>{t('pages:quests.repeatabilityOptions.none')}</option>
                    <option value={QuestRepeatableType.Done}>{t('pages:quests.repeatabilityOptions.done')}</option>
                    <option value={QuestRepeatableType.Weekly}>{t('pages:quests.repeatabilityOptions.weekly')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table
          className={clsx(
            'table',
            'is-striped',
            'is-hoverable',
            isMobile ? 'is-narrow' : 'is-fullwidth',
          )}
        >
          <thead>
            <tr>
              <th>{t('pages:quests.name')}</th>
              <th aria-sort={getAriaSort(search, 'minLevel')}>
                {sortHeader('minLevel', t('pages:quests.minLevel'))}
              </th>
              <th align="right" aria-sort={getAriaSort(search, 'xp')}>
                {sortHeader('xp', t('pages:quests.xp'))}
              </th>
              <th
                align="right"
                id="table_gold"
                aria-sort={getAriaSort(search, 'gold')}
              >
                {sortHeader('gold', t('pages:quests.gold'))}
              </th>
              <th>{t('pages:quests.given')}</th>
              <th>{t('pages:quests.choice')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((quest) => (
              <tr key={quest.id}>
                <td>
                  <Link to={`/quest/${quest.id}`}>
                    <div className="icon-text">
                      <span className="icon has-text-info">
                        <img
                          src={`/images/icons/${questTypeIcon(
                            quest.type,
                            quest.repeatableType,
                          )}`}
                          alt="Quest Type"
                        />
                      </span>
                      <span>{quest.name}</span>
                    </div>
                  </Link>
                </td>
                <td>{quest.minLevel}</td>
                <td align="right">{quest.xp}</td>
                <td align="right" aria-labelledby="table_gold">
                  <GoldPrice price={quest.gold} />
                </td>
                <td>
                  <div className="mb-2 is-flex">
                    {quest.rewardsGiven.slice(0, 5).map((reward) => (
                      <div key={`${quest.id}-${reward.item.id}`}>
                        <Tippy
                          duration={0}
                          placement="top"
                          content={<ItemPopup itemId={reward.item.id} />}
                        >
                          <div>
                            <Link to={`/item/${reward.item.id}`}>
                              <figure className="image is-32x32">
                                <div style={{ position: 'relative' }}>
                                  <img
                                    style={{
                                      left: 0,
                                      position: 'absolute',
                                      top: 0,
                                    }}
                                    src={reward.item.iconUrl}
                                    alt={reward.item.name}
                                  />
                                  {reward.count > 1 && (
                                    <div
                                      className="has-text-white"
                                      style={{
                                        position: 'absolute',
                                        right: 4,
                                        top: 0,
                                      }}
                                    >
                                      {reward.count}
                                    </div>
                                  )}
                                </div>
                              </figure>
                            </Link>
                          </div>
                        </Tippy>
                      </div>
                    ))}
                  </div>
                  {quest.rewardsGiven.length > 5 && (
                    <div>{quest.rewardsGiven.length - 5} other items</div>
                  )}
                </td>
                <td>
                  {quest.choiceCount > 0 && (
                    <div>Choose {quest.choiceCount}</div>
                  )}

                  <div className="mb-2 is-flex">
                    {quest.rewardsChoice.slice(0, 5).map((reward) => (
                      <div key={`${quest.id}-${reward.item.id}`}>
                        <Tippy
                          duration={0}
                          placement="top"
                          content={<ItemPopup itemId={reward.item.id} />}
                        >
                          <div>
                            <Link to={`/item/${reward.item.id}`}>
                              <figure className="image is-32x32">
                                <div style={{ position: 'relative' }}>
                                  <img
                                    style={{
                                      left: 0,
                                      position: 'absolute',
                                      top: 0,
                                    }}
                                    src={reward.item.iconUrl}
                                    alt={reward.item.name}
                                  />
                                  {reward.count > 1 && (
                                    <div
                                      className="has-text-white"
                                      style={{
                                        position: 'absolute',
                                        right: 4,
                                        top: 0,
                                      }}
                                    >
                                      {reward.count}
                                    </div>
                                  )}
                                </div>
                              </figure>
                            </Link>
                          </div>
                        </Tippy>
                      </div>
                    ))}
                  </div>
                  {quest.rewardsChoice.length > 5 && (
                    <div>{quest.rewardsChoice.length - 5} other items</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        onPerPageChange={setPerPage}
        refetch={refetch}
      />
    </div>
  );
};
