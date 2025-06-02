import { ReactElement, useState } from 'react';
import { Link } from 'react-router';
import { CharacterItemPopup } from '@/components/character/CharacterItemPopup';
import { itemFigureClass } from '@/itemUtils';
import { gql } from '@apollo/client';
import { ItemListEntryFragment } from '@/__generated__/graphql';

export const ITEM_FRAGMENT = gql`
  fragment ItemListEntry on Item {
    id
    iconUrl
    name
    careerRestriction
    raceRestriction
    uniqueEquipped
    description
    type
    slot
    rarity
    armor
    dps
    speed
    levelRequirement
    renownRankRequirement
    itemLevel
    talismanSlots
    itemSet {
      id
      name
      items {
        id
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
    abilities {
      id
      description
    }
    buffs {
      id
      description
    }
    stats {
      stat
      value
    }
  }
`;

export function ItemIconWithPopup({
  item,
}: {
  item: ItemListEntryFragment;
}): ReactElement {
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
