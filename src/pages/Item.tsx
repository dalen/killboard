import {
  Breadcrumb,
  Card,
  Container,
  Media,
  Progress,
  Tabs,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Query } from '../types';
import { itemNameClass, statMultiplier } from '../itemUtils';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { isPercentage } from '../utils';
import { ItemVendors } from '../components/ItemVendors';
import { ItemQuests } from '../components/ItemQuests';

const ITEM_INFO = gql`
  query GetItemInfo(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    item(id: $id) {
      name
      careerRestriction
      description
      rarity
      itemLevel
      iconUrl
      stats {
        stat
        value
      }
      type
      levelRequirement
      renownRankRequirement
      slot
      armor
      careerRestriction
      talismanSlots
      speed
      dps
      itemSet {
        id
        name
        items {
          id
        }
        bonuses {
          itemsRequired
          bonus {
            ... on Ability {
              description
              __typename
            }
            ... on ItemStat {
              stat
              value
              percentage
              __typename
            }
          }
        }
      }
      buffs {
        id
        description
      }
      soldByVendors(
        first: $first
        last: $last
        before: $before
        after: $after
      ) {
        totalCount
        nodes {
          price
          requiredItems {
            count
            item {
              id
              name
              iconUrl
            }
          }
          creatures {
            name
            realm
            spawns {
              zone {
                name
              }
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
      usedToPurchase(
        first: $first
        last: $last
        before: $before
        after: $after
      ) {
        nodes {
          count
          item {
            id
            name
            iconUrl
          }
          price
          requiredItems {
            count
            item {
              id
              name
              iconUrl
            }
          }
          creatures {
            name
            realm
            spawns {
              zone {
                name
              }
            }
          }
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
      rewardedFromQuests(
        first: $first
        last: $last
        before: $before
        after: $after
      ) {
        nodes {
          name
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
        totalCount
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

export function Item({
  tab,
}: {
  tab: 'vendors' | 'quests' | 'purchase';
}): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data, refetch } = useQuery<Query>(ITEM_INFO, {
    variables: {
      id,
    },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.item == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { item } = data;

  const activeTabs: string[] = [];

  if (item.soldByVendors?.totalCount) {
    activeTabs.push('vendors');
  }
  if (item.usedToPurchase?.totalCount) {
    activeTabs.push('purchase');
  }
  if (item.rewardedFromQuests?.totalCount) {
    activeTabs.push('quests');
  }
  const activeTab = activeTabs.includes(tab) ? tab : activeTabs[0];

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {t('pages:itemPage.itemId', { itemId: id })}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card mb={5}>
        <Card.Content>
          <Media>
            <Media.Item align="left">
              <figure className="image is-64x64 m-0">
                <img src={item.iconUrl} alt="Item Icon" />
              </figure>
            </Media.Item>
            <Media.Item>
              <div className="is-flex mb-4">
                <div className="is-size-3  is-family-secondary">
                  <div className={itemNameClass(item)}>{item.name}</div>
                </div>
              </div>
              {item.slot !== 'NONE' && (
                <div>{t(`enums:itemSlot.${item.slot}`)}</div>
              )}
              {item.type !== 'NONE' && (
                <div>{t(`enums:itemType.${item.type}`)}</div>
              )}
              {item.itemLevel > 0 && <div>Item Level {item.itemLevel}</div>}
              {item.armor > 0 && item.type !== 'SHIELD' && (
                <div className="stats-text-highlight">{item.armor} Armor</div>
              )}
              {item.dps > 0 && item.type !== 'SHIELD' && (
                <div className="stats-text-highlight">
                  {(item.dps / 10).toFixed(1)} DPS
                </div>
              )}
              {item.speed > 0 && (
                <div className="stats-text-highlight">
                  {(item.speed / 100).toFixed(1)} Speed
                </div>
              )}
              {item.type === 'SHIELD' && (
                <div className=" stats-text-highlight">
                  {item.armor} Block Rating
                </div>
              )}
              <div className="stats-text-highlight">
                {item.stats.map((stat) => (
                  <div key={stat.stat}>
                    + {stat.value * statMultiplier(stat.stat)}
                    {isPercentage(stat.stat)} {t(`enums:stat.${stat.stat}`)}
                  </div>
                ))}
              </div>
              {Array(item.talismanSlots)
                .fill(0)
                .map(() => (
                  <div>
                    <span className="icon-text">
                      <figure className="image is-24x24 mr-1">
                        <img
                          src="https://armory.returnofreckoning.com/icon/1"
                          alt={t('components:itemVendors.order')}
                        />
                      </figure>
                      Empty Talisman Slot
                    </span>
                  </div>
                ))}

              {item.itemSet && (
                <div className="mb-3 item-text-set-bonus-enabled">
                  {item.itemSet.name}
                  {item.itemSet.bonuses.map((bonus) => (
                    <div
                      className={clsx('ml-2', 'item-text-set-bonus-disabled')}
                    >
                      ({bonus.itemsRequired} piece bonus):{' '}
                      {bonus.bonus.__typename === 'Ability' &&
                        bonus.bonus.description}
                      {bonus.bonus.__typename === 'ItemStat' &&
                        `+ ${
                          bonus.bonus.value * statMultiplier(bonus.bonus.stat)
                        } ${isPercentage(bonus.bonus.stat)} ${t(
                          `enums:stat.${bonus.bonus.stat}`,
                        )}`}
                    </div>
                  ))}
                </div>
              )}
              {item.buffs.length > 0 &&
                item.buffs.map((buff) => (
                  <div key={buff.id} className="item-text-buff">
                    + {buff.description}
                  </div>
                ))}
              {item.levelRequirement > 0 && (
                <div className="has-text-white">
                  Minumum Rank: {item.levelRequirement}
                </div>
              )}
              {item.renownRankRequirement > 0 && (
                <div className="has-text-white">
                  Requires {item.renownRankRequirement} Renown
                </div>
              )}
              {item.careerRestriction.length > 0 && (
                <div className="has-text-white">
                  Career:{' '}
                  {item.careerRestriction.map((career, i) => {
                    const seperator = i === 0 ? '' : ', ';
                    return (
                      <span key={career}>
                        {seperator}
                        {t(`enums:career.${career}`)}
                      </span>
                    );
                  })}
                </div>
              )}
            </Media.Item>
          </Media>
        </Card.Content>
      </Card>
      <Tabs>
        {activeTabs.includes('vendors') && (
          <li className={activeTab === 'vendors' ? 'is-active' : ''}>
            <Link
              to={`/item/${id}`}
              onClick={() => {
                refetch({
                  first: 10,
                  after: undefined,
                  last: undefined,
                  before: undefined,
                });
              }}
            >
              {t('pages:itemPage.vendors')}
            </Link>
          </li>
        )}
        {activeTabs.includes('purchase') && (
          <li className={activeTab === 'purchase' ? 'is-active' : ''}>
            <Link
              to={`/item/${id}/purchase`}
              onClick={() => {
                refetch({
                  first: 10,
                  after: undefined,
                  last: undefined,
                  before: undefined,
                });
              }}
            >
              {t('pages:itemPage.purchase')}
            </Link>
          </li>
        )}
        {activeTabs.includes('quests') && (
          <li className={activeTab === 'quests' ? 'is-active' : ''}>
            <Link
              to={`/item/${id}/quests`}
              onClick={() => {
                refetch({
                  first: 10,
                  after: undefined,
                  last: undefined,
                  before: undefined,
                });
              }}
            >
              {t('pages:itemPage.quests')}
            </Link>
          </li>
        )}
      </Tabs>
      {activeTab === 'vendors' && item.soldByVendors?.nodes && (
        <ItemVendors
          vendorItems={item.soldByVendors.nodes}
          pageInfo={item.soldByVendors.pageInfo}
          onNext={() =>
            refetch({
              first: 10,
              after: item.soldByVendors?.pageInfo?.endCursor,
              last: undefined,
              before: undefined,
            })
          }
          onPrevious={() =>
            refetch({
              first: undefined,
              after: undefined,
              last: 10,
              before: item.soldByVendors?.pageInfo?.startCursor,
            })
          }
        />
      )}
      {activeTab === 'purchase' && item.usedToPurchase?.nodes && (
        <ItemVendors
          vendorItems={item.usedToPurchase.nodes}
          pageInfo={item.usedToPurchase.pageInfo}
          onNext={() =>
            refetch({
              first: 10,
              after: item.usedToPurchase?.pageInfo?.endCursor,
              last: undefined,
              before: undefined,
            })
          }
          onPrevious={() =>
            refetch({
              first: undefined,
              after: undefined,
              last: 10,
              before: item.usedToPurchase?.pageInfo?.startCursor,
            })
          }
          showItem
        />
      )}
      {activeTab === 'quests' && <ItemQuests item={item} />}
    </Container>
  );
}
