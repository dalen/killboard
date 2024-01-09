import { gql, useQuery } from '@apollo/client';
import { t } from 'i18next';
import { CharacterItemPopup } from './CharacterItemPopup';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';

const ITEM_POPUP_INFO = gql`
  query GetItemPopupInfo($id: ID!) {
    item(id: $id) {
      id
      name
      description
      careerRestriction
      description
      rarity
      itemLevel
      iconUrl
      stats {
        stat
        value
      }
      type
      levelRequirement
      renownRankRequirement
      slot
      armor
      careerRestriction
      talismanSlots
      speed
      dps
      itemSet {
        id
        name
        items {
          id
          name
          iconUrl
        }
        bonuses {
          itemsRequired
          bonus {
            ... on Ability {
              description
              __typename
            }
            ... on ItemStat {
              stat
              value
              percentage
              __typename
            }
          }
        }
      }
      buffs {
        id
        description
      }
      soldByVendors {
        totalCount
      }
      usedToPurchase {
        totalCount
      }
      rewardedFromQuests {
        totalCount
      }
    }
  }
`;

export function ItemPopup({ itemId }: { itemId: string }): JSX.Element | null {
  const { loading, error, data } = useQuery<Query>(ITEM_POPUP_INFO, {
    variables: {
      id: itemId,
    },
  });

  if (loading) return null;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.item == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <CharacterItemPopup item={data.item} talismans={[]} itemsEquipped={[]} />
  );
}
