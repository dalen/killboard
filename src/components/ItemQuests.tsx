import { Table } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Item } from '../types';

export function ItemQuests({ item }: { item: Item }) {
  const { t } = useTranslation(['common', 'components']);

  if (item.rewardedFromQuests?.nodes == null) return null;

  return (
    <Table striped className="is-fullwidth">
      <thead>
        <tr>
          <th>{t('components:itemQuests.questName')}</th>
          <th>{t('components:itemQuests.choice')}</th>
          <th>{t('components:itemQuests.given')}</th>
        </tr>
      </thead>
      <tbody>
        {item.rewardedFromQuests.nodes.map((quest) => (
          <tr>
            <td>{quest.name}</td>
            <td>
              {quest.rewardsChoice.map((rewardItem) => (
                <span className="icon-text">
                  <figure className="image is-24x24 mx-1">
                    <img src={rewardItem.item.iconUrl} alt="Item Icon" />
                  </figure>
                  <Link to={`/item/${rewardItem.item.id}`} className="mr-1">
                    {rewardItem.item.name}
                  </Link>
                  x{rewardItem.count}
                </span>
              ))}
            </td>
            <td>
              {quest.rewardsGiven.map((rewardItem) => (
                <span className="icon-text">
                  <figure className="image is-24x24 mx-1">
                    <img src={rewardItem.item.iconUrl} alt="Item Icon" />
                  </figure>
                  <Link to={`/item/${rewardItem.item.id}`} className="mr-1">
                    {rewardItem.item.name}
                  </Link>
                  x{rewardItem.count}
                </span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
