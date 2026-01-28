import {
  Career,
  Item,
  ItemRarity,
  ItemType,
  Race,
} from '@/__generated__/graphql';

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

const careerSkills: Record<Career, ItemType[]> = {
  ARCHMAGE: [ItemType.Robe, ItemType.Staff],
  BLACK_GUARD: [
    ItemType.HeavyArmor,
    ItemType.Spear,
    ItemType.Shield,
    ItemType.Sword,
  ],
  BLACK_ORC: [ItemType.Spear, ItemType.Shield, ItemType.Sword],
  BRIGHT_WIZARD: [ItemType.Robe, ItemType.Staff],
  CHOPPA: [ItemType.MediumArmor, ItemType.Axe, ItemType.Sword],
  CHOSEN: [ItemType.HeavyArmor, ItemType.Shield, ItemType.Sword, ItemType.Axe],
  DISCIPLE_OF_KHAINE: [
    ItemType.MediumRobe,
    ItemType.Charm,
    ItemType.Shield,
    ItemType.Sword,
  ],
  ENGINEER: [ItemType.LightArmor, ItemType.Gun, ItemType.Hammer],
  IRON_BREAKER: [
    ItemType.HeavyArmor,
    ItemType.Axe,
    ItemType.Shield,
    ItemType.Hammer,
  ],
  KNIGHT_OF_THE_BLAZING_SUN: [
    ItemType.HeavyArmor,
    ItemType.Shield,
    ItemType.Sword,
  ],
  MAGUS: [ItemType.Robe, ItemType.Staff],
  MARAUDER: [ItemType.Axe, ItemType.MediumArmor, ItemType.Hammer],
  RUNE_PRIEST: [ItemType.Robe, ItemType.Staff],
  SHADOW_WARRIOR: [ItemType.LightArmor, ItemType.Bow, ItemType.Sword],
  SHAMAN: [ItemType.Robe, ItemType.Staff],
  SLAYER: [ItemType.MediumArmor, ItemType.Axe, ItemType.Hammer],
  SORCERER: [ItemType.Robe, ItemType.Staff],
  SQUIG_HERDER: [ItemType.LightArmor, ItemType.Spear, ItemType.Bow],
  SWORD_MASTER: [ItemType.HeavyArmor, ItemType.Shield, ItemType.Sword],
  WARRIOR_PRIEST: [
    ItemType.MediumRobe,
    ItemType.Hammer,
    ItemType.Shield,
    ItemType.Charm,
  ],
  WHITE_LION: [ItemType.MediumArmor, ItemType.Axe],
  WITCH_ELF: [ItemType.LightArmor, ItemType.Dagger],
  WITCH_HUNTER: [ItemType.LightArmor, ItemType.Pistol, ItemType.Sword],
  ZEALOT: [ItemType.Robe, ItemType.Dagger, ItemType.Charm],
};

const allCareerSkills: ItemType[] = [
  ItemType.Accessory,
  ItemType.AdvancedMount,
  ItemType.BasicMount,
  ItemType.Crafting,
  ItemType.Currency,
  ItemType.Dye,
  ItemType.Enhancement,
  ItemType.Marketing,
  ItemType.None,
  ItemType.Potion,
  ItemType.Quest,
  ItemType.RefinerTool,
  ItemType.Salvaging,
  ItemType.Siege,
  ItemType.Teleport,
  ItemType.TeleportGroup,
  ItemType.TreasureChest,
  ItemType.TreasureKey,
  ItemType.Trophy,
];

const careerRace: Record<Career, Race> = {
  ARCHMAGE: Race.HighElf,
  BLACK_GUARD: Race.DarkElf,
  BLACK_ORC: Race.Orc,
  BRIGHT_WIZARD: Race.Empire,
  CHOPPA: Race.Orc,
  CHOSEN: Race.Chaos,
  DISCIPLE_OF_KHAINE: Race.DarkElf,
  ENGINEER: Race.Dwarf,
  IRON_BREAKER: Race.Dwarf,
  KNIGHT_OF_THE_BLAZING_SUN: Race.Empire,
  MAGUS: Race.Chaos,
  MARAUDER: Race.Chaos,
  RUNE_PRIEST: Race.Dwarf,
  SHADOW_WARRIOR: Race.HighElf,
  SHAMAN: Race.Goblin,
  SLAYER: Race.Dwarf,
  SORCERER: Race.DarkElf,
  SQUIG_HERDER: Race.Goblin,
  SWORD_MASTER: Race.HighElf,
  WARRIOR_PRIEST: Race.Empire,
  WHITE_LION: Race.HighElf,
  WITCH_ELF: Race.DarkElf,
  WITCH_HUNTER: Race.Empire,
  ZEALOT: Race.Chaos,
};

export const canUseItem = (
  item: Pick<Item, 'raceRestriction' | 'careerRestriction' | 'type'>,
  career: Career,
): boolean => {
  if (
    !allCareerSkills.includes(item.type) &&
    !careerSkills[career].includes(item.type)
  ) {
    return false;
  }

  if (
    item.raceRestriction.length > 0 &&
    !item.raceRestriction.includes(careerRace[career])
  ) {
    return false;
  }

  if (
    item.careerRestriction.length > 0 &&
    !item.careerRestriction.includes(career)
  ) {
    return false;
  }

  return true;
};
