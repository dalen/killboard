import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { GoldPrice } from '@/components/GoldPrice';
import { HoverPopupTrigger } from '@/components/global/HoverPopupTrigger';
import { ItemPopupTrigger } from './ItemPopupTrigger';
import { questTypeIcon } from '@/utils';
import { QueryPagination } from '@/components/global/QueryPagination';

const ITEM_INFO = gql`
  query GetItemRewardedFromQuests(
    $itemId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    item(id: $itemId) {
      id
      rewardedFromQuests(
        first: $first
        last: $last
        before: $before
        after: $after
      ) {
        nodes {
          id
          name
          minLevel
          maxLevel
          xp
          gold
          type {
            isGroup
            isTravel
            isTome
            isRvR
            isPlayerKill
            isEpic
          }
          repeatableType
          rewardsChoice {
            item {
              id
              name
              iconUrl
            }
            count
          }
          rewardsGiven {
            item {
              id
              name
              iconUrl
            }
            count
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
  }
`;

export const ItemQuests = ({ itemId }: { itemId: string | undefined }) => {
  const [perPage, setPerPage] = useState(25);
  const { t } = useTranslation(['common', 'components', 'pages']);
  const { loading, error, data, refetch } = useQuery<Query>(ITEM_INFO, {
    variables: {
      first: perPage,
      itemId,
    },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const rewardedFromQuests = data?.item?.rewardedFromQuests;

  if (rewardedFromQuests?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { pageInfo } = rewardedFromQuests;

  return (
    <>
      <div className="item-relation-scroll">
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>{t('components:itemQuests.questName')}</th>
              <th>
                {t('pages:quests.minLevel')}–{t('pages:quests.maxLevel')}
              </th>
              <th>{t('pages:quests.xp')}</th>
              <th>{t('pages:quests.gold')}</th>
              <th>{t('components:itemQuests.given')}</th>
              <th>{t('components:itemQuests.choice')}</th>
            </tr>
          </thead>
          <tbody>
            {rewardedFromQuests.nodes.map((quest) => (
              <tr key={quest.id}>
                <td>
                  <HoverPopupTrigger
                    placement="top"
                    content={
                      <div className="item-relation-tooltip">
                        <strong>{quest.name}</strong>
                        <div>
                          {t('pages:quests.minLevel')}: {quest.minLevel}
                          {quest.maxLevel !== quest.minLevel &&
                            `–${quest.maxLevel}`}
                        </div>
                        <div>
                          {t('pages:quests.xp')}: {quest.xp.toLocaleString()}
                        </div>
                        <div className="icon-text">
                          {t('pages:quests.gold')}:{' '}
                          <GoldPrice price={quest.gold} />
                        </div>
                        <div>
                          {quest.repeatableType === 'WEEKLY'
                            ? t('pages:quests.repeatabilityOptions.weekly')
                            : quest.repeatableType === 'DONE'
                              ? t('pages:quests.repeatabilityOptions.done')
                              : t('pages:quests.repeatabilityOptions.none')}
                        </div>
                      </div>
                    }
                  >
                    <Link to={`/quest/${quest.id}`}>
                      <span className="icon-text">
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
                      </span>
                    </Link>
                  </HoverPopupTrigger>
                </td>
                <td>
                  {quest.minLevel}
                  {quest.maxLevel !== quest.minLevel && `–${quest.maxLevel}`}
                </td>
                <td>{quest.xp.toLocaleString()}</td>
                <td>
                  <GoldPrice price={quest.gold} />
                </td>
                <td>
                  <div className="mb-2 is-flex">
                    {quest.rewardsGiven.slice(0, 5).map((reward) => (
                      <div key={`${quest.id}-${reward.item.id}`}>
                        <ItemPopupTrigger
                          itemId={reward.item.id}
                          placement="top"
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
                        </ItemPopupTrigger>
                      </div>
                    ))}
                  </div>
                  {quest.rewardsGiven.length > 5 && (
                    <div>{quest.rewardsGiven.length - 5} other items</div>
                  )}
                </td>
                <td>
                  <div className="mb-2 is-flex">
                    {quest.rewardsChoice.slice(0, 5).map((reward) => (
                      <div key={`${quest.id}-${reward.item.id}`}>
                        <ItemPopupTrigger
                          itemId={reward.item.id}
                          placement="top"
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
                        </ItemPopupTrigger>
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
    </>
  );
};
