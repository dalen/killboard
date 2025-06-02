import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import Tippy from '@tippyjs/react';
import { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ItemPopup } from './ItemPopup';
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

export function ItemQuests({ itemId }: { itemId: string | undefined }) {
  const perPage = 10;
  const { t } = useTranslation(['common', 'components']);
  const { loading, error, data, refetch } = useQuery<Query>(ITEM_INFO, {
    variables: {
      itemId,
      first: perPage,
    },
  });

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const rewardedFromQuests = data?.item?.rewardedFromQuests;

  if (rewardedFromQuests?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  if (rewardedFromQuests?.nodes == null) return null;

  const { pageInfo } = rewardedFromQuests;

  return (
    <>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>{t('components:itemQuests.questName')}</th>
            <th>{t('components:itemQuests.given')}</th>
            <th>{t('components:itemQuests.choice')}</th>
          </tr>
        </thead>
        <tbody>
          {rewardedFromQuests.nodes.map((quest) => (
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
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </>
  );
}
