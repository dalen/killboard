import { Career } from '@/__generated__/graphql';

export type ScenarioRole = 'Tank' | 'Melee DPS' | 'Ranged DPS' | 'Healer';

export const scenarioRoleOrder: ScenarioRole[] = [
  'Tank',
  'Melee DPS',
  'Ranged DPS',
  'Healer',
];

export const scenarioCareerRoles: Record<Career, ScenarioRole> = {
  [Career.Archmage]: 'Healer',
  [Career.BlackGuard]: 'Tank',
  [Career.BlackOrc]: 'Tank',
  [Career.BrightWizard]: 'Ranged DPS',
  [Career.Choppa]: 'Melee DPS',
  [Career.Chosen]: 'Tank',
  [Career.DiscipleOfKhaine]: 'Healer',
  [Career.Engineer]: 'Ranged DPS',
  [Career.IronBreaker]: 'Tank',
  [Career.KnightOfTheBlazingSun]: 'Tank',
  [Career.Magus]: 'Ranged DPS',
  [Career.Marauder]: 'Melee DPS',
  [Career.RunePriest]: 'Healer',
  [Career.ShadowWarrior]: 'Ranged DPS',
  [Career.Shaman]: 'Healer',
  [Career.Slayer]: 'Melee DPS',
  [Career.Sorcerer]: 'Ranged DPS',
  [Career.SquigHerder]: 'Ranged DPS',
  [Career.SwordMaster]: 'Tank',
  [Career.WarriorPriest]: 'Healer',
  [Career.WhiteLion]: 'Melee DPS',
  [Career.WitchElf]: 'Melee DPS',
  [Career.WitchHunter]: 'Melee DPS',
  [Career.Zealot]: 'Healer',
};

export const scenarioCareerName = (career: Career): string =>
  career
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
