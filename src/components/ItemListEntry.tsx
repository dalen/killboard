import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Item } from '../types';
import { CharacterItemPopup } from './CharacterItemPopup';
import { itemFigureClass, itemNameClass } from '../itemUtils';

export function ItemListEntry({ item }: { item: Item }): JSX.Element {
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
    <tr
      onMouseOver={showModal}
      onMouseLeave={hideModal}
      onFocus={showModal}
      onBlur={hideModal}
    >
      <td>
        <Link to={`/item/${item.id}`}>
          <figure
            className={`${itemFigureClass(
              item,
            )} [item-figure] image is-64x64 m-0`} // remove [...] from item-figure to add coloured borders
          >
            <img src={item.iconUrl} alt={item.name} />
          </figure>
        </Link>
      </td>
      <td>
        <Link to={`/item/${item.id}`}>
          <div className={`${itemNameClass(item)} has-text-weight-semi/bold`}>
            {item.name}
          </div>
        </Link>
      </td>
      <td>{t(`enums:itemSlot.${item.slot}`)}</td>
      {modalOpen && (
        <CharacterItemPopup item={item} talismans={[]} itemsEquipped={[]} />
      )}
    </tr>
  );
}
