import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import Tippy from '@tippyjs/react';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { Query, QuestFilterInput } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { SearchBox } from '../components/SearchBox';
import { GoldPrice } from '../components/GoldPrice';
import { ItemPopup } from '../components/ItemPopup';
import { questTypeIcon } from '../utils';
import { QueryPagination } from '../components/QueryPagination';
import { ReactElement } from 'react';
import clsx from 'clsx';

const QUESTS = gql`
  query GetQuests(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: QuestFilterInput
  ) {
    quests(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
    ) {
      nodes {
        id
        name
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

const getFilters = (search: URLSearchParams): QuestFilterInput => ({
  ...getQuestNameFilter(search),
});

export function Quests(): ReactElement {
  const perPage = 15;
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { loading, error, data, refetch } = useQuery<Query>(QUESTS, {
    variables: {
      where: getFilters(search),
      first: perPage,
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.quests?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

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
          <div className="field">
            <label className="label">{t('pages:quests.search')}</label>
            <SearchBox
              initialQuery={search.get('name') || ''}
              onSubmit={(event) => {
                search.set('name', event);
                setSearch(search);
              }}
            />
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
              <th align="right">{t('pages:quests.xp')}</th>
              <th align="right" id="table_gold">
                <span className="mr-2">{t('pages:quests.gold')}</span>
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
                    </div>
                  </Link>
                </td>
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
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                    }}
                                    src={reward.item.iconUrl}
                                    alt={reward.item.name}
                                  />
                                  {reward.count > 1 && (
                                    <div
                                      className="has-text-white"
                                      style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 4,
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
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                    }}
                                    src={reward.item.iconUrl}
                                    alt={reward.item.name}
                                  />
                                  {reward.count > 1 && (
                                    <div
                                      className="has-text-white"
                                      style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 4,
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
        refetch={refetch}
      />
    </div>
  );
}
