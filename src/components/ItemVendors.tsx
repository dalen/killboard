import { Table } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { VendorItem } from '../types';

export function ItemVendors({
  vendorItems,
  showItem = false,
}: {
  vendorItems: VendorItem[];
  showItem?: boolean;
}) {
  const { t } = useTranslation(['common', 'components']);

  return (
    <Table striped className="is-fullwidth">
      <thead>
        <tr>
          {showItem && <th>{t('components:itemVendors.item')}</th>}
          <th>{t('components:itemVendors.creatureName')}</th>
          <th>{t('components:itemVendors.realm')}</th>
          <th>{t('components:itemVendors.price')}</th>
          <th>{t('components:itemVendors.zone')}</th>
        </tr>
      </thead>
      <tbody>
        {vendorItems.map((vendorItem) =>
          vendorItem.creatures
            .filter((creature) => creature.spawns.length > 0)
            .map((creature) => (
              <tr>
                {showItem && (
                  <td>
                    <span className="icon-text">
                      <figure className="image is-24x24 mx-1">
                        <img src={vendorItem.item.iconUrl} alt="Item Icon" />
                      </figure>
                      <Link to={`/item/${vendorItem.item.id}`} className="mr-1">
                        {vendorItem.item.name}
                      </Link>
                      x{vendorItem.count}
                    </span>
                  </td>
                )}
                <td>{creature.name}</td>
                <td>
                  {creature.realm === 'ORDER' && (
                    <figure className="image is-24x24 m-0">
                      <img
                        src="/images/icons/scenario/order.png"
                        width={24}
                        height={24}
                        alt={t('components:itemVendors.order')}
                      />
                    </figure>
                  )}
                  {creature.realm === 'DESTRUCTION' && (
                    <figure className="image is-24x24 m-0">
                      <img
                        src="/images/icons/scenario/destruction.png"
                        width={24}
                        height={24}
                        alt={t('components:itemVendors.destruction')}
                      />
                    </figure>
                  )}
                </td>
                <td>
                  {vendorItem.requiredItems.map((requiredItem) => (
                    <span className="icon-text">
                      <figure className="image is-24x24 mx-1">
                        <img src={requiredItem.item.iconUrl} alt="Item Icon" />
                      </figure>
                      <Link
                        to={`/item/${requiredItem.item.id}`}
                        className="mr-1"
                      >
                        {requiredItem.item.name}
                      </Link>
                      x{requiredItem.count}
                    </span>
                  ))}
                </td>
                <td>
                  {creature.spawns
                    .map((creatureSpawn) => creatureSpawn.zone.name)
                    .join(', ')}
                </td>
              </tr>
            )),
        )}
      </tbody>
    </Table>
  );
}
