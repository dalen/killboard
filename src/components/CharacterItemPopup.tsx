import { Item } from '../types';
import { useTranslation } from 'react-i18next';
import { isPercentage } from '../utils';

export const CharacterItemPopup = ({
  item,
  talismans,
}: {
  item: Item;
  talismans: Array<Item>;
}): JSX.Element => {
  const { t } = useTranslation(['enums']);

  const itemNameClass = (): string => {
    const itemLevel = Math.floor(item.itemLevel / 10);
    return 'item-name-' + itemLevel + 'X';
  };

  const statMultiplier = (stat: string) => {
    if (stat === 'HEALTH_REGEN') {
      return 4;
    } else {
      return 1;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '0px',
        left: '64px',
        background: 'rgba(0,0,0,0.9)',
        padding: '10px 10px 30px 10px',
        minWidth: '88%',
        borderRadius: '5px',
        border: '1px solid rgb(82,52,71)',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    >
      <div className="is-flex mb-4">
        <figure className="image is-32x32 m-0">
          <img
            src={item.iconUrl}
            alt="Character"
            className={`character-item-icon ite-${item.rarity}`}
          />
        </figure>

        <div className="ml-2 is-size-6">
          <div className={itemNameClass()}>{item.name}</div>
        </div>
      </div>
      <div className="is-size-7">{t(`enums:itemSlot.${item.slot}`)}</div>
      {item.type !== 'NONE' && (
        <div className="is-size-7">{t(`enums:itemType.${item.type}`)}</div>
      )}
      {item.itemLevel > 0 && (
        <div className="is-size-7">Item Level {item.itemLevel}</div>
      )}
      {item.armor > 0 && (
        <div className="is-size-7 stats-text-highlight">{item.armor} Armor</div>
      )}
      <div className="is-size-7 stats-text-highlight">
        {item.stats.map((stat, index) => {
          return (
            <div key={index}>
              + {stat.value * statMultiplier(stat.stat)}
              {isPercentage(stat.stat)} {t(`enums:stat.${stat.stat}`)}
            </div>
          );
        })}
      </div>
      {talismans.map((talisman, index) => {
        return (
          <div className="is-flex is-flex-direction-row my-2" key={index}>
            <figure className="image is-32x32 m-0">
              <img src={talisman.iconUrl} alt={talisman.name} />
            </figure>
            <div>
              <div className="is-size-7 stats-text-highlight">
                {talisman.name}
              </div>
              {talisman.stats.map((stat, index) => {
                return (
                  <div className="is-size-7 stats-text-highlight" key={index}>
                    + {stat.value * statMultiplier(stat.stat)}
                    {isPercentage(stat.stat)} {t(`enums:stat.${stat.stat}`)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {item.talismanSlots > talismans.length && (
        <div className="is-size-7">Empty Talisman Slot</div>
      )}
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
              <span key={i}>
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
