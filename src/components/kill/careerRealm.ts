import { Career } from '@/__generated__/graphql';

const ORDER_CAREERS = new Set<Career>([
  Career.Archmage,
  Career.BrightWizard,
  Career.Engineer,
  Career.IronBreaker,
  Career.KnightOfTheBlazingSun,
  Career.RunePriest,
  Career.ShadowWarrior,
  Career.Slayer,
  Career.SwordMaster,
  Career.WarriorPriest,
  Career.WhiteLion,
  Career.WitchHunter,
]);

export const getCareerRealm = (career: Career): 'order' | 'destruction' =>
  ORDER_CAREERS.has(career) ? 'order' : 'destruction';
