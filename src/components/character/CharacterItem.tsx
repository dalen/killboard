import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  EquippedCharacterItemFragment,
  ItemListEntryFragment,
  TalismanFragment,
} from '@/__generated__/graphql';
import { CharacterItemPopup } from './CharacterItemPopup';
import { itemFigureClass, itemNameClass } from '@/itemUtils';
import { gql } from '@apollo/client';
import { ITEM_FRAGMENT } from '@/components/item/ItemIconWithPopup';

export const ITEM_TALISMAN_FRAGMENT = gql`
  fragment Talisman on Item {
    id
    name
    rarity
    iconUrl
    stats {
      stat
      value
    }
    buffs {
      id
      description
    }
  }
`;

export const EQUIPPED_ITEM_FRAGMENT = gql`
  fragment EquippedCharacterItem on CharacterItem {
    equipSlot
    talismans {
      ...Talisman
    }
    item {
      ...ItemListEntry
    }
  }
  ${ITEM_TALISMAN_FRAGMENT}
  ${ITEM_FRAGMENT}
`;

export function CharacterItem({
  item,
  talismans = [],
  itemsEquipped = [],
}: {
  item: ItemListEntryFragment;
  talismans?: TalismanFragment[];
  itemsEquipped?: EquippedCharacterItemFragment[];
}): ReactElement {
  const { t } = useTranslation(['enums']);
  const [modalOpen, setModalOpen] = useState(false);

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
      <article className="media">
        <figure className="media-left">
          {item.id === '0' ? (
            <figure
              className={`${itemFigureClass(
                item,
              )} [item-figure] image is-64x64 m-0`} // remove [...] from item-figure to add coloured borders
            >
              <img src={item.iconUrl} alt={item.name} />
            </figure>
          ) : (
            <Link to={`/item/${item.id}`}>
              <figure
                className={`${itemFigureClass(
                  item,
                )} [item-figure] image is-64x64 m-0`} // remove [...] from item-figure to add coloured borders
              >
                <img src={item.iconUrl} alt={item.name} />
              </figure>
            </Link>
          )}
        </figure>
        {item.name && (
          <div className="media-content">
            <div className={`${itemNameClass(item)} has-text-weight-semi/bold`}>
              {item.name}
            </div>
            <div className="is-size-7">{t(`enums:itemSlot.${item.slot}`)}</div>
            {item.itemLevel > 0 && (
              <div className="is-size-7">Level {item.itemLevel}</div>
            )}
          </div>
        )}
        {modalOpen && (
          <CharacterItemPopup
            item={item}
            talismans={talismans}
            itemsEquipped={itemsEquipped}
          />
        )}
      </article>
    </div>
  );
}
