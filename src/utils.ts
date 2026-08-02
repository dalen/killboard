import type { QuestTypeFlagsFlags } from '@/__generated__/graphql';
import {
  Career,
  KillDamageSourceType,
  QuestRepeatableType,
} from '@/__generated__/graphql';
import { CreatureTitle } from '@/__generated__/schema-types';

export const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const careerIcon = (career: Career): string => {
  switch (career) {
    case Career.Archmage: {
      return assetUrl('/images/icons/archmage.png');
    }
    case Career.BlackGuard: {
      return assetUrl('/images/icons/black-guard.png');
    }
    case Career.BlackOrc: {
      return assetUrl('/images/icons/black-orc.png');
    }
    case Career.BrightWizard: {
      return assetUrl('/images/icons/bright-wizard.png');
    }
    case Career.Choppa: {
      return assetUrl('/images/icons/choppa.png');
    }
    case Career.Chosen: {
      return assetUrl('/images/icons/chosen.png');
    }
    case Career.DiscipleOfKhaine: {
      return assetUrl('/images/icons/disciple-of-khaine.png');
    }
    case Career.Engineer: {
      return assetUrl('/images/icons/engineer.png');
    }
    case Career.IronBreaker: {
      return assetUrl('/images/icons/ironbreaker.png');
    }
    case Career.KnightOfTheBlazingSun: {
      return assetUrl('/images/icons/knight-of-the-blazing-sun.png');
    }
    case Career.Magus: {
      return assetUrl('/images/icons/magus.png');
    }
    case Career.Marauder: {
      return assetUrl('/images/icons/marauder.png');
    }
    case Career.RunePriest: {
      return assetUrl('/images/icons/rune-priest.png');
    }
    case Career.ShadowWarrior: {
      return assetUrl('/images/icons/shadow-warrior.png');
    }
    case Career.Shaman: {
      return assetUrl('/images/icons/shaman.png');
    }
    case Career.Slayer: {
      return assetUrl('/images/icons/slayer.png');
    }
    case Career.Sorcerer: {
      return assetUrl('/images/icons/sorcerer.png');
    }
    case Career.SquigHerder: {
      return assetUrl('/images/icons/squig-herder.png');
    }
    case Career.SwordMaster: {
      return assetUrl('/images/icons/sword-master.png');
    }
    case Career.WarriorPriest: {
      return assetUrl('/images/icons/warrior-priest.png');
    }
    case Career.WhiteLion: {
      return assetUrl('/images/icons/white-lion.png');
    }
    case Career.WitchElf: {
      return assetUrl('/images/icons/witch-elf.png');
    }
    case Career.WitchHunter: {
      return assetUrl('/images/icons/witch-hunter.png');
    }
    case Career.Zealot: {
      return assetUrl('/images/icons/zealot.png');
    }
    default: {
      return assetUrl('/images/icons/hidden.png');
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
  if (type === 'after') {
    return {
      after: cursor,
      before: undefined,
      first: perPage,
      last: undefined,
    };
  }

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
  if (killDamage.damageType === KillDamageSourceType.FallDamage) {
    return 'Fall Damage';
  }

  if (killDamage.damageType === KillDamageSourceType.Other) {
    return 'Auto Attack';
  }

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
  if (title === CreatureTitle.None) {
    return null;
  }

  const value = title as string;

  if (value.includes('HEAL') || value.includes('RITUALIST')) {
    return assetUrl('/images/icons/healing.png');
  }
  if (value === 'BLACKSMITH') {
    return assetUrl('/images/corner_icons/ea_icon_corner_blacksmith.png');
  }
  if (
    value.includes('MERCHANT') ||
    value.includes('VENDOR') ||
    value.includes('QUARTERMASTER')
  ) {
    return assetUrl('/images/corner_icons/ea_icon_corner_merchant.png');
  }
  if (value.includes('TRAINER')) {
    return assetUrl('/images/corner_icons/ea_icon_corner_training.png');
  }
  if (value === 'APOTHECARY') {
    return assetUrl('/images/corner_icons/ea_icon_corner_apothecary.png');
  }
  if (value === 'AUCTIONEER') {
    return assetUrl('/images/corner_icons/ea_icon_corner_auction.png');
  }
  if (value === 'CULTIVATOR') {
    return assetUrl('/images/corner_icons/ea_icon_corner_cultivating.png');
  }
  if (value.includes('REGISTRAR') || value === 'HERALD') {
    return assetUrl('/images/corner_icons/ea_icon_corner_guild.png');
  }
  if (value === 'POSTMASTER') {
    return assetUrl('/images/corner_icons/ea_icon_corner_mail.png');
  }
  if (value === 'BANKER' || value.includes('VAULT')) {
    return assetUrl('/images/corner_icons/ea_icon_corner_bag.png');
  }
  if (
    value.includes('GUARD') ||
    value.includes('LORD') ||
    value.includes('GENERAL') ||
    value === 'DOGOF_WAR' ||
    value === 'SERGEANT'
  ) {
    return assetUrl('/images/corner_icons/ea_icon_corner_rvr.png');
  }

  return null;
};

export const creatureTitleLabel = (title: CreatureTitle): string => {
  if (title === CreatureTitle.None) {
    return '';
  }

  return (title as string)
    .split('_')
    .flatMap((word) => {
      // A handful of source enum values glue "OF" onto the previous word
      // (e.g. ALTAROF_KHAINE_GUARD, DOGOF_WAR) - split those back apart.
      if (word.length > 2 && word.endsWith('OF')) {
        return [word.slice(0, -2), 'OF'];
      }
      return [word];
    })
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};
