import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { CharacterItem as CharacterItemType, Item } from '../types';
import { CharacterItemPopup } from './CharacterItemPopup';
import { itemFigureClass, itemNameClass } from '../itemUtils';

export function CharacterItem({
  item,
  talismans = [],
  itemsEquipped = [],
}: {
  item: Item;
  talismans?: Item[];
  itemsEquipped?: CharacterItemType[];
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
