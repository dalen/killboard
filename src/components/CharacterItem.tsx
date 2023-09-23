import { Media } from 'react-bulma-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Item } from '../types';
import { CharacterItemPopup } from './CharacterItemPopup';

export function CharacterItem({
  item,
  talismans,
}: {
  item: Item;
  talismans: Array<Item>;
}): JSX.Element {
  const { t } = useTranslation(['enums']);
  const [modalOpen, setModalOpen] = useState(false);

  const itemNameClass = (): string => {
    const itemLevel = Math.floor(item.itemLevel / 10);
    return `item-name-${itemLevel}X`;
  };

  const itemFigureClass = (): string => {
    const itemLevel = Math.floor(item.itemLevel / 10);
    return `item-figure-${itemLevel}X`;
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
      {modalOpen && <CharacterItemPopup item={item} talismans={talismans} />}
    </div>
  );
}
