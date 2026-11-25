import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { t } from 'i18next';
import { CharacterItemPopup } from '@/components/character/CharacterItemPopup';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import type { ReactElement } from 'react';
import { ITEM_FRAGMENT } from '@/components/item/ItemListEntryFragment';
import type { GetItemPopupInfoQuery } from '@/__generated__/graphql';

const ITEM_POPUP_INFO = gql`
  query GetItemPopupInfo($id: ID!) {
    item(id: $id) {
      ...ItemListEntry
      soldByVendors(first: 20) {
        nodes {
          price
          requiredItems {
            count
            item {
              id
              name
              iconUrl
            }
          }
        }
      }
    }
  }

  ${ITEM_FRAGMENT}
`;

export const ItemPopup = ({
  itemId,
}: {
  itemId: string;
}): ReactElement | null => {
  const { loading, error, data } = useQuery<GetItemPopupInfoQuery>(
    ITEM_POPUP_INFO,
    {
      variables: {
        id: itemId,
      },
    },
  );

  if (loading) {
    return null;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  if (data?.item == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  return (
    <CharacterItemPopup
      item={data.item}
      talismans={[]}
      itemsEquipped={[]}
      popupClassName="item-popup-tooltip"
      vendorCosts={data.item.soldByVendors?.nodes ?? []}
    />
  );
};
