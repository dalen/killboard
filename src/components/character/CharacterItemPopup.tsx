import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  EquippedCharacterItemFragment,
  TalismanFragment,
} from '@/__generated__/graphql';
import { isPercentage } from '@/utils';
import { itemNameClass, statMultiplier } from '@/itemUtils';
import { ReactElement } from 'react';
import { ItemListEntryFragment } from '@/__generated__/graphql';

const numEquippedInSet = (
  itemSet: ItemListEntryFragment['itemSet'],
  itemsEquipped: EquippedCharacterItemFragment[],
): number => {
  let numEquipped = 0;

  if (!itemSet) return 0;

  itemsEquipped.forEach((item) => {
    if (
      item.item.itemSet &&
      item.item.itemSet.id === itemSet.id &&
      item.equipSlot !== 'NONE'
    ) {
      numEquipped += 1;
    }
  });

  return numEquipped;
};

export function CharacterItemPopup({
  item,
  talismans,
  itemsEquipped,
}: {
  item: ItemListEntryFragment;
  talismans: TalismanFragment[];
  itemsEquipped: EquippedCharacterItemFragment[];
}): ReactElement {
  const { t } = useTranslation(['enums']);

  const numEquipped = item.itemSet
    ? numEquippedInSet(item.itemSet, itemsEquipped)
    : 0;

  return (
    <div className="popup">
      <div className="is-flex mb-4">
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
      <div className="is-size-7">{t(`enums:itemSlot.${item.slot}`)}</div>
      {item.type !== 'NONE' && (
        <div className="is-size-7">{t(`enums:itemType.${item.type}`)}</div>
      )}
      {item.itemLevel > 0 && (
        <div className="is-size-7">Item Level {item.itemLevel}</div>
      )}
      {item.armor > 0 && item.type !== 'SHIELD' && (
        <div className="is-size-7 stats-text-highlight">{item.armor} Armor</div>
      )}
      {item.dps > 0 && item.type !== 'SHIELD' && (
        <div className="is-size-7 stats-text-highlight">
          {(item.dps / 10).toFixed(1)} DPS
        </div>
      )}
      {item.speed > 0 && (
        <div className="is-size-7 stats-text-highlight">
          {(item.speed / 100).toFixed(1)} Speed
        </div>
      )}
      {item.type === 'SHIELD' && (
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
                'item-text-set-bonus-enabled':
                  numEquipped >= bonus.itemsRequired,
                'item-text-set-bonus-disabled':
                  numEquipped < bonus.itemsRequired,
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
}
