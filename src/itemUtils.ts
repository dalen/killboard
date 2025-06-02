import { Item, ItemRarity } from '@/__generated__/graphql';

export const itemNameClass = (
  item: Pick<Item, 'rarity'> & { itemSet?: unknown },
): string => {
  if (item.itemSet) return 'item-name-item-set';

  switch (item.rarity) {
    case ItemRarity.Utility:
      return 'item-name-utility';
    case ItemRarity.Common:
      return 'item-name-common';
    case ItemRarity.Uncommon:
      return 'item-name-uncommon';
    case ItemRarity.Rare:
      return 'item-name-rare';
    case ItemRarity.VeryRare:
      return 'item-name-very-rare';
    case ItemRarity.Mythic:
      return 'item-name-mythic';
  }

  return 'item-name-utility';
};

export const itemFigureClass = (
  item: Pick<Item, 'rarity'> & { itemSet?: unknown },
): string => {
  if (item.itemSet) return 'item-figure-item-set';

  switch (item.rarity) {
    case ItemRarity.Utility:
      return 'item-figure-utility';
    case ItemRarity.Common:
      return 'item-figure-common';
    case ItemRarity.Uncommon:
      return 'item-figure-uncommon';
    case ItemRarity.Rare:
      return 'item-figure-rare';
    case ItemRarity.VeryRare:
      return 'item-figure-very-rare';
    case ItemRarity.Mythic:
      return 'item-figure-mythic';
  }

  return 'item-figure-utility';
};

export const statMultiplier = (stat: string) => {
  if (stat === 'HEALTH_REGEN') {
    return 4;
  }
  return 1;
};
