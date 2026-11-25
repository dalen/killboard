import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ItemIconWithPopup } from '@/components/item/ItemIconWithPopup';
import { itemNameClass } from '@/itemUtils';
import type { ItemListEntryFragment } from '@/__generated__/graphql';

export const ItemListEntry = ({
  item,
}: {
  item: ItemListEntryFragment;
}): ReactElement => {
  const { t } = useTranslation(['enums', 'pages']);
  const allStats = item.stats
    .map((stat) => `${stat.value} ${t(`enums:stat.${stat.stat}`)}`)
    .join(' · ');
  const stats = item.stats
    .slice(0, 2)
    .map((stat) => `${stat.value} ${t(`enums:stat.${stat.stat}`)}`)
    .join(' · ');

  return (
    <tr>
      <td className="is-hidden-touch">
        <ItemIconWithPopup item={item} />
      </td>
      <td>
        <Link to={`/item/${item.id}`}>
          <div className={`${itemNameClass(item)} has-text-weight-semibold`}>
            {item.name}
          </div>
        </Link>
      </td>
      <td className="is-hidden-touch">{t(`enums:itemType.${item.type}`)}</td>
      <td className="is-hidden-touch">{t(`enums:itemSlot.${item.slot}`)}</td>
      <td>
        <span className={itemNameClass({ rarity: item.rarity })}>
          {t(`enums:itemRarity.${item.rarity}`)}
        </span>
      </td>
      <td>{item.levelRequirement || 0}</td>
      <td>{item.renownRankRequirement || 0}</td>
      <td>{item.itemLevel || 0}</td>
      <td className="is-hidden-touch" title={allStats}>
        {stats || 0}
        {item.stats.length > 2 && ` +${item.stats.length - 2}`}
      </td>
    </tr>
  );
};
