import type { ReactElement } from 'react';
import { Link } from 'react-router';
import Tippy from '@tippyjs/react';
import { itemFigureClass } from '@/itemUtils';
import type { ItemListEntryFragment } from '@/__generated__/graphql';
import { ItemPopup } from '@/components/item/ItemPopup';

export { ITEM_FRAGMENT } from '@/components/item/ItemListEntryFragment';

export const ItemIconWithPopup = ({
  item,
}: {
  item: ItemListEntryFragment;
}): ReactElement => {
  return (
    <Tippy
      duration={0}
      placement="right-start"
      offset={[0, 6]}
      content={<ItemPopup itemId={item.id} />}
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
    </Tippy>
  );
};
