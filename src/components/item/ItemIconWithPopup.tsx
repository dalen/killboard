import { ReactElement, useState } from 'react';
import { Link } from 'react-router';
import { Item } from '@/types';
import { CharacterItemPopup } from '@/components/character/CharacterItemPopup';
import { itemFigureClass } from '@/itemUtils';

export function ItemIconWithPopup({ item }: { item: Item }): ReactElement {
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
    <div className="is-relative">
      <Link
        to={`/item/${item.id}`}
        onMouseOver={showModal}
        onMouseLeave={hideModal}
        onFocus={showModal}
        onBlur={hideModal}
      >
        <figure
          className={`${itemFigureClass(
            item,
          )} [item-figure] image is-64x64 m-0`} // remove [...] from item-figure to add coloured borders
        >
          <img src={item.iconUrl} alt={item.name} />
        </figure>
      </Link>
      {modalOpen && (
        <CharacterItemPopup item={item} talismans={[]} itemsEquipped={[]} />
      )}
    </div>
  );
}
