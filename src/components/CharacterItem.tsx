import { Media } from 'react-bulma-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CharacterItem as CharacterItemType, Item, ItemRarity } from '../types';
import { CharacterItemPopup } from './CharacterItemPopup';

export function CharacterItem({
  item,
  talismans,
  itemsEquipped,
}: {
  item: Item;
  talismans: Array<Item>;
  itemsEquipped: Array<CharacterItemType>;
}): JSX.Element {
  const { t } = useTranslation(['enums']);
  const [modalOpen, setModalOpen] = useState(false);

  const itemNameClass = (): string => {
    if (item.itemSet) return 'item-name-item-set';

    switch (item.rarity) {
      case ItemRarity.Utility:
        return 'item-name-utility';
      case ItemRarity.Common:
        return 'item-name-common';
      case ItemRarity.Uncommon:
        return 'item-name-uncommon';
      case ItemRarity.Rare:
        return 'item-name-rare';
      case ItemRarity.VeryRare:
        return 'item-name-very-rare';
      case ItemRarity.Mythic:
        return 'item-name-mythic';
    }

    return 'item-name-utility';
  };

  const itemFigureClass = (): string => {
    if (item.itemSet) return 'item-figure-item-set';

    switch (item.rarity) {
      case ItemRarity.Utility:
        return 'item-figure-utility';
      case ItemRarity.Common:
        return 'item-figure-common';
      case ItemRarity.Uncommon:
        return 'item-figure-uncommon';
      case ItemRarity.Rare:
        return 'item-figure-rare';
      case ItemRarity.VeryRare:
        return 'item-figure-very-rare';
      case ItemRarity.Mythic:
        return 'item-figure-mythic';
    }

    return 'item-figure-utility';
  };

  const showModal = () => {
    if (!modalOpen && item.name !== '') {
      setModalOpen(true);
    }
  };

  const hideModal = () => {
    if (modalOpen) {
      setModalOpen(false);
    }
  };

  return (
    <div
      className="my-2 is-relative is-clickable"
      onMouseOver={showModal}
      onMouseLeave={hideModal}
      onFocus={showModal}
      onBlur={hideModal}
    >
      <Media>
        <Media.Item align="left">
          <figure
            className={`${itemFigureClass()} [item-figure] image is-64x64 m-0`} // remove [...] from item-figure to add coloured borders
          >
            <img src={item.iconUrl} alt={item.name} />
          </figure>
        </Media.Item>
        {item.name && (
          <Media.Item>
            <div className={`${itemNameClass()} has-text-weight-semi/bold`}>
              {item.name}
            </div>
            <div className="is-size-7">{t(`enums:itemSlot.${item.slot}`)}</div>
            <div className="is-size-7">Level {item.itemLevel}</div>
          </Media.Item>
        )}
      </Media>
      {modalOpen && (
        <CharacterItemPopup
          item={item}
          talismans={talismans}
          itemsEquipped={itemsEquipped}
        />
      )}
    </div>
  );
}
