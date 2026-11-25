import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import clsx from 'clsx';
import { itemNameClass, statMultiplier } from '../itemUtils';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { isPercentage } from '../utils';
import { ItemQuests } from '@/components/item/ItemQuests';
import { ItemVendorsPurchase } from '@/components/item/ItemVendorsPurchase';
import { ItemVendorsSell } from '@/components/item/ItemVendorsSell';
import { ItemPopupTrigger } from '@/components/item/ItemPopupTrigger';
import { ItemDrops, type ItemDropSource } from '@/components/item/ItemDrops';
import type { ReactElement } from 'react';
import { EquipSlot, type Query, ItemType } from '@/__generated__/graphql';

const ITEM_INFO = gql`
  query GetItemInfo($id: ID!) {
    item(id: $id) {
      id
      name
      description
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
          name
          iconUrl
          soldByVendors(first: 20) {
            nodes {
              requiredItems {
                count
                item {
                  id
                  name
                  iconUrl
                }
              }
            }
          }
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
      soldByVendors(first: 25) {
        totalCount
        nodes {
          creatures {
            id
            spawns {
              zone {
                name
              }
            }
          }
        }
      }
      usedToPurchase {
        totalCount
      }
      rewardedFromQuests {
        totalCount
      }
      dropsFromCreatures {
        totalCount
      }
      dropsFromGameObjects {
        totalCount
      }
      rewardedFromChapters {
        totalCount
      }
    }
  }
`;

export const Item = ({
  tab,
}: {
  tab: 'vendors' | 'quests' | 'purchase' | ItemDropSource;
}): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<Query>(ITEM_INFO, {
    variables: {
      id,
    },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  if (data?.item == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { item } = data;
  const sellerCount = new Set(
    item.soldByVendors?.nodes
      ?.flatMap(({ creatures }) =>
        creatures
          .filter((creature) => creature.spawns.length > 0)
          .map(({ id }) => id),
      ) ?? [],
  ).size;

  const setItemCosts = item.itemSet?.items.map((setItem) => {
    const crestRequirements =
      setItem.soldByVendors?.nodes?.flatMap((vendorItem) =>
        vendorItem.requiredItems.filter(
          ({ item: requiredItem }) =>
            requiredItem.name.trim().toLowerCase() === 'war crest',
        ),
      ) ?? [];
    const distinctCosts = [
      ...new Set(crestRequirements.map(({ count }) => count)),
    ].sort((a, b) => a - b);
    const cost = distinctCosts[0];

    return {
      item: setItem,
      cost,
      costOptions: distinctCosts.length,
      crestIcon: crestRequirements.find(({ count }) => count === cost)?.item
        .iconUrl,
    };
  });
  const pricedSetItems = setItemCosts?.filter(({ cost }) => cost != null) ?? [];
  const setWarCrestTotal = pricedSetItems.reduce(
    (total, { cost }) => total + (cost ?? 0),
    0,
  );

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
  if (item.dropsFromCreatures?.totalCount) {
    activeTabs.push('creatures');
  }
  if (item.dropsFromGameObjects?.totalCount) {
    activeTabs.push('gameObjects');
  }
  if (item.rewardedFromChapters?.totalCount) {
    activeTabs.push('chapters');
  }
  const activeTab = activeTabs.includes(tab) ? tab : activeTabs[0];

  return (
    <div className="container is-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/items">{t('common:items')}</Link>
          </li>
          <li className="is-active">
            <div className="ml-2">{item.name}</div>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <article className="media">
            <figure className="media-left">
              <figure className="image is-64x64 m-0">
                <img src={item.iconUrl} alt="Item Icon" />
              </figure>
            </figure>
            <div className="media-content">
              <div className="columns">
                <div className="column">
                  <div className="is-flex mb-4">
                    <div className="is-size-3  is-family-secondary">
                      <div className={itemNameClass(item)}>{item.name}</div>
                    </div>
                  </div>
                  <div className="mb-1">{item.description}</div>
                  {item.slot !== EquipSlot.None && (
                    <div>{t(`enums:itemSlot.${item.slot}`)}</div>
                  )}
                  {item.type !== ItemType.None && (
                    <div>{t(`enums:itemType.${item.type}`)}</div>
                  )}
                  {item.itemLevel > 0 && <div>Item Level {item.itemLevel}</div>}
                  {item.armor > 0 && item.type !== ItemType.Shield && (
                    <div className="stats-text-highlight">
                      {item.armor} Armor
                    </div>
                  )}
                  {item.dps > 0 && item.type !== ItemType.Shield && (
                    <div className="stats-text-highlight">
                      {(item.dps / 10).toFixed(1)} DPS
                    </div>
                  )}
                  {item.speed > 0 && (
                    <div className="stats-text-highlight">
                      {(item.speed / 100).toFixed(1)} Speed
                    </div>
                  )}
                  {item.type === ItemType.Shield && (
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
                          className={clsx(
                            'ml-2',
                            'item-text-set-bonus-disabled',
                          )}
                        >
                          ({bonus.itemsRequired} piece bonus):{' '}
                          {bonus.bonus.__typename === 'Ability' &&
                            bonus.bonus.description}
                          {bonus.bonus.__typename === 'ItemStat' &&
                            `+ ${
                              bonus.bonus.value *
                              statMultiplier(bonus.bonus.stat)
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
                </div>
                {item.itemSet && (
                  <div className="column">
                    <div className="is-size-5 is-family-secondary">
                      {item.itemSet.name}
                    </div>
                    {setItemCosts?.map((setItemCost) => (
                      <div
                        key={setItemCost.item.id}
                        className="set-piece-row mb-1"
                      >
                        <span className="set-piece-name">
                          <ItemPopupTrigger
                            itemId={setItemCost.item.id}
                            placement="right-start"
                            offset={[0, 6]}
                          >
                            <span className="icon-text">
                              <figure className="image is-24x24 m-0 mr-1">
                                <img src={setItemCost.item.iconUrl} alt="" />
                              </figure>
                              {setItemCost.item.id === item.id ? (
                                <span>{setItemCost.item.name}</span>
                              ) : (
                                <Link to={`/item/${setItemCost.item.id}`}>
                                  {setItemCost.item.name}
                                </Link>
                              )}
                            </span>
                          </ItemPopupTrigger>
                        </span>
                        <span className="set-piece-cost">
                          {setItemCost.cost != null ? (
                            <span className="icon-text">
                              {setItemCost.costOptions > 1 && (
                                <span>{t('pages:itemPage.from')} </span>
                              )}
                              <span>{setItemCost.cost.toLocaleString()}</span>
                              <figure className="image is-16x16 ml-1">
                                <img
                                  src={setItemCost.crestIcon}
                                  alt={t('pages:itemPage.warCrests')}
                                />
                              </figure>
                            </span>
                          ) : (
                            <span className="has-text-grey">
                              {t('pages:itemPage.costNotListed')}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                    {pricedSetItems.length > 0 && (
                      <div className="set-piece-total mt-3 pt-3">
                        {pricedSetItems.length === item.itemSet.items.length ? (
                          <>
                            <strong>{t('pages:itemPage.fullSetTotal')}</strong>
                            <span className="icon-text ml-2">
                              <strong>
                                {setWarCrestTotal.toLocaleString()}
                              </strong>
                              <figure className="image is-16x16 ml-1">
                                <img
                                  src={pricedSetItems[0].crestIcon}
                                  alt={t('pages:itemPage.warCrests')}
                                />
                              </figure>
                            </span>
                          </>
                        ) : (
                          <div>
                            {t('pages:itemPage.partialSetTotal', {
                              priced: pricedSetItems.length,
                              total: item.itemSet.items.length,
                              count: setWarCrestTotal.toLocaleString(),
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
      <div className="tabs">
        {activeTabs.includes('vendors') && (
          <li className={activeTab === 'vendors' ? 'is-active' : ''}>
            <Link to={`/item/${id}`}>
              {t('pages:itemPage.vendors')} ({sellerCount})
            </Link>
          </li>
        )}
        {activeTabs.includes('purchase') && (
          <li className={activeTab === 'purchase' ? 'is-active' : ''}>
            <Link to={`/item/${id}/purchase`}>
              {t('pages:itemPage.purchase')} ({item.usedToPurchase?.totalCount})
            </Link>
          </li>
        )}
        {activeTabs.includes('quests') && (
          <li className={activeTab === 'quests' ? 'is-active' : ''}>
            <Link to={`/item/${id}/quests`}>
              {t('pages:itemPage.quests')} (
              {item.rewardedFromQuests?.totalCount})
            </Link>
          </li>
        )}
        {activeTabs.includes('creatures') && (
          <li className={activeTab === 'creatures' ? 'is-active' : ''}>
            <Link to={`/item/${id}/drops/creatures`}>
              {t('pages:itemSources.droppedByCreatures')} (
              {item.dropsFromCreatures?.totalCount})
            </Link>
          </li>
        )}
        {activeTabs.includes('gameObjects') && (
          <li className={activeTab === 'gameObjects' ? 'is-active' : ''}>
            <Link to={`/item/${id}/drops/objects`}>
              {t('pages:itemSources.droppedByGameObjects')} (
              {item.dropsFromGameObjects?.totalCount})
            </Link>
          </li>
        )}
        {activeTabs.includes('chapters') && (
          <li className={activeTab === 'chapters' ? 'is-active' : ''}>
            <Link to={`/item/${id}/chapters`}>
              {t('pages:itemSources.chapters')} (
              {item.rewardedFromChapters?.totalCount})
            </Link>
          </li>
        )}
      </div>
      {activeTab === 'vendors' && <ItemVendorsSell itemId={id} />}
      {activeTab === 'purchase' && <ItemVendorsPurchase itemId={id} />}
      {activeTab === 'quests' && <ItemQuests itemId={id} />}
      {(activeTab === 'creatures' ||
        activeTab === 'gameObjects' ||
        activeTab === 'chapters') && (
        <ItemDrops itemId={id} source={activeTab} />
      )}
    </div>
  );
};
