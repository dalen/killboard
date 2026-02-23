import L from 'leaflet';
import { memoize } from 'lodash';

const MAP_ICON_BASE_URL = 'https://armory.returnofreckoning.com/map_icon';

const MAP_ICON_SIZES: Record<string, { width: number; height: number }> = {
  AltdorfBrightWizCollege: { width: 74, height: 102 },
  AltdorfEmperorsPalace: { width: 80, height: 160 },
  AltdorfMassTransit: { width: 46, height: 36 },
  AltdorfTempleOfSigmar: { width: 111, height: 124 },
  Arrow1: { width: 49, height: 88 },
  Arrow2: { width: 22, height: 38 },
  Auctioneer: { width: 30, height: 34 },
  'BIG-RVR-Hot-Spot': { width: 39, height: 38 },
  'Blimp-Dwarf': { width: 53, height: 44 },
  'Blimp-Greenskin': { width: 45, height: 44 },
  BombDestruction: { width: 30, height: 34 },
  BombNeutral: { width: 30, height: 34 },
  BombOrder: { width: 30, height: 34 },
  'CaveEntrance-Large-Left': { width: 30, height: 33 },
  'CaveEntrance-Large-Right': { width: 30, height: 33 },
  'CaveEntrance-Small-Left': { width: 26, height: 29 },
  'CaveEntrance-Small-Right': { width: 26, height: 29 },
  'ChaosNorseShip-Left': { width: 53, height: 60 },
  'ChaosNorseShip-Right': { width: 53, height: 60 },
  ChaosNorseTown: { width: 63, height: 62 },
  ChaosPortal: { width: 51, height: 50 },
  ChaosSymbol: { width: 48, height: 34 },
  Circle1: { width: 77, height: 84 },
  Circle2: { width: 91, height: 88 },
  Circle3: { width: 112, height: 96 },
  Circle4: { width: 159, height: 144 },
  Circle5: { width: 217, height: 194 },
  CircleMarkerBlue: { width: 17, height: 17 },
  CircleMarkerYellow: { width: 21, height: 21 },
  'Convoys-Destruction-01': { width: 32, height: 34 },
  'Convoys-Destruction-02': { width: 32, height: 34 },
  'Convoys-Order-01': { width: 32, height: 34 },
  'Convoys-Order-02': { width: 32, height: 34 },
  Crafting: { width: 27, height: 27 },
  'DarkElfShip-Right': { width: 62, height: 71 },
  DarkElfBlackArk2: { width: 202, height: 226 },
  DarkElfCapturedManor: { width: 53, height: 75 },
  DarkElfFortification: { width: 55, height: 48 },
  DarkElfLargeCamp: { width: 50, height: 47 },
  DarkElfCapturedVillage: { width: 48, height: 78 },
  'DarkElfShip-Left': { width: 62, height: 71 },
  DarkElfSmallCamp: { width: 46, height: 38 },
  DarkElfSymbol: { width: 37, height: 39 },
  DestroyedTower: { width: 27, height: 31 },
  DestructionKeep: { width: 42, height: 43 },
  'DestructionKeep-UnderAttack': { width: 42, height: 43 },
  DestructionPlayer: { width: 17, height: 17 },
  'DiamondMarkerSilver-Small': { width: 12, height: 11 },
  DoomfistCrator: { width: 78, height: 68 },
  Dungeon: { width: 32, height: 36 },
  DungeonBastionStair: { width: 61, height: 69 },
  DungeonDragonbackPass: { width: 37, height: 54 },
  DungeonGunbad: { width: 67, height: 75 },
  DungeonHuntersVale: { width: 83, height: 49 },
  DwarfHouse: { width: 37, height: 37 },
  'DwarfIronclad-Left': { width: 67, height: 47 },
  'DwarfIronclad-Right': { width: 67, height: 47 },
  DwarfStatue: { width: 30, height: 49 },
  DwarfTavern: { width: 37, height: 36 },
  DwarfTower: { width: 32, height: 36 },
  DwarfTrainStation: { width: 44, height: 44 },
  DyeMerchant: { width: 21, height: 22 },
  EmpireBuilding: { width: 39, height: 48 },
  EmpireCastle: { width: 61, height: 65 },
  'EmpireDock-Left': { width: 57, height: 45 },
  'EmpireDock-Right': { width: 57, height: 45 },
  EmpireHamlet: { width: 48, height: 65 },
  EmpireMonastary: { width: 47, height: 60 },
  EmpireSigmarStatue: { width: 30, height: 43 },
  EmpireTower: { width: 32, height: 60 },
  EmpireTown: { width: 56, height: 83 },
  EmpireWindmill: { width: 43, height: 55 },
  EquipmentUpgrade: { width: 32, height: 32 },
  FlagDestruction: { width: 28, height: 33 },
  'FlagDestruction-Burning': { width: 28, height: 33 },
  'FlagDestruction-Glowing': { width: 30, height: 35 },
  'FlagDestruction-Locked': { width: 28, height: 33 },
  'FlagDestruction-LockedAndGlowing': { width: 30, height: 35 },
  'FlagDestruction-Disabled': { width: 28, height: 33 },
  FlagNeutral: { width: 28, height: 33 },
  'FlagNeutral-Burning': { width: 28, height: 33 },
  'FlagNeutral-Locked': { width: 28, height: 33 },
  FlagOrder: { width: 28, height: 33 },
  'FlagOrder-Burning': { width: 28, height: 33 },
  'FlagOrder-Glowing': { width: 29, height: 35 },
  'FlagOrder-Locked': { width: 28, height: 33 },
  'FlagOrder-LockedAndGlowing': { width: 29, height: 35 },
  'FlagOrder-Disabled': { width: 28, height: 33 },
  FlagOverlay: { width: 20, height: 27 },
  FlagTK: { width: 30, height: 42 },
  'FlagTK-Burning': { width: 30, height: 42 },
  Forest: { width: 37, height: 40 },
  GardenField: { width: 55, height: 32 },
  GatesOfEkrund: { width: 92, height: 74 },
  GenericPlayer: { width: 17, height: 17 },
  GoblinSiegeFactory: { width: 47, height: 81 },
  Graveyard: { width: 37, height: 39 },
  Groupmate: { width: 17, height: 17 },
  GuildHall: { width: 50, height: 50 },
  GuildStandard: { width: 29, height: 34 },
  GutterArrow: { width: 11, height: 9 },
  HighElfCity: { width: 52, height: 90 },
  'HighElfDock-Left': { width: 71, height: 66 },
  'HighElfDock-Right': { width: 71, height: 66 },
  HighElfFortification: { width: 55, height: 55 },
  HighElfLargeCamp: { width: 47, height: 42 },
  HighElfManor: { width: 52, height: 75 },
  HighElfMenhir: { width: 25, height: 51 },
  'HighElfShips-Left': { width: 69, height: 54 },
  'HighElfShips-Right': { width: 69, height: 54 },
  HighElfShrine: { width: 27, height: 36 },
  HighElfSmallCamp: { width: 40, height: 31 },
  HighElfRuins: { width: 60, height: 44 },
  HighElfTower: { width: 35, height: 72 },
  HighElfVillage: { width: 44, height: 75 },
  InevitableCityBreakingGrounds: { width: 84, height: 41 },
  InevitableCityEternalCitadel: { width: 68, height: 52 },
  InevitableCityMonolith: { width: 57, height: 65 },
  InevitableCitySacellum: { width: 163, height: 152 },
  InevitableCitySoulForge: { width: 66, height: 66 },
  InevitableCityViperPit: { width: 78, height: 68 },
  InevitableCityWyvernsRoost: { width: 80, height: 69 },
  'Influence-Teal': { width: 32, height: 32 },
  'Influence-Teal-ROLLOVER': { width: 32, height: 32 },
  'KeepDefended-Orange': { width: 42, height: 47 },
  'KeepDefended-Red': { width: 42, height: 47 },
  'KeepDefended-Yellow': { width: 42, height: 47 },
  'KeepDifficulty-1-star': { width: 46, height: 9 },
  'KeepDifficulty-2-star': { width: 46, height: 9 },
  'KeepDifficulty-3-star': { width: 46, height: 9 },
  'KeepDifficulty-4-star': { width: 46, height: 9 },
  'KeepDifficulty-5-star': { width: 46, height: 9 },
  KeepDoor: { width: 28, height: 28 },
  'Keep-Dominated': { width: 46, height: 47 },
  'Keep-Grayed': { width: 42, height: 43 },
  KillCollector: { width: 26, height: 31 },
  LastNames: { width: 30, height: 19 },
  'LastNames-Large': { width: 32, height: 32 },
  Librarian: { width: 30, height: 31 },
  Mail: { width: 29, height: 25 },
  'Mail-Large': { width: 32, height: 32 },
  MurderballDestruction: { width: 28, height: 31 },
  MurderballNeutral: { width: 28, height: 31 },
  MurderballOrder: { width: 28, height: 31 },
  NextZoneArrowDown: { width: 24, height: 32 },
  NextZoneArrowLeft: { width: 32, height: 24 },
  NextZoneArrowRight: { width: 32, height: 24 },
  NextZoneArrowUp: { width: 24, height: 32 },
  Note: { width: 18, height: 20 },
  'NPC-AuctionHouse': { width: 30, height: 34 },
  'NPC-Binder': { width: 28, height: 29 },
  'NPC-CraftingTrainer': { width: 27, height: 27 },
  'NPC-GuildRegistrar': { width: 21, height: 24 },
  'NPC-GuildRegistrar-Large': { width: 32, height: 32 },
  'NPC-Healer': { width: 24, height: 25 },
  'NPC-Healer-Large': { width: 32, height: 32 },
  'NPC-Merchant': { width: 30, height: 31 },
  'NPC-RvR': { width: 26, height: 34 },
  'NPC-Scenario': { width: 30, height: 30 },
  'NPC-TrainerActive': { width: 34, height: 32 },
  'NPC-TrainerInactive': { width: 34, height: 32 },
  'NPC-Travel': { width: 35, height: 36 },
  'Objective-OLD': { width: 24, height: 24 },
  OgreMarker: { width: 60, height: 44 },
  'OrcBarge-Left': { width: 61, height: 41 },
  'OrcBarge-Right': { width: 61, height: 41 },
  OrcBuilding: { width: 52, height: 52 },
  OrcDragonSkeleton: { width: 57, height: 38 },
  OrcGateway: { width: 47, height: 37 },
  OrcHut: { width: 41, height: 34 },
  'OrcHut-Small': { width: 34, height: 35 },
  BeastmenHerdstone: { width: 43, height: 46 },
  OrderKeep: { width: 42, height: 43 },
  'OrderKeep-UnderAttack': { width: 42, height: 43 },
  OrderPlayer: { width: 17, height: 17 },
  Oval1: { width: 53, height: 84 },
  Oval2: { width: 119, height: 72 },
  Oval3: { width: 141, height: 97 },
  Oval4: { width: 185, height: 107 },
  Oval5: { width: 157, height: 258 },
  PeasantHouse: { width: 43, height: 34 },
  PlayerArrow: { width: 30, height: 36 },
  'PlayerArrow-BigMapPulse': { width: 30, height: 36 },
  'Player-LFG': { width: 30, height: 24 },
  PlayerCircleDestruction: { width: 17, height: 17 },
  PlayerCircleDestructionLite: { width: 17, height: 17 },
  PlayerCircleGeneric: { width: 17, height: 17 },
  PlayerCircleGenericLite: { width: 17, height: 17 },
  PlayerCircleGroupmate: { width: 17, height: 17 },
  PlayerCircleGroupmateLite: { width: 17, height: 17 },
  PlayerCircleOrder: { width: 17, height: 17 },
  PlayerCircleOrderLite: { width: 17, height: 17 },
  Portal: { width: 38, height: 38 },
  ProgressBarAlpha: { width: 41, height: 7 },
  ProgressBarTintable: { width: 41, height: 7 },
  PQ: { width: 37, height: 29 },
  'PQ-Active': { width: 35, height: 28 },
  'PQ-Large': { width: 32, height: 32 },
  PQLoot: { width: 42, height: 43 },
  'PQLoot-Large': { width: 32, height: 32 },
  PQResetting: { width: 37, height: 29 },
  QuestActive: { width: 32, height: 32 },
  'QuestActive-ROLLOVER': { width: 32, height: 32 },
  'QuestAvailable-Green': { width: 32, height: 32 },
  'QuestAvailable-LiveEvent': { width: 32, height: 32 },
  'QuestAvailable-Repeatable': { width: 32, height: 32 },
  'QuestCompleted-Gold': { width: 32, height: 32 },
  'QuestCompleted-Gold-ROLLOVER': { width: 32, height: 32 },
  QuestEpic: { width: 32, height: 32 },
  'QuestEpic-ROLLOVER': { width: 32, height: 32 },
  QuestGroup: { width: 32, height: 32 },
  'QuestGroup-ROLLOVER': { width: 32, height: 32 },
  'QuestPending-Grey': { width: 32, height: 32 },
  'QuestLocal-White': { width: 32, height: 32 },
  'QuestLocal-White-ROLLOVER': { width: 32, height: 32 },
  QuestMovement: { width: 32, height: 32 },
  'QuestMovement-ROLLOVER': { width: 32, height: 32 },
  QuestRVR: { width: 32, height: 32 },
  QuestRVRGroup: { width: 32, height: 32 },
  'QuestRVRGroup-ROLLOVER': { width: 32, height: 32 },
  QuestRVRkill: { width: 32, height: 32 },
  'QuestRVRkill-ROLLOVER': { width: 32, height: 32 },
  'QuestRVR-ROLLOVER': { width: 32, height: 32 },
  QuestTome: { width: 32, height: 32 },
  'QuestTome-ROLLOVER': { width: 32, height: 32 },
  RamOrder: { width: 39, height: 37 },
  RamDestruction: { width: 39, height: 37 },
  'RvR-Hotspot': { width: 31, height: 33 },
  'RvR-GenericBanner': { width: 39, height: 49 },
  'Shout-Attack': { width: 31, height: 29 },
  'Shout-DefendMe': { width: 17, height: 21 },
  'Shout-HealMe': { width: 22, height: 22 },
  'Shout-Healme-Large': { width: 32, height: 32 },
  'Shout-Incoming': { width: 23, height: 27 },
  'SiegeTarget-BombTarget': { width: 38, height: 38 },
  SkavenMarker: { width: 49, height: 47 },
  'Small-RVR-Hot-Spot': { width: 28, height: 28 },
  SunDial: { width: 33, height: 24 },
  SymbolBalance: { width: 44, height: 47 },
  SymbolBeerMug: { width: 44, height: 47 },
  SymbolBird: { width: 44, height: 47 },
  SymbolHorseshoe: { width: 44, height: 47 },
  SymbolShip: { width: 44, height: 47 },
  SymbolV: { width: 44, height: 47 },
  Tent: { width: 40, height: 29 },
  TreasureChest: { width: 50, height: 37 },
  Tree: { width: 38, height: 49 },
  VampireTower: { width: 65, height: 93 },
  Vault: { width: 30, height: 30 },
  Waypoint: { width: 27, height: 27 },
  'Waypoint-Large': { width: 32, height: 32 },
  WarcampOrc: { width: 41, height: 36 },
  WarcampChaos: { width: 41, height: 34 },
  WarcampDarkElf: { width: 47, height: 37 },
  WarcampDwarf: { width: 44, height: 36 },
  WarcampEmpire: { width: 45, height: 34 },
  WarcampHighElf: { width: 39, height: 35 },
  KarazAKarakFeastHall: { width: 72, height: 46 },
  KarazAKarakBank: { width: 36, height: 32 },
  KarazAKarakLift: { width: 54, height: 50 },
  KarazAKarakFlightMaster: { width: 46, height: 50 },
  KarazAKarakThrone: { width: 58, height: 40 },
  KarazAKarakAuctionHouse: { width: 54, height: 40 },
  KarazAKarakForge: { width: 56, height: 44 },
  KarazAKarakWarRoom: { width: 40, height: 50 },
  KarazAKarakTavern: { width: 68, height: 52 },
  KarazAKarakTrainStation: { width: 78, height: 58 },
  KarazAKarakEngineers: { width: 68, height: 68 },
  KarazAKarakMineJunction: { width: 76, height: 58 },
  KarazAKarakCrypts: { width: 48, height: 62 },
  KarazAKarakCannonFoundry: { width: 96, height: 44 },
  KarazAKarakWarriorsStand: { width: 58, height: 60 },
  KarazAKarakLibrary: { width: 60, height: 40 },
  KarazAKarakTrainers: { width: 52, height: 38 },
  KarakEightPeaksTempleOfGork: { width: 36, height: 56 },
  KarakEightPeaksPortalDown: { width: 32, height: 62 },
  KarakEightPeaksArena: { width: 58, height: 58 },
  KarakEightPeaksThroneRoom: { width: 60, height: 60 },
  KarakEightPeaksMine: { width: 44, height: 44 },
  KarakEightPeaksPenz: { width: 52, height: 45 },
  KarakEightPeaksWeaponzHall: { width: 66, height: 38 },
  KarakEightPeaksHammerinHall: { width: 60, height: 44 },
  KarakEightPeaksShiniesHall: { width: 52, height: 42 },
  KarakEightPeaksPortalUp: { width: 32, height: 42 },
  KarakEightPeaksRatbreakerStand: { width: 64, height: 46 },
  KarakEightPeaksTrainers: { width: 46, height: 46 },
  KarakEightPeaksBank: { width: 50, height: 46 },
  CrownDarkBlue: { width: 42, height: 28 },
  CrownDarkPurple: { width: 42, height: 28 },
  CrownDarkGreen: { width: 42, height: 28 },
  CrownLightGreen: { width: 42, height: 28 },
  CrownLightBlue: { width: 42, height: 28 },
  CrownLightGold: { width: 42, height: 28 },
  CrownPink: { width: 42, height: 28 },
  CrownRed: { width: 42, height: 28 },
  CrownDarkGold: { width: 42, height: 28 },
};

const buildMapIconDetails = (slice: string, pointX: number, pointY: number) => {
  const size = MAP_ICON_SIZES[slice];

  return {
    url: `${MAP_ICON_BASE_URL}/${slice}`,
    width: size?.width ?? pointX * 2,
    height: size?.height ?? pointY * 2,
    pointX,
    pointY,
  };
};

export const mapIconDetails = (
  icon: number,
): {
  url: string;
  width: number;
  height: number;
  pointX: number;
  pointY: number;
} => {
  switch (icon) {
    case 0:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 1:
      return buildMapIconDetails('PlayerArrow', 14, 21);
    case 2:
      return buildMapIconDetails('PlayerCircleGroupmate', 8, 8);
    case 3:
      return buildMapIconDetails('QuestAvailable-Green', 15, 15);
    case 4:
      return buildMapIconDetails('QuestPending-Grey', 15, 15);
    case 5:
      return buildMapIconDetails('QuestCompleted-Gold', 15, 15);
    case 6:
      return buildMapIconDetails('Influence-Teal', 15, 15);
    case 7:
      return buildMapIconDetails('QuestPending-Grey', 15, 15);
    case 8:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 9:
      return buildMapIconDetails('Objective-OLD', 12, 12);
    case 10:
      return buildMapIconDetails('PlayerCircleOrder', 8, 8);
    case 11:
      return buildMapIconDetails('PlayerCircleDestruction', 8, 8);
    case 12:
      return buildMapIconDetails('Objective-OLD', 12, 12);
    case 13:
      return buildMapIconDetails('Objective-OLD', 12, 12);
    case 14:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 15:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 16:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 17:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 18:
      return buildMapIconDetails('KillCollector', 14, 15);
    case 19:
      return buildMapIconDetails('NPC-Merchant', 16, 15);
    case 20:
      return buildMapIconDetails('NPC-TrainerActive', 16, 15);
    case 21:
      return buildMapIconDetails('NPC-Scenario', 15, 15);
    case 22:
      return buildMapIconDetails('NPC-AuctionHouse', 23, 16);
    case 23:
      return buildMapIconDetails('NPC-Travel', 17, 17);
    case 24:
      return buildMapIconDetails('Vault', 14, 14);
    case 25:
      return buildMapIconDetails('Librarian', 15, 15);
    case 26:
      return buildMapIconDetails('NPC-GuildRegistrar', 10, 12);
    case 27:
      return buildMapIconDetails('NPC-Healer', 11, 12);
    case 28:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 29:
      return buildMapIconDetails('QuestLocal-White', 15, 15);
    case 30:
      return buildMapIconDetails('QuestGroup', 15, 15);
    case 31:
      return buildMapIconDetails('QuestMovement', 15, 15);
    case 32:
      return buildMapIconDetails('QuestEpic', 15, 15);
    case 33:
      return buildMapIconDetails('QuestTome', 15, 15);
    case 34:
      return buildMapIconDetails('NPC-Binder', 13, 14);
    case 35:
      return buildMapIconDetails('NPC-RvR', 12, 15);
    case 36:
      return buildMapIconDetails('RvR-Hotspot', 15, 16);
    case 37:
      return buildMapIconDetails('SiegeTarget-BombTarget', 18, 18);
    case 38:
      return buildMapIconDetails('Player-LFG', 14, 11);
    case 39:
      return buildMapIconDetails('GutterArrow', 5, 5);
    case 40:
      return buildMapIconDetails('BIG-RVR-Hot-Spot', 19, 17);
    case 41:
      return buildMapIconDetails('Small-RVR-Hot-Spot', 13, 13);
    case 42:
      return buildMapIconDetails('NPC-GuildRegistrar-Large', 15, 15);
    case 43:
      return buildMapIconDetails('NPC-Healer-Large', 15, 15);
    case 44:
      return buildMapIconDetails('Shout-Healme-Large', 15, 15);
    case 45:
      return buildMapIconDetails('Waypoint', 13, 13);
    case 46:
      return buildMapIconDetails('DyeMerchant', 10, 11);
    case 47:
      return buildMapIconDetails('GuildStandard', 17, 17);
    case 48:
      return buildMapIconDetails('Mail', 14, 12);
    case 49:
      return buildMapIconDetails('LastNames', 15, 9);
    case 50:
      return buildMapIconDetails('PlayerCircleOrder', 8, 8);
    case 51:
      return buildMapIconDetails('PlayerCircleDestruction', 8, 8);
    case 55:
      return buildMapIconDetails('PlayerCircleDestruction', 8, 8);
    case 56:
      return buildMapIconDetails('PlayerCircleDestructionLite', 8, 8);
    case 57:
      return buildMapIconDetails('PlayerCircleOrder', 8, 8);
    case 58:
      return buildMapIconDetails('PlayerCircleOrderLite', 8, 8);
    case 59:
      return buildMapIconDetails('PlayerCircleGroupmate', 8, 8);
    case 60:
      return buildMapIconDetails('PlayerCircleGroupmateLite', 8, 8);
    case 61:
      return buildMapIconDetails('PlayerCircleGeneric', 8, 8);
    case 62:
      return buildMapIconDetails('PlayerCircleGenericLite', 8, 8);
    case 63:
      return buildMapIconDetails('QuestAvailable-Repeatable', 15, 15);
    case 64:
      return buildMapIconDetails('NPC-CraftingTrainer', 13, 13);
    case 65:
      return buildMapIconDetails('Blimp-Dwarf', 25, 22);
    case 66:
      return buildMapIconDetails('Blimp-Greenskin', 22, 25);
    case 67:
      return buildMapIconDetails('QuestAvailable-LiveEvent', 15, 15);
    case 68:
      return buildMapIconDetails('EquipmentUpgrade', 15, 15);
    case 90:
      return buildMapIconDetails('FlagNeutral', 13, 16);
    case 91:
      return buildMapIconDetails('FlagOrder', 13, 16);
    case 92:
      return buildMapIconDetails('FlagDestruction', 13, 16);
    case 93:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 94:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 95:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 96:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 97:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 98:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 99:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 100:
      return buildMapIconDetails('FlagNeutral', 13, 16);
    case 101:
      return buildMapIconDetails('FlagOrder', 13, 16);
    case 102:
      return buildMapIconDetails('FlagDestruction', 13, 16);
    case 103:
      return buildMapIconDetails('OrderKeep', 20, 21);
    case 104:
      return buildMapIconDetails('DestructionKeep', 20, 21);
    case 105:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 106:
      return buildMapIconDetails('GenericPlayer', 8, 8);
    case 107:
      return buildMapIconDetails('OrderKeep-UnderAttack', 20, 21);
    case 108:
      return buildMapIconDetails('DestructionKeep-UnderAttack', 20, 21);
    case 110:
      return buildMapIconDetails('FlagNeutral-Burning', 13, 16);
    case 111:
      return buildMapIconDetails('FlagOrder-Burning', 13, 16);
    case 112:
      return buildMapIconDetails('FlagDestruction-Burning', 13, 16);
    case 113:
      return buildMapIconDetails('FlagOrder-Locked', 13, 16);
    case 114:
      return buildMapIconDetails('FlagDestruction-Locked', 13, 16);
    case 115:
      return buildMapIconDetails('RvR-GenericBanner', 19, 23);
    case 116:
      return buildMapIconDetails('FlagOverlay', 9, 12);
    case 117:
      return buildMapIconDetails('FlagOrder-Glowing', 14, 17);
    case 118:
      return buildMapIconDetails('FlagDestruction-Glowing', 14, 16);
    case 119:
      return buildMapIconDetails('FlagOrder-LockedAndGlowing', 14, 16);
    case 120:
      return buildMapIconDetails('FlagDestruction-LockedAndGlowing', 14, 16);
    case 121:
      return buildMapIconDetails('FlagNeutral-Locked', 13, 16);
    case 122:
      return buildMapIconDetails('FlagOrder-Disabled', 13, 16);
    case 123:
      return buildMapIconDetails('FlagDestruction-Disabled', 13, 16);
    case 124:
      return buildMapIconDetails('FlagTK', 14, 21);
    case 125:
      return buildMapIconDetails('FlagTK-Burning', 14, 21);
    case 1002:
      return buildMapIconDetails('DwarfTower', 15, 22);
    case 1003:
      return buildMapIconDetails('DwarfHouse', 18, 24);
    case 1005:
      return buildMapIconDetails('DwarfStatue', 14, 35);
    case 1006:
      return buildMapIconDetails('DwarfTavern', 18, 20);
    case 1007:
      return buildMapIconDetails('DwarfIronclad-Right', 33, 25);
    case 1008:
      return buildMapIconDetails('DwarfIronclad-Left', 33, 25);
    case 1009:
      return buildMapIconDetails('DwarfTrainStation', 22, 22);
    case 1020:
      return buildMapIconDetails('OrcHut', 19, 17);
    case 1021:
      return buildMapIconDetails('OrcHut-Small', 17, 18);
    case 1022:
      return buildMapIconDetails('OrcGateway', 23, 26);
    case 1023:
      return buildMapIconDetails('OrcBarge-Right', 30, 26);
    case 1024:
      return buildMapIconDetails('OrcBarge-Left', 32, 28);
    case 1025:
      return buildMapIconDetails('OrcDragonSkeleton', 28, 22);
    case 1026:
      return buildMapIconDetails('BeastmenHerdstone', 21, 22);
    case 1027:
      return buildMapIconDetails('OrcBuilding', 26, 29);
    case 1030:
      return buildMapIconDetails('EmpireTown', 29, 64);
    case 1031:
      return buildMapIconDetails('EmpireBuilding', 19, 33);
    case 1032:
      return buildMapIconDetails('EmpireTower', 16, 47);
    case 1033:
      return buildMapIconDetails('EmpireWindmill', 21, 41);
    case 1034:
      return buildMapIconDetails('EmpireMonastary', 23, 43);
    case 1035:
      return buildMapIconDetails('EmpireCastle', 29, 43);
    case 1036:
      return buildMapIconDetails('EmpireSigmarStatue', 16, 20);
    case 1037:
      return buildMapIconDetails('EmpireDock-Left', 31, 22);
    case 1038:
      return buildMapIconDetails('EmpireDock-Right', 28, 20);
    case 1039:
      return buildMapIconDetails('EmpireHamlet', 24, 50);
    case 1040:
      return buildMapIconDetails('ChaosNorseTown', 33, 41);
    case 1041:
      return buildMapIconDetails('ChaosPortal', 22, 25);
    case 1042:
      return buildMapIconDetails('ChaosNorseShip-Right', 24, 36);
    case 1043:
      return buildMapIconDetails('ChaosNorseShip-Left', 28, 36);
    case 1044:
      return buildMapIconDetails('ChaosSymbol', 23, 16);
    case 1050:
      return buildMapIconDetails('WarcampOrc', 21, 21);
    case 1051:
      return buildMapIconDetails('WarcampDwarf', 20, 23);
    case 1052:
      return buildMapIconDetails('WarcampChaos', 20, 19);
    case 1053:
      return buildMapIconDetails('WarcampEmpire', 21, 20);
    case 1054:
      return buildMapIconDetails('WarcampHighElf', 21, 20);
    case 1055:
      return buildMapIconDetails('WarcampDarkElf', 20, 20);
    case 1060:
      return buildMapIconDetails('CaveEntrance-Large-Right', 12, 17);
    case 1061:
      return buildMapIconDetails('CaveEntrance-Large-Left', 15, 16);
    case 1062:
      return buildMapIconDetails('CaveEntrance-Small-Right', 11, 15);
    case 1063:
      return buildMapIconDetails('CaveEntrance-Small-Left', 11, 16);
    case 1064:
      return buildMapIconDetails('Forest', 17, 22);
    case 1065:
      return buildMapIconDetails('Tent', 20, 15);
    case 1066:
      return buildMapIconDetails('PeasantHouse', 20, 17);
    case 1067:
      return buildMapIconDetails('DestroyedTower', 13, 16);
    case 1068:
      return buildMapIconDetails('SunDial', 15, 12);
    case 1069:
      return buildMapIconDetails('GardenField', 23, 16);
    case 1070:
      return buildMapIconDetails('Graveyard', 18, 19);
    case 1071:
      return buildMapIconDetails('Tree', 19, 25);
    case 1072:
      return buildMapIconDetails('TreasureChest', 23, 17);
    case 1073:
      return buildMapIconDetails('Portal', 18, 19);
    case 1074:
      return buildMapIconDetails('Dungeon', 15, 18);
    case 1075:
      return buildMapIconDetails('GuildHall', 24, 24);
    case 1076:
      return buildMapIconDetails('OgreMarker', 30, 22);
    case 1077:
      return buildMapIconDetails('SkavenMarker', 25, 24);
    case 1080:
      return buildMapIconDetails('VampireTower', 8, 10);
    case 1081:
      return buildMapIconDetails('GoblinSiegeFactory', 10, 8);
    case 1082:
      return buildMapIconDetails('DoomfistCrator', 10, 8);
    case 1083:
      return buildMapIconDetails('GatesOfEkrund', 10, 8);
    case 1090:
      return buildMapIconDetails('NextZoneArrowLeft', 15, 12);
    case 1091:
      return buildMapIconDetails('NextZoneArrowRight', 15, 12);
    case 1092:
      return buildMapIconDetails('NextZoneArrowDown', 12, 17);
    case 1093:
      return buildMapIconDetails('NextZoneArrowUp', 12, 17);
    case 1095:
      return buildMapIconDetails('MurderballDestruction', 13, 15);
    case 1096:
      return buildMapIconDetails('MurderballOrder', 13, 15);
    case 1097:
      return buildMapIconDetails('MurderballNeutral', 13, 15);
    case 1098:
      return buildMapIconDetails('MurderballNeutral', 13, 15);
    case 1099:
      return buildMapIconDetails('BombDestruction', 14, 19);
    case 1100:
      return buildMapIconDetails('BombOrder', 14, 19);
    case 1101:
      return buildMapIconDetails('BombNeutral', 14, 19);
    case 1102:
      return buildMapIconDetails('BombNeutral', 14, 19);
    case 1103:
      return buildMapIconDetails('BombDestruction', 14, 19);
    case 1104:
      return buildMapIconDetails('BombOrder', 14, 19);
    case 1105:
      return buildMapIconDetails('BombNeutral', 14, 19);
    case 1106:
      return buildMapIconDetails('BombNeutral', 14, 19);
    case 1116:
      return buildMapIconDetails('CircleMarkerYellow', 10, 10);
    case 1117:
      return buildMapIconDetails('CircleMarkerBlue', 8, 8);
    case 1118:
      return buildMapIconDetails('Note', 8, 9);
    case 1119:
      return buildMapIconDetails('DiamondMarkerSilver-Small', 6, 6);
    case 1130:
      return buildMapIconDetails('Circle1', 42, 43);
    case 1131:
      return buildMapIconDetails('Circle2', 46, 45);
    case 1132:
      return buildMapIconDetails('Circle3', 52, 48);
    case 1133:
      return buildMapIconDetails('Circle4', 82, 73);
    case 1134:
      return buildMapIconDetails('Circle5', 109, 93);
    case 1135:
      return buildMapIconDetails('Oval1', 25, 41);
    case 1136:
      return buildMapIconDetails('Oval2', 60, 34);
    case 1137:
      return buildMapIconDetails('Oval3', 69, 51);
    case 1138:
      return buildMapIconDetails('Oval4', 94, 52);
    case 1139:
      return buildMapIconDetails('Oval5', 82, 134);
    case 1140:
      return buildMapIconDetails('Arrow1', 25, 42);
    case 1141:
      return buildMapIconDetails('Arrow2', 11, 18);
    case 1180:
      return buildMapIconDetails('SymbolBalance', 22, 24);
    case 1181:
      return buildMapIconDetails('SymbolHorseshoe', 22, 22);
    case 1182:
      return buildMapIconDetails('SymbolBeerMug', 23, 23);
    case 1183:
      return buildMapIconDetails('SymbolShip', 22, 25);
    case 1184:
      return buildMapIconDetails('SymbolBird', 21, 24);
    case 1185:
      return buildMapIconDetails('SymbolV', 23, 24);
    case 1201:
      return buildMapIconDetails('HighElfDock-Left', 38, 33);
    case 1202:
      return buildMapIconDetails('HighElfDock-Right', 33, 33);
    case 1203:
      return buildMapIconDetails('HighElfShips-Left', 35, 29);
    case 1204:
      return buildMapIconDetails('HighElfShips-Right', 35, 29);
    case 1205:
      return buildMapIconDetails('HighElfSmallCamp', 18, 13);
    case 1206:
      return buildMapIconDetails('HighElfLargeCamp', 24, 22);
    case 1207:
      return buildMapIconDetails('HighElfCity', 27, 64);
    case 1208:
      return buildMapIconDetails('HighElfVillage', 20, 52);
    case 1209:
      return buildMapIconDetails('HighElfManor', 23, 50);
    case 1210:
      return buildMapIconDetails('HighElfRuins', 28, 26);
    case 1211:
      return buildMapIconDetails('HighElfFortification', 29, 36);
    case 1212:
      return buildMapIconDetails('HighElfMenhir', 13, 26);
    case 1213:
      return buildMapIconDetails('HighElfShrine', 14, 18);
    case 1214:
      return buildMapIconDetails('HighElfTower', 18, 70);
    case 1251:
      return buildMapIconDetails('DarkElfSmallCamp', 20, 23);
    case 1252:
      return buildMapIconDetails('DarkElfFortification', 26, 30);
    case 1253:
      return buildMapIconDetails('DarkElfLargeCamp', 22, 28);
    case 1254:
      return buildMapIconDetails('DarkElfCapturedManor', 25, 54);
    case 1255:
      return buildMapIconDetails('DarkElfCapturedVillage', 20, 54);
    case 1256:
      return buildMapIconDetails('DarkElfShip-Left', 32, 45);
    case 1257:
      return buildMapIconDetails('DarkElfShip-Right', 29, 47);
    case 1258:
      return buildMapIconDetails('DarkElfBlackArk2', 94, 133);
    case 1259:
      return buildMapIconDetails('DarkElfSymbol', 18, 19);
    case 1301:
      return buildMapIconDetails('QuestRVRGroup', 15, 15);
    case 1302:
      return buildMapIconDetails('QuestRVRGroup-ROLLOVER', 15, 15);
    case 1303:
      return buildMapIconDetails('QuestRVR', 15, 15);
    case 1304:
      return buildMapIconDetails('QuestRVR-ROLLOVER', 15, 15);
    case 1305:
      return buildMapIconDetails('QuestRVRkill', 15, 15);
    case 1306:
      return buildMapIconDetails('QuestRVRkill-ROLLOVER', 15, 15);
    case 1311:
      return buildMapIconDetails('PQLoot', 20, 21);
    case 1312:
      return buildMapIconDetails('PQResetting', 18, 14);
    case 1313:
      return buildMapIconDetails('PQ', 18, 14);
    case 1314:
      return buildMapIconDetails('PQ-Active', 17, 14);
    case 1400:
      return buildMapIconDetails('AltdorfTempleOfSigmar', 52, 67);
    case 1401:
      return buildMapIconDetails('AltdorfMassTransit', 23, 19);
    case 1402:
      return buildMapIconDetails('AltdorfEmperorsPalace', 40, 83);
    case 1403:
      return buildMapIconDetails('AltdorfBrightWizCollege', 38, 62);
    case 1426:
      return buildMapIconDetails('InevitableCityMonolith', 27, 38);
    case 1427:
      return buildMapIconDetails('InevitableCitySoulForge', 32, 29);
    case 1428:
      return buildMapIconDetails('InevitableCitySacellum', 75, 76);
    case 1429:
      return buildMapIconDetails('InevitableCityBreakingGrounds', 42, 20);
    case 1430:
      return buildMapIconDetails('InevitableCityWyvernsRoost', 40, 34);
    case 1431:
      return buildMapIconDetails('InevitableCityViperPit', 39, 34);
    case 1432:
      return buildMapIconDetails('InevitableCityEternalCitadel', 31, 30);
    case 1452:
      return buildMapIconDetails('Convoys-Order-01', 16, 17);
    case 1453:
      return buildMapIconDetails('Convoys-Destruction-01', 16, 17);
    case 1454:
      return buildMapIconDetails('Convoys-Order-02', 16, 17);
    case 1455:
      return buildMapIconDetails('Convoys-Destruction-02', 16, 17);
    case 1500:
      return buildMapIconDetails('Keep-Dominated', 22, 23);
    case 1501:
      return buildMapIconDetails('KeepDoor', 14, 14);
    case 1502:
      return buildMapIconDetails('KeepDefended-Yellow', 19, 26);
    case 1503:
      return buildMapIconDetails('KeepDefended-Orange', 19, 26);
    case 1504:
      return buildMapIconDetails('KeepDefended-Red', 19, 26);
    case 1505:
      return buildMapIconDetails('ProgressBarAlpha', 20, 4);
    case 1506:
      return buildMapIconDetails('ProgressBarTintable', 20, 4);
    case 1507:
      return buildMapIconDetails('KeepDifficulty-1-star', 22, 4);
    case 1508:
      return buildMapIconDetails('KeepDifficulty-2-star', 22, 4);
    case 1509:
      return buildMapIconDetails('KeepDifficulty-3-star', 22, 4);
    case 1510:
      return buildMapIconDetails('KeepDifficulty-4-star', 22, 4);
    case 1511:
      return buildMapIconDetails('KeepDifficulty-5-star', 22, 4);
    case 1700:
      return buildMapIconDetails('OrderNumberedCircle01', 15, 15);
    case 1701:
      return buildMapIconDetails('OrderNumberedCircle02', 15, 15);
    case 1702:
      return buildMapIconDetails('OrderNumberedCircle03', 15, 15);
    case 1703:
      return buildMapIconDetails('OrderNumberedCircle04', 15, 15);
    case 1704:
      return buildMapIconDetails('OrderNumberedCircle05', 15, 15);
    case 1705:
      return buildMapIconDetails('OrderNumberedCircle06', 15, 15);
    case 1706:
      return buildMapIconDetails('OrderNumberedCircle07', 15, 15);
    case 1707:
      return buildMapIconDetails('OrderNumberedCircle08', 15, 15);
    case 1708:
      return buildMapIconDetails('OrderNumberedCircle09', 15, 15);
    case 1709:
      return buildMapIconDetails('DestructionNumberedCircle01', 15, 15);
    case 1710:
      return buildMapIconDetails('DestructionNumberedCircle02', 15, 15);
    case 1711:
      return buildMapIconDetails('DestructionNumberedCircle03', 15, 15);
    case 1712:
      return buildMapIconDetails('DestructionNumberedCircle04', 15, 15);
    case 1713:
      return buildMapIconDetails('DestructionNumberedCircle05', 15, 15);
    case 1714:
      return buildMapIconDetails('DestructionNumberedCircle06', 15, 15);
    case 1715:
      return buildMapIconDetails('DestructionNumberedCircle07', 15, 15);
    case 1716:
      return buildMapIconDetails('DestructionNumberedCircle08', 15, 15);
    case 1717:
      return buildMapIconDetails('DestructionNumberedCircle09', 15, 15);
    case 1800:
      return buildMapIconDetails('RamOrder', 19, 17);
    case 1801:
      return buildMapIconDetails('RamDestruction', 19, 17);
    case 1850:
      return buildMapIconDetails('CrownDarkBlue', 21, 14);
    case 1851:
      return buildMapIconDetails('CrownDarkPurple', 21, 14);
    case 1852:
      return buildMapIconDetails('CrownDarkGreen', 21, 14);
    case 1853:
      return buildMapIconDetails('CrownLightGreen', 21, 14);
    case 1854:
      return buildMapIconDetails('CrownLightBlue', 21, 14);
    case 1855:
      return buildMapIconDetails('CrownLightGold', 21, 14);
    case 1856:
      return buildMapIconDetails('CrownPink', 21, 14);
    case 1857:
      return buildMapIconDetails('CrownRed', 21, 14);
    case 1858:
      return buildMapIconDetails('CrownDarkGold', 21, 14);
    case 2001:
      return buildMapIconDetails('DungeonHuntersVale', 41, 25);
    case 2002:
      return buildMapIconDetails('DungeonGunbad', 34, 38);
    case 2003:
      return buildMapIconDetails('DungeonBastionStair', 30, 35);
    case 2004:
      return buildMapIconDetails('DungeonDragonbackPass', 18, 27);
    case 2100:
      return buildMapIconDetails('KarazAKarakFeastHall', 36, 26);
    case 2101:
      return buildMapIconDetails('KarazAKarakBank', 18, 16);
    case 2102:
      return buildMapIconDetails('KarazAKarakLift', 27, 25);
    case 2103:
      return buildMapIconDetails('KarazAKarakFlightMaster', 0, 50);
    case 2104:
      return buildMapIconDetails('KarazAKarakThrone', 29, 20);
    case 2105:
      return buildMapIconDetails('KarazAKarakAuctionHouse', 27, 20);
    case 2106:
      return buildMapIconDetails('KarazAKarakForge', 28, 22);
    case 2107:
      return buildMapIconDetails('KarazAKarakWarRoom', 20, 25);
    case 2108:
      return buildMapIconDetails('KarazAKarakTavern', 34, 26);
    case 2109:
      return buildMapIconDetails('KarazAKarakTrainStation', 39, 29);
    case 2110:
      return buildMapIconDetails('KarazAKarakEngineers', 34, 34);
    case 2111:
      return buildMapIconDetails('KarazAKarakMineJunction', 38, 29);
    case 2112:
      return buildMapIconDetails('KarazAKarakCrypts', 24, 31);
    case 2113:
      return buildMapIconDetails('KarazAKarakCannonFoundry', 48, 22);
    case 2114:
      return buildMapIconDetails('KarazAKarakWarriorsStand', 29, 30);
    case 2115:
      return buildMapIconDetails('KarazAKarakLibrary', 30, 20);
    case 2116:
      return buildMapIconDetails('KarazAKarakTrainers', 26, 19);
    case 2117:
      return buildMapIconDetails('KarakEightPeaksTempleOfGork', 18, 28);
    case 2118:
      return buildMapIconDetails('KarakEightPeaksPortalDown', 16, 31);
    case 2119:
      return buildMapIconDetails('KarakEightPeaksArena', 29, 29);
    case 2120:
      return buildMapIconDetails('KarakEightPeaksThroneRoom', 30, 30);
    case 2121:
      return buildMapIconDetails('KarakEightPeaksMine', 22, 22);
    case 2122:
      return buildMapIconDetails('KarakEightPeaksPenz', 26, 22);
    case 2123:
      return buildMapIconDetails('KarakEightPeaksWeaponzHall', 33, 19);
    case 2124:
      return buildMapIconDetails('KarakEightPeaksHammerinHall', 30, 22);
    case 2125:
      return buildMapIconDetails('KarakEightPeaksShiniesHall', 26, 21);
    case 2126:
      return buildMapIconDetails('KarakEightPeaksPortalUp', 16, 21);
    case 2127:
      return buildMapIconDetails('KarakEightPeaksRatbreakerStand', 32, 23);
    case 2128:
      return buildMapIconDetails('KarakEightPeaksTrainers', 23, 23);
    case 2129:
      return buildMapIconDetails('KarakEightPeaksBank', 25, 23);
  }

  return {
    url: 'https://killboard.returnofreckoning.com/images/maps/icons/skull_red.png',
    width: 16,
    height: 16,
    pointX: 8,
    pointY: 8,
  };
};

export const leafletIcon = memoize((iconId: number): L.Icon => {
  const details = mapIconDetails(iconId);
  return L.icon({
    iconUrl: details.url,
    iconSize: [details.width, details.height],
    iconAnchor: [details.pointX, details.pointY],
    popupAnchor: [0, -details.pointY],
  });
});
