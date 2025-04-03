import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Item } from '@/types';
import { ItemIconWithPopup } from '@/components/item/ItemIconWithPopup';
import { itemNameClass } from '@/itemUtils';

export function ItemListEntry({ item }: { item: Item }): ReactElement {
  const { t } = useTranslation(['enums']);

  return (
    <tr>
      <td>
        <ItemIconWithPopup item={item} />
      </td>
      <td>
        <Link to={`/item/${item.id}`}>
          <div className={`${itemNameClass(item)} has-text-weight-semi/bold`}>
            {item.name}
          </div>
        </Link>
      </td>
      <td>{t(`enums:itemType.${item.type}`)}</td>
      <td>{t(`enums:itemSlot.${item.slot}`)}</td>
    </tr>
  );
}
