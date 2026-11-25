import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  EquipSlot,
  type EquippedCharacterItemFragment,
  ItemType,
  type TalismanFragment,
} from '@/__generated__/graphql';
import { isPercentage } from '@/utils';
import { itemNameClass, statMultiplier } from '@/itemUtils';
import type { ReactElement } from 'react';
import type { ItemListEntryFragment } from '@/__generated__/graphql';
import { GoldPrice } from '@/components/GoldPrice';

type ItemVendorCost = {
  price: number;
  requiredItems: Array<{
    count: number;
    item: { id: string; name: string; iconUrl: string };
  }>;
};

const numEquippedInSet = (
  itemSet: ItemListEntryFragment['itemSet'],
  itemsEquipped: EquippedCharacterItemFragment[],
): number => {
  let numEquipped = 0;

  if (!itemSet) {
    return 0;
  }

  itemsEquipped.forEach((item) => {
    if (
      item.item.itemSet &&
      item.item.itemSet.id === itemSet.id &&
      item.equipSlot !== EquipSlot.None
    ) {
      numEquipped += 1;
    }
  });

  return numEquipped;
};

export const CharacterItemPopup = ({
  item,
  talismans,
  itemsEquipped,
  popupClassName = 'popup',
  vendorCosts = [],
}: {
  item: ItemListEntryFragment;
  talismans: TalismanFragment[];
  itemsEquipped: EquippedCharacterItemFragment[];
  popupClassName?: string;
  vendorCosts?: ItemVendorCost[];
}): ReactElement => {
  const { t } = useTranslation(['enums', 'pages']);

  const uniqueVendorCosts = Array.from(
    new Map(
      vendorCosts.map((vendorCost) => {
        const requiredItems = [...vendorCost.requiredItems].sort((a, b) =>
          a.item.id.localeCompare(b.item.id),
        );
        const costKey = JSON.stringify({
          price: vendorCost.price,
          requiredItems: requiredItems.map(({ count, item: requiredItem }) => [
            requiredItem.id,
            count,
          ]),
        });
        return [costKey, { ...vendorCost, requiredItems }] as const;
      }),
    ).values(),
  );

  const numEquipped = item.itemSet
    ? numEquippedInSet(item.itemSet, itemsEquipped)
    : 0;

  return (
    <div className={popupClassName}>
      <div className="item-popup-header mb-4">
        <div className="is-flex item-popup-title">
          <figure className="image is-32x32 m-0">
            <img
              src={item.iconUrl}
              alt="Character"
              className={`character-item-icon ite-${item.rarity}`}
            />
          </figure>
          <div className="ml-2 is-size-6">
            <div className={itemNameClass(item)}>{item.name}</div>
          </div>
        </div>
        {uniqueVendorCosts.length > 0 && (
          <div
            className="item-popup-costs"
            aria-label={t('pages:itemPopup.vendorCosts')}
          >
            {uniqueVendorCosts.slice(0, 3).map((vendorCost, index) => (
              <div
                key={`${index}-${vendorCost.price}`}
                className="item-popup-cost-option"
              >
                {vendorCost.price > 0 && (
                  <span className="item-popup-gold-cost">
                    <GoldPrice price={vendorCost.price} />
                  </span>
                )}
                {vendorCost.requiredItems.map((requiredItem) => (
                  <span
                    key={`${requiredItem.item.id}-${requiredItem.count}`}
                    className="icon-text item-popup-currency-cost"
                    title={requiredItem.item.name}
                  >
                    <span>{requiredItem.count.toLocaleString()}</span>
                    <figure className="image is-16x16 ml-1">
                      <img
                        src={requiredItem.item.iconUrl}
                        alt={requiredItem.item.name}
                      />
                    </figure>
                  </span>
                ))}
              </div>
            ))}
            {uniqueVendorCosts.length > 3 && (
              <div className="item-popup-more-costs">
                {t('pages:itemPopup.moreOptions', {
                  count: uniqueVendorCosts.length - 3,
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="is-size-7">{t(`enums:itemSlot.${item.slot}`)}</div>
      {item.type !== ItemType.None && (
        <div className="is-size-7">{t(`enums:itemType.${item.type}`)}</div>
      )}
      {item.itemLevel > 0 && (
        <div className="is-size-7">Item Level {item.itemLevel}</div>
      )}
      {item.armor > 0 && item.type !== ItemType.Shield && (
        <div className="is-size-7 stats-text-highlight">{item.armor} Armor</div>
      )}
      {item.dps > 0 && item.type !== ItemType.Shield && (
        <div className="is-size-7 stats-text-highlight">
          {(item.dps / 10).toFixed(1)} DPS
        </div>
      )}
      {item.speed > 0 && (
        <div className="is-size-7 stats-text-highlight">
          {(item.speed / 100).toFixed(1)} Speed
        </div>
      )}
      {item.type === ItemType.Shield && (
        <div className="is-size-7 stats-text-highlight">
          {item.armor} Block Rating
        </div>
      )}
      <div className="is-size-7 stats-text-highlight">
        {item.stats.map((stat) => (
          <div key={stat.stat}>
            + {stat.value * statMultiplier(stat.stat)}
            {isPercentage(stat.stat)} {t(`enums:stat.${stat.stat}`)}
          </div>
        ))}
      </div>
      {talismans.map((talisman) => (
        <div key={talisman.id} className="is-flex is-flex-direction-row my-2">
          <figure className="image is-32x32 m-0 mr-1">
            <img src={talisman.iconUrl} alt={talisman.name} />
          </figure>
          <div>
            <div className="is-size-7 stats-text-highlight">
              {talisman.name}
            </div>
            {talisman.stats.map((stat) => (
              <div className="is-size-7 stats-text-highlight">
                + {stat.value * statMultiplier(stat.stat)}
                {isPercentage(stat.stat)} {t(`enums:stat.${stat.stat}`)}
              </div>
            ))}
            {talisman.buffs.length > 0 &&
              talisman.buffs.map((buff) => (
                <div key={buff.id} className="is-size-7 item-text-buff">
                  {buff.description}
                </div>
              ))}
          </div>
        </div>
      ))}
      {item.talismanSlots > talismans.length && (
        <div className="is-size-7">Empty Talisman Slot</div>
      )}
      {item.itemSet && (
        <div className="is-size-7 mb-3 item-text-set-bonus-enabled">
          {item.itemSet.name}
          {item.itemSet.bonuses.map((bonus) => (
            <div
              className={clsx('ml-2', {
                'item-text-set-bonus-disabled':
                  numEquipped < bonus.itemsRequired,
                'item-text-set-bonus-enabled':
                  numEquipped >= bonus.itemsRequired,
              })}
            >
              ({bonus.itemsRequired} piece bonus):{' '}
              {bonus.bonus.__typename === 'Ability' && bonus.bonus.description}
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
          <div key={buff.id} className="is-size-7 item-text-buff">
            + {buff.description}
          </div>
        ))}
      {item.levelRequirement > 0 && (
        <div className="is-size-7 has-text-white">
          Minumum Rank: {item.levelRequirement}
        </div>
      )}
      {item.renownRankRequirement > 0 && (
        <div className="is-size-7 has-text-white">
          Requires {item.renownRankRequirement} Renown
        </div>
      )}
      {item.careerRestriction.length > 0 && (
        <div className="is-size-7 has-text-white">
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
  );
};
