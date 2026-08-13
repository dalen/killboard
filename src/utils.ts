import type { QuestTypeFlagsFlags } from '@/__generated__/graphql';
import {
  Career,
  KillDamageSourceType,
  QuestRepeatableType
} from '@/__generated__/graphql';
import { CreatureTitle } from '@/__generated__/schema-types';

export const careerIcon = (career: Career): string => {
  switch (career) {
    case Career.Archmage: {
      return '/images/icons/archmage.png';
    }
    case Career.BlackGuard: {
      return '/images/icons/black-guard.png';
    }
    case Career.BlackOrc: {
      return '/images/icons/black-orc.png';
    }
    case Career.BrightWizard: {
      return '/images/icons/bright-wizard.png';
    }
    case Career.Choppa: {
      return '/images/icons/choppa.png';
    }
    case Career.Chosen: {
      return '/images/icons/chosen.png';
    }
    case Career.DiscipleOfKhaine: {
      return '/images/icons/disciple-of-khaine.png';
    }
    case Career.Engineer: {
      return '/images/icons/engineer.png';
    }
    case Career.IronBreaker: {
      return '/images/icons/ironbreaker.png';
    }
    case Career.KnightOfTheBlazingSun: {
      return '/images/icons/knight-of-the-blazing-sun.png';
    }
    case Career.Magus: {
      return '/images/icons/magus.png';
    }
    case Career.Marauder: {
      return '/images/icons/marauder.png';
    }
    case Career.RunePriest: {
      return '/images/icons/rune-priest.png';
    }
    case Career.ShadowWarrior: {
      return '/images/icons/shadow-warrior.png';
    }
    case Career.Shaman: {
      return '/images/icons/shaman.png';
    }
    case Career.Slayer: {
      return '/images/icons/slayer.png';
    }
    case Career.Sorcerer: {
      return '/images/icons/sorcerer.png';
    }
    case Career.SquigHerder: {
      return '/images/icons/squig-herder.png';
    }
    case Career.SwordMaster: {
      return '/images/icons/sword-master.png';
    }
    case Career.WarriorPriest: {
      return '/images/icons/warrior-priest.png';
    }
    case Career.WhiteLion: {
      return '/images/icons/white-lion.png';
    }
    case Career.WitchElf: {
      return '/images/icons/witch-elf.png';
    }
    case Career.WitchHunter: {
      return '/images/icons/witch-hunter.png';
    }
    case Career.Zealot: {
      return '/images/icons/zealot.png';
    }
    default: {
      return '/images/icons/hidden.png';
    }
  }
};

export const variablesFromCursor = (
  type: 'after' | 'before',
  cursor: string,
  perPage: number,
): {
  after: string | undefined;
  before: string | undefined;
  first: number | undefined;
  last: number | undefined;
} => {
  if (type === 'after')
    {return {
      after: cursor,
      before: undefined,
      first: perPage,
      last: undefined,
    };}

  return {
    after: undefined,
    before: cursor,
    first: undefined,
    last: perPage,
  };
};

export const isPercentage = (stat: string) => {
  const statIsPercentage = [
    'BLOCK',
    'PARRY',
    'DISRUPT',
    'EVADE',
    'CRITICAL_HIT_RATE_REDUCTION',
    'MELEE_CRIT_RATE',
    'RANGED_CRIT_RATE',
    'MAGIC_CRIT_RATE',
    'HEAL_CRIT_RATE',
    'AUTO_ATTACK_SPEED',
    'INCOMING_HEAL_PERCENT',
    'DISRUPT_STRIKETHROUGH',
    'EVADE_STRIKETHROUGH',
    'PARRY_STRIKETHROUGH',
    'BLOCK_STRIKETHROUGH',
    'ARMOR_PENETRATION_REDUCTION',
    'OUTGOING_DAMAGE',
  ];

  if (statIsPercentage.includes(stat)) {
    return '%';
  }

  return '';
};

export const killDamageText = (killDamage: {
  damageType: KillDamageSourceType;
  ability?: { name?: string | null } | null;
}): string => {
  if (killDamage.damageType === KillDamageSourceType.FallDamage)
    {return 'Fall Damage';}

  if (killDamage.damageType === KillDamageSourceType.Other)
    {return 'Auto Attack';}

  return killDamage.ability?.name || 'Unknown';
};

/*
Const QuestType = {
  Group: 1,
  Travel: 2,
  Tome: 4,
  RvR: 8,
  PlayerKill: 16,
  Epic: 32,
} as const;
*/

export const questTypeIcon = (
  type: Pick<
    QuestTypeFlagsFlags,
    'isPlayerKill' | 'isGroup' | 'isRvR' | 'isTravel' | 'isTome'
  >,
  repeatable: QuestRepeatableType,
): string => {
  if (type.isPlayerKill) {
    return 'quest_rvr.png';
  }

  if (type.isGroup && type.isRvR) {
    return 'quest_rvr3.png';
  }

  if (type.isRvR) {
    return 'quest_rvr2.png';
  }

  if (type.isTravel) {
    return 'quest_travel.png';
  }

  if (type.isTome) {
    return 'quest_tome.png';
  }

  if (repeatable !== QuestRepeatableType.None) {
    return 'quest_blue.png';
  }

  return 'quest_green.png';
};

export const creatureTitleIcon = (title: CreatureTitle): string | null => {
  const value = title as string;
  if (title === CreatureTitle.None) return null;
  if (value.includes('HEAL') || value.includes('RITUALIST')) return '/images/icons/healing.png';
  if (value === 'BLACKSMITH') return '/images/corner_icons/ea_icon_corner_blacksmith.png';
  if (value.includes('MERCHANT') || value.includes('VENDOR') || value.includes('QUARTERMASTER')) return '/images/corner_icons/ea_icon_corner_merchant.png';
  if (value.includes('TRAINER')) return '/images/corner_icons/ea_icon_corner_training.png';
  if (value === 'APOTHECARY') return '/images/corner_icons/ea_icon_corner_apothecary.png';
  if (value === 'AUCTIONEER') return '/images/corner_icons/ea_icon_corner_auction.png';
  if (value === 'CULTIVATOR') return '/images/corner_icons/ea_icon_corner_cultivating.png';
  if (value.includes('REGISTRAR') || value === 'HERALD') return '/images/corner_icons/ea_icon_corner_guild.png';
  if (value === 'POSTMASTER') return '/images/corner_icons/ea_icon_corner_mail.png';
  if (value === 'BANKER' || value.includes('VAULT')) return '/images/corner_icons/ea_icon_corner_bag.png';
  if (value.includes('GUARD') || value.includes('LORD') || value.includes('GENERAL') || value === 'DOGOF_WAR' || value === 'SERGEANT') return '/images/corner_icons/ea_icon_corner_rvr.png';
  return null;
};

export const creatureTitleLabel = (title: CreatureTitle): string => {
  if (title === CreatureTitle.None) return '';
  return (title as string)
    .split('_')
    .flatMap((word) => word.length > 2 && word.endsWith('OF') ? [word.slice(0, -2), 'OF'] : [word])
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};
