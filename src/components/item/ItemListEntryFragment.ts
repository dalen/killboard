import { gql } from '@apollo/client';

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
