import { Button, Table } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageInfo, VendorItem } from '../types';
import { GoldPrice } from './GoldPrice';

export function ItemVendors({
  vendorItems,
  showItem = false,
  pageInfo,
  onNext,
  onPrevious,
}: {
  vendorItems: VendorItem[];
  showItem?: boolean;
  pageInfo: PageInfo;
  onNext?: () => void;
  onPrevious?: () => void;
}) {
  const { t } = useTranslation(['common', 'components']);

  return (
    <Table striped className="is-fullwidth">
      <thead>
        <tr>
          {showItem && <th>{t('components:itemVendors.item')}</th>}
          <th>{t('components:itemVendors.price')}</th>
          <th>{t('components:itemVendors.creatureName')}</th>
          <th>{t('components:itemVendors.realm')}</th>
          <th>{t('components:itemVendors.zone')}</th>
        </tr>
      </thead>
      <tbody>
        {vendorItems.map((vendorItem) => {
          const numRows = vendorItem.creatures.filter(
            (c) => c.spawns.length > 0,
          ).length;

          return vendorItem.creatures
            .filter((creature) => creature.spawns.length > 0)
            .map((creature, index) => (
              <tr>
                {showItem && index === 0 && (
                  <td rowSpan={numRows}>
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
                {index === 0 && (
                  <td rowSpan={numRows}>
                    <GoldPrice price={vendorItem.price} />
                    {vendorItem.requiredItems.map((requiredItem) => (
                      <span className="icon-text">
                        <figure className="image is-24x24 mx-1">
                          <img
                            src={requiredItem.item.iconUrl}
                            alt="Item Icon"
                          />
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
                  {creature.spawns
                    .map((creatureSpawn) => creatureSpawn.zone.name)
                    .join(', ')}
                </td>
              </tr>
            ));
        })}
      </tbody>
      {(pageInfo?.hasNextPage || pageInfo?.hasPreviousPage) && (
        <tfoot>
          <tr>
            {showItem && <td />}
            <td colSpan={4}>
              <div className="field is-grouped is-pulled-right">
                {pageInfo.hasPreviousPage && (
                  <Button
                    p={2}
                    pull="right"
                    color="info"
                    size="small"
                    onClick={onPrevious}
                  >
                    {t('common:prevPage')}
                    <i className="fas fa-circle-chevron-left ml-1" />
                  </Button>
                )}
                {pageInfo.hasNextPage && (
                  <Button
                    p={2}
                    pull="right"
                    color="info"
                    size="small"
                    onClick={onNext}
                  >
                    {t('common:nextPage')}
                    <i className="fas fa-circle-chevron-right ml-1" />
                  </Button>
                )}
              </div>
            </td>
          </tr>
        </tfoot>
      )}
    </Table>
  );
}
