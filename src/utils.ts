import { Career } from './types';

export const careerIcon = (career: Career): string => {
  switch (career) {
    case Career.Archmage:
      return '/images/icons/archmage.png';
    case Career.Blackguard:
      return '/images/icons/black-guard.png';
    case Career.BlackOrc:
      return '/images/icons/black-orc.png';
    case Career.BrightWizard:
      return '/images/icons/bright-wizard.png';
    case Career.Choppa:
      return '/images/icons/choppa.png';
    case Career.Chosen:
      return '/images/icons/chosen.png';
    case Career.Disciple:
      return '/images/icons/disciple-of-khaine.png';
    case Career.Engineer:
      return '/images/icons/engineer.png';
    case Career.Ironbreaker:
      return '/images/icons/ironbreaker.png';
    case Career.Knight:
      return '/images/icons/knight-of-the-blazing-sun.png';
    case Career.Magus:
      return '/images/icons/magus.png';
    case Career.Marauder:
      return '/images/icons/marauder.png';
    case Career.RunePriest:
      return '/images/icons/rune-priest.png';
    case Career.ShadowWarrior:
      return '/images/icons/shadow-warrior.png';
    case Career.Shaman:
      return '/images/icons/shaman.png';
    case Career.Slayer:
      return '/images/icons/slayer.png';
    case Career.Sorcerer:
      return '/images/icons/sorcerer.png';
    case Career.SquigHerder:
      return '/images/icons/squig-herder.png';
    case Career.Swordmaster:
      return '/images/icons/sword-master.png';
    case Career.WarriorPriest:
      return '/images/icons/warrior-priest.png';
    case Career.WhiteLion:
      return '/images/icons/white-lion.png';
    case Career.WitchElf:
      return '/images/icons/witch-elf.png';
    case Career.WitchHunter:
      return '/images/icons/witch-hunter.png';
    case Career.Zealot:
      return '/images/icons/zealot.png';
    default:
      return '/images/icons/hidden.png';
  }
};

export const variablesFromCursor = (
  type: 'after' | 'before',
  cursor: string,
  perPage: number
): {
  after: string | undefined;
  before: string | undefined;
  first: number | undefined;
  last: number | undefined;
} => {
  if (type === 'after')
    return {
      after: cursor,
      before: undefined,
      first: perPage,
      last: undefined,
    };

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
  ];

  if (statIsPercentage.includes(stat)) {
    return '%';
  }
};
