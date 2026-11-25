import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { itemFigureClass } from '@/itemUtils';
import type { ItemListEntryFragment } from '@/__generated__/graphql';
import { ItemPopupTrigger } from '@/components/item/ItemPopupTrigger';

export { ITEM_FRAGMENT } from '@/components/item/ItemListEntryFragment';

export const ItemIconWithPopup = ({
  item,
}: {
  item: ItemListEntryFragment;
}): ReactElement => {
  return (
    <ItemPopupTrigger
      itemId={item.id}
      placement="right-start"
      offset={[0, 6]}
    >
      <Link to={`/item/${item.id}`}>
        <figure
          className={`${itemFigureClass(
            item,
          )} [item-figure] image is-64x64 m-0`} // Remove [...] from item-figure to add coloured borders
        >
          <img src={item.iconUrl} alt={item.name} />
        </figure>
      </Link>
    </ItemPopupTrigger>
  );
};
