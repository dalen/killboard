/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Byte` scalar type represents non-fractional whole numeric values. Byte can represent values between 0 and 255. */
  Byte: { input: any; output: any; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: { input: any; output: any; }
  /** The `Short` scalar type represents non-fractional signed whole 16-bit numeric values. Short can represent values between -(2^15) and 2^15 - 1. */
  Short: { input: any; output: any; }
  URL: { input: any; output: any; }
  UUID: { input: any; output: any; }
  /** The UnsignedInt scalar type represents a unsigned 32-bit numeric non-fractional value greater than or equal to 0. */
  UnsignedInt: { input: any; output: any; }
  /** The UnsignedLong scalar type represents a unsigned 64-bit numeric non-fractional value greater than or equal to 0. */
  UnsignedLong: { input: any; output: any; }
  /** The UnsignedShort scalar type represents a unsigned 16-bit numeric non-fractional value greater than or equal to 0. */
  UnsignedShort: { input: any; output: any; }
};

export type Ability = SearchContent & {
  __typename?: 'Ability';
  /** @deprecated Use 'info' field instead. */
  abilityType: AbilityType;
  /** @deprecated Use 'info' field instead. */
  actionPointCost: Scalars['Byte']['output'];
  /** @deprecated Use 'info' field instead. */
  castTime: Scalars['UnsignedInt']['output'];
  /** @deprecated Use 'info' field instead. */
  cooldown: Scalars['UnsignedInt']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use 'info' field instead. */
  iconUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  info: AbilityInfo;
  /** @deprecated Use 'info' field instead. */
  labels: Array<Maybe<Scalars['String']['output']>>;
  /** @deprecated Use 'info' field instead. */
  minLevel: Scalars['Byte']['output'];
  /** @deprecated Use 'info' field instead. */
  minRange: Scalars['UnsignedShort']['output'];
  /** @deprecated Use 'info' field instead. */
  moraleCost: Scalars['UnsignedShort']['output'];
  /** @deprecated Use 'info' field instead. */
  moraleLevel: Scalars['Byte']['output'];
  /** @deprecated Use 'info' field instead. */
  name?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use 'info' field instead. */
  range: Scalars['UnsignedShort']['output'];
  /** @deprecated Use 'info' field instead. */
  specialization: Scalars['Byte']['output'];
};

export type AbilityInfo = SearchContent & {
  __typename?: 'AbilityInfo';
  abilityType: AbilityType;
  actionPointCost: Scalars['Byte']['output'];
  castTime: Scalars['UnsignedInt']['output'];
  cooldown: Scalars['UnsignedInt']['output'];
  description?: Maybe<Scalars['String']['output']>;
  iconUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  labels: Array<Maybe<Scalars['String']['output']>>;
  minLevel: Scalars['Byte']['output'];
  minRange: Scalars['UnsignedShort']['output'];
  moraleCost: Scalars['UnsignedShort']['output'];
  moraleLevel: Scalars['Byte']['output'];
  name?: Maybe<Scalars['String']['output']>;
  range: Scalars['UnsignedShort']['output'];
  /** Mastery path */
  specialization: Scalars['Byte']['output'];
};


export type AbilityInfoDescriptionArgs = {
  stats: CharacterStatsInput;
};

export enum AbilityType {
  /** Regular abilities */
  Default = 'DEFAULT',
  /** Unused */
  First = 'FIRST',
  /** Granted abilities */
  Granted = 'GRANTED',
  Guild = 'GUILD',
  /** Morale abilities */
  Morale = 'MORALE',
  /** Passive buffs */
  Passive = 'PASSIVE',
  /** Pet abilities */
  Pet = 'PET',
  /** Tactics */
  Tactic = 'TACTIC'
}

/** Player Archetypes */
export enum Archetype {
  Healer = 'HEALER',
  MeleeDps = 'MELEE_DPS',
  RangedDps = 'RANGED_DPS',
  Tank = 'TANK'
}

/** Holds information about one attacker in a kill */
export type Attacker = {
  __typename?: 'Attacker';
  /** Character information */
  character: Character;
  /** Amount of the total damage done by this attacker */
  damagePercent: Scalars['Byte']['output'];
  /** Guild at the time of the kill */
  guild?: Maybe<Guild>;
  /** Level at the time of the kill */
  level: Scalars['Byte']['output'];
  /** Renown rank at the time of the kill */
  renownRank: Scalars['Byte']['output'];
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ByteOperationFilterInput = {
  eq?: InputMaybe<Scalars['Byte']['input']>;
  gt?: InputMaybe<Scalars['Byte']['input']>;
  gte?: InputMaybe<Scalars['Byte']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Byte']['input']>>>;
  lt?: InputMaybe<Scalars['Byte']['input']>;
  lte?: InputMaybe<Scalars['Byte']['input']>;
  neq?: InputMaybe<Scalars['Byte']['input']>;
  ngt?: InputMaybe<Scalars['Byte']['input']>;
  ngte?: InputMaybe<Scalars['Byte']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Byte']['input']>>>;
  nlt?: InputMaybe<Scalars['Byte']['input']>;
  nlte?: InputMaybe<Scalars['Byte']['input']>;
};

/** Player Careers */
export enum Career {
  /** Archmage */
  Archmage = 'ARCHMAGE',
  /** Black Guard */
  BlackGuard = 'BLACK_GUARD',
  /** Black Orc */
  BlackOrc = 'BLACK_ORC',
  /** Bright Wizard */
  BrightWizard = 'BRIGHT_WIZARD',
  /** Choppa */
  Choppa = 'CHOPPA',
  /** Chosen */
  Chosen = 'CHOSEN',
  /** Disciple of Khaine */
  DiscipleOfKhaine = 'DISCIPLE_OF_KHAINE',
  /** Engineer */
  Engineer = 'ENGINEER',
  /** Iron Breaker */
  IronBreaker = 'IRON_BREAKER',
  /** Knight of the Blazing Sun */
  KnightOfTheBlazingSun = 'KNIGHT_OF_THE_BLAZING_SUN',
  /** Magus */
  Magus = 'MAGUS',
  /** Marauder */
  Marauder = 'MARAUDER',
  /** Rune Priest */
  RunePriest = 'RUNE_PRIEST',
  /** Shadow Warrior */
  ShadowWarrior = 'SHADOW_WARRIOR',
  /** Shaman */
  Shaman = 'SHAMAN',
  /** Slayer */
  Slayer = 'SLAYER',
  /** Sorceress */
  Sorcerer = 'SORCERER',
  /** Squig Herder */
  SquigHerder = 'SQUIG_HERDER',
  /** Sword Master */
  SwordMaster = 'SWORD_MASTER',
  /** Warrior Priest */
  WarriorPriest = 'WARRIOR_PRIEST',
  /** White Lion */
  WhiteLion = 'WHITE_LION',
  /** Witch Elf */
  WitchElf = 'WITCH_ELF',
  /** Witch Hunter */
  WitchHunter = 'WITCH_HUNTER',
  /** Zealot */
  Zealot = 'ZEALOT'
}

export type CareerLineOperationFilterInput = {
  eq?: InputMaybe<Career>;
  in?: InputMaybe<Array<Career>>;
  neq?: InputMaybe<Career>;
  nin?: InputMaybe<Array<Career>>;
};

export enum CareerMask {
  Archmage = 'ARCHMAGE',
  Blackguard = 'BLACKGUARD',
  BlackOrc = 'BLACK_ORC',
  BrightWizard = 'BRIGHT_WIZARD',
  Choppa = 'CHOPPA',
  Chosen = 'CHOSEN',
  DiscipleOfKhaine = 'DISCIPLE_OF_KHAINE',
  Engineer = 'ENGINEER',
  Ironbreaker = 'IRONBREAKER',
  Knight = 'KNIGHT',
  Magus = 'MAGUS',
  Marauder = 'MARAUDER',
  RunePriest = 'RUNE_PRIEST',
  ShadowWarrior = 'SHADOW_WARRIOR',
  Shaman = 'SHAMAN',
  Slayer = 'SLAYER',
  Sorcerer = 'SORCERER',
  SquigHerder = 'SQUIG_HERDER',
  SwordMaster = 'SWORD_MASTER',
  WarriorPriest = 'WARRIOR_PRIEST',
  WhiteLion = 'WHITE_LION',
  WitchElf = 'WITCH_ELF',
  WitchHunter = 'WITCH_HUNTER',
  Zealot = 'ZEALOT'
}

export type CareerMaskFlagsInput = {
  isArchmage?: InputMaybe<Scalars['Boolean']['input']>;
  isBlackOrc?: InputMaybe<Scalars['Boolean']['input']>;
  isBlackguard?: InputMaybe<Scalars['Boolean']['input']>;
  isBrightWizard?: InputMaybe<Scalars['Boolean']['input']>;
  isChoppa?: InputMaybe<Scalars['Boolean']['input']>;
  isChosen?: InputMaybe<Scalars['Boolean']['input']>;
  isDiscipleOfKhaine?: InputMaybe<Scalars['Boolean']['input']>;
  isEngineer?: InputMaybe<Scalars['Boolean']['input']>;
  isIronbreaker?: InputMaybe<Scalars['Boolean']['input']>;
  isKnight?: InputMaybe<Scalars['Boolean']['input']>;
  isMagus?: InputMaybe<Scalars['Boolean']['input']>;
  isMarauder?: InputMaybe<Scalars['Boolean']['input']>;
  isRunePriest?: InputMaybe<Scalars['Boolean']['input']>;
  isShadowWarrior?: InputMaybe<Scalars['Boolean']['input']>;
  isShaman?: InputMaybe<Scalars['Boolean']['input']>;
  isSlayer?: InputMaybe<Scalars['Boolean']['input']>;
  isSorcerer?: InputMaybe<Scalars['Boolean']['input']>;
  isSquigHerder?: InputMaybe<Scalars['Boolean']['input']>;
  isSwordMaster?: InputMaybe<Scalars['Boolean']['input']>;
  isWarriorPriest?: InputMaybe<Scalars['Boolean']['input']>;
  isWhiteLion?: InputMaybe<Scalars['Boolean']['input']>;
  isWitchElf?: InputMaybe<Scalars['Boolean']['input']>;
  isWitchHunter?: InputMaybe<Scalars['Boolean']['input']>;
  isZealot?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CareerMaskOperationFilterInput = {
  eq?: InputMaybe<CareerMaskFlagsInput>;
  in?: InputMaybe<Array<CareerMaskFlagsInput>>;
  neq?: InputMaybe<CareerMaskFlagsInput>;
  nin?: InputMaybe<Array<CareerMaskFlagsInput>>;
};

export type Chapter = SearchContent & {
  __typename?: 'Chapter';
  id: Scalars['ID']['output'];
  influenceRewards: Array<ChapterInfluenceReward>;
  name?: Maybe<Scalars['String']['output']>;
  position: Position;
  rank: Scalars['UnsignedInt']['output'];
};

export type ChapterFilterInput = {
  and?: InputMaybe<Array<ChapterFilterInput>>;
  /** Name */
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ChapterFilterInput>>;
  /** Zone */
  rank?: InputMaybe<UnsignedIntOperationFilterInputType>;
  /** Zone */
  zoneId?: InputMaybe<UnsignedShortOperationFilterInputType>;
};

export type ChapterInfluenceReward = {
  __typename?: 'ChapterInfluenceReward';
  count: Scalars['UnsignedShort']['output'];
  item: Item;
  realm: Realm;
  tier: Scalars['Byte']['output'];
};

export type ChapterSortInput = {
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  rank?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type ChaptersConnection = {
  __typename?: 'ChaptersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<ChaptersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Chapter>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type ChaptersEdge = {
  __typename?: 'ChaptersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Chapter;
};

/** Info about a character */
export type Character = SearchContent & {
  __typename?: 'Character';
  /** Career/Class of the character */
  career: Career;
  /** Current Guild membership */
  guildMembership?: Maybe<GuildMember>;
  /** Character Id */
  id: Scalars['ID']['output'];
  /** Items equipped by the character */
  items: Array<CharacterItem>;
  /** Current Level */
  level: Scalars['Byte']['output'];
  /** First name */
  name: Scalars['String']['output'];
  /** Scenario ratings for the character */
  ratings: Array<CharacterRating>;
  /** Current Renown Rank */
  renownRank: Scalars['Byte']['output'];
};

export type CharacterFilterInput = {
  and?: InputMaybe<Array<CharacterFilterInput>>;
  /** Character career */
  careerLine?: InputMaybe<CareerLineOperationFilterInput>;
  /** Character level */
  level?: InputMaybe<ByteOperationFilterInput>;
  /** Character name */
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CharacterFilterInput>>;
  /** Character renown rank */
  renownRank?: InputMaybe<ByteOperationFilterInput>;
};

export type CharacterItem = {
  __typename?: 'CharacterItem';
  /** Slot where the item is equipped */
  equipSlot: EquipSlot;
  /** Item info */
  item: Item;
  talismans: Array<Item>;
};

/** Info about a quest objective */
export type CharacterRating = {
  __typename?: 'CharacterRating';
  /** Character information */
  character: Character;
  /** Mu */
  mu: Scalars['Float']['output'];
  rating: Scalars['Float']['output'];
  /** Rating type */
  ratingType: RatingType;
  /** Season ID */
  seasonId: Scalars['ID']['output'];
  /** Sigma */
  sigma: Scalars['Float']['output'];
};

export type CharacterRatingFilterInput = {
  and?: InputMaybe<Array<CharacterRatingFilterInput>>;
  characterId?: InputMaybe<UnsignedIntOperationFilterInputType>;
  mu?: InputMaybe<FloatOperationFilterInput>;
  or?: InputMaybe<Array<CharacterRatingFilterInput>>;
  ratingType?: InputMaybe<RatingTypeOperationFilterInput>;
  seasonId?: InputMaybe<UnsignedShortOperationFilterInputType>;
  sigma?: InputMaybe<FloatOperationFilterInput>;
};

export type CharacterRatingSortInput = {
  mu?: InputMaybe<SortEnumType>;
  sigma?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type CharacterRatingsConnection = {
  __typename?: 'CharacterRatingsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<CharacterRatingsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<CharacterRating>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type CharacterRatingsEdge = {
  __typename?: 'CharacterRatingsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: CharacterRating;
};

export type CharacterSeasonStatsFilterInput = {
  and?: InputMaybe<Array<CharacterSeasonStatsFilterInput>>;
  or?: InputMaybe<Array<CharacterSeasonStatsFilterInput>>;
};

export type CharacterSortInput = {
  level?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  renownRank?: InputMaybe<SortEnumType>;
};

export type CharacterStatsInput = {
  /** BallisticSkill */
  ballisticSkill: Scalars['Int']['input'];
  /** Intelligence */
  intelligence: Scalars['Int']['input'];
  /** Ability Level */
  level: Scalars['Byte']['input'];
  /** Strength */
  strength: Scalars['Int']['input'];
  /** Willpower */
  willpower: Scalars['Int']['input'];
};

/** A connection to a list of items. */
export type CharactersConnection = {
  __typename?: 'CharactersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<CharactersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Character>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type CharactersEdge = {
  __typename?: 'CharactersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Character;
};

export type CitySiegeEvent = Event & {
  __typename?: 'CitySiegeEvent';
  endTime?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  startTime: Scalars['DateTime']['output'];
};

export enum CraftingItemType {
  Container = 'CONTAINER',
  ContainerDye = 'CONTAINER_DYE',
  ContainerEssence = 'CONTAINER_ESSENCE',
  Curio = 'CURIO',
  Extender = 'EXTENDER',
  Fixer = 'FIXER',
  Fragment = 'FRAGMENT',
  Golddust = 'GOLDDUST',
  Goldweed = 'GOLDWEED',
  GoldEssence = 'GOLD_ESSENCE',
  MagicEssence = 'MAGIC_ESSENCE',
  MainIngredient = 'MAIN_INGREDIENT',
  Multiplier = 'MULTIPLIER',
  Pigment = 'PIGMENT',
  Quicksilver = 'QUICKSILVER',
  Stabilizer = 'STABILIZER',
  Stimulant = 'STIMULANT',
  TalismanContainer = 'TALISMAN_CONTAINER'
}

export type Creature = SearchContent & {
  __typename?: 'Creature';
  creatureSubType: CreatureSubType;
  creatureType: CreatureType;
  id: Scalars['ID']['output'];
  modelName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  questsFinisher: Array<Quest>;
  questsStarter: Array<Quest>;
  realm?: Maybe<Realm>;
  spawns: Array<CreatureSpawn>;
  /** Items sold by this creature */
  vendorItems?: Maybe<VendorItemsConnection>;
};


export type CreatureVendorItemsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type CreatureFilterInput = {
  and?: InputMaybe<Array<CreatureFilterInput>>;
  /** Sub Type */
  creatureSubType?: InputMaybe<CreatureSubTypesOperationFilterInput>;
  /** Type */
  creatureType?: InputMaybe<CreatureTypesOperationFilterInput>;
  /** Name */
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CreatureFilterInput>>;
};

export type CreatureSortInput = {
  creatureSubType?: InputMaybe<SortEnumType>;
  creatureType?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type CreatureSpawn = {
  __typename?: 'CreatureSpawn';
  id: Scalars['ID']['output'];
  /** Position Info */
  position: Position;
  /** Zone Info */
  zone: Zone;
};

export enum CreatureSubType {
  AnimalsBeastsBasilisk = 'ANIMALS_BEASTS_BASILISK',
  AnimalsBeastsBear = 'ANIMALS_BEASTS_BEAR',
  AnimalsBeastsBoar = 'ANIMALS_BEASTS_BOAR',
  AnimalsBeastsGiantBat = 'ANIMALS_BEASTS_GIANT_BAT',
  AnimalsBeastsGreatCat = 'ANIMALS_BEASTS_GREAT_CAT',
  AnimalsBeastsHound = 'ANIMALS_BEASTS_HOUND',
  AnimalsBeastsRhinox = 'ANIMALS_BEASTS_RHINOX',
  AnimalsBeastsWolf = 'ANIMALS_BEASTS_WOLF',
  AnimalsBirdsGreatEagle = 'ANIMALS_BIRDS_GREAT_EAGLE',
  AnimalsBirdsVulture = 'ANIMALS_BIRDS_VULTURE',
  AnimalsBirdsWarhawk = 'ANIMALS_BIRDS_WARHAWK',
  AnimalsCritterBat = 'ANIMALS_CRITTER_BAT',
  AnimalsCritterBird = 'ANIMALS_CRITTER_BIRD',
  AnimalsCritterCrab = 'ANIMALS_CRITTER_CRAB',
  AnimalsCritterDeer = 'ANIMALS_CRITTER_DEER',
  AnimalsCritterHare = 'ANIMALS_CRITTER_HARE',
  AnimalsCritterLizard = 'ANIMALS_CRITTER_LIZARD',
  AnimalsCritterMaggot = 'ANIMALS_CRITTER_MAGGOT',
  AnimalsCritterRat = 'ANIMALS_CRITTER_RAT',
  AnimalsCritterSpider = 'ANIMALS_CRITTER_SPIDER',
  AnimalsInsectsArachnidsGiantScarab = 'ANIMALS_INSECTS_ARACHNIDS_GIANT_SCARAB',
  AnimalsInsectsArachnidsGiantScorpion = 'ANIMALS_INSECTS_ARACHNIDS_GIANT_SCORPION',
  AnimalsInsectsArachnidsGiantSpider = 'ANIMALS_INSECTS_ARACHNIDS_GIANT_SPIDER',
  AnimalsInsectsArachnidsTombSwarm = 'ANIMALS_INSECTS_ARACHNIDS_TOMB_SWARM',
  AnimalsLivestockCat = 'ANIMALS_LIVESTOCK_CAT',
  AnimalsLivestockChicken = 'ANIMALS_LIVESTOCK_CHICKEN',
  AnimalsLivestockCow = 'ANIMALS_LIVESTOCK_COW',
  AnimalsLivestockDog = 'ANIMALS_LIVESTOCK_DOG',
  AnimalsLivestockHorse = 'ANIMALS_LIVESTOCK_HORSE',
  AnimalsLivestockPig = 'ANIMALS_LIVESTOCK_PIG',
  AnimalsLivestockSheep = 'ANIMALS_LIVESTOCK_SHEEP',
  AnimalsReptilesColdOne = 'ANIMALS_REPTILES_COLD_ONE',
  AnimalsReptilesGiantLizard = 'ANIMALS_REPTILES_GIANT_LIZARD',
  DaemonsKhorneBloodbeast = 'DAEMONS_KHORNE_BLOODBEAST',
  DaemonsKhorneBloodletter = 'DAEMONS_KHORNE_BLOODLETTER',
  DaemonsKhorneBloodthirster = 'DAEMONS_KHORNE_BLOODTHIRSTER',
  DaemonsKhorneFleshHound = 'DAEMONS_KHORNE_FLESH_HOUND',
  DaemonsKhorneJuggernautOfKhorne = 'DAEMONS_KHORNE_JUGGERNAUT_OF_KHORNE',
  DaemonsNurgleGreatUncleanOne = 'DAEMONS_NURGLE_GREAT_UNCLEAN_ONE',
  DaemonsNurgleNurgling = 'DAEMONS_NURGLE_NURGLING',
  DaemonsNurglePlaguebearer = 'DAEMONS_NURGLE_PLAGUEBEARER',
  DaemonsNurglePlaguebeast = 'DAEMONS_NURGLE_PLAGUEBEAST',
  DaemonsNurgleSlimeHound = 'DAEMONS_NURGLE_SLIME_HOUND',
  DaemonsSlaaneshDaemonette = 'DAEMONS_SLAANESH_DAEMONETTE',
  DaemonsSlaaneshFiend = 'DAEMONS_SLAANESH_FIEND',
  DaemonsSlaaneshKeeperOfSecrets = 'DAEMONS_SLAANESH_KEEPER_OF_SECRETS',
  DaemonsTzeentchFirewyrm = 'DAEMONS_TZEENTCH_FIREWYRM',
  DaemonsTzeentchFlamer = 'DAEMONS_TZEENTCH_FLAMER',
  DaemonsTzeentchHorror = 'DAEMONS_TZEENTCH_HORROR',
  DaemonsTzeentchLordOfChange = 'DAEMONS_TZEENTCH_LORD_OF_CHANGE',
  DaemonsTzeentchScreamer = 'DAEMONS_TZEENTCH_SCREAMER',
  DaemonsTzeentchWatcher = 'DAEMONS_TZEENTCH_WATCHER',
  DaemonsUnmarkedDaemonsChaosFury = 'DAEMONS_UNMARKED_DAEMONS_CHAOS_FURY',
  DaemonsUnmarkedDaemonsChaosHound = 'DAEMONS_UNMARKED_DAEMONS_CHAOS_HOUND',
  DaemonsUnmarkedDaemonsChaosSpawn = 'DAEMONS_UNMARKED_DAEMONS_CHAOS_SPAWN',
  DaemonsUnmarkedDaemonsDaemonvine = 'DAEMONS_UNMARKED_DAEMONS_DAEMONVINE',
  DaemonsUnmarkedDaemonsDaemonPrince = 'DAEMONS_UNMARKED_DAEMONS_DAEMON_PRINCE',
  DaemonsUnmarkedDaemonsWalker = 'DAEMONS_UNMARKED_DAEMONS_WALKER',
  DwarvenSlayer = 'DWARVEN_SLAYER',
  HumanoidsBeastmenBestigor = 'HUMANOIDS_BEASTMEN_BESTIGOR',
  HumanoidsBeastmenBrayShaman = 'HUMANOIDS_BEASTMEN_BRAY_SHAMAN',
  HumanoidsBeastmenDoombull = 'HUMANOIDS_BEASTMEN_DOOMBULL',
  HumanoidsBeastmenGor = 'HUMANOIDS_BEASTMEN_GOR',
  HumanoidsBeastmenUngor = 'HUMANOIDS_BEASTMEN_UNGOR',
  HumanoidsDarkElvesBlackGuard = 'HUMANOIDS_DARK_ELVES_BLACK_GUARD',
  HumanoidsDarkElvesDarkElf = 'HUMANOIDS_DARK_ELVES_DARK_ELF',
  HumanoidsDarkElvesDiscipleOfKhaine = 'HUMANOIDS_DARK_ELVES_DISCIPLE_OF_KHAINE',
  HumanoidsDarkElvesSorceress = 'HUMANOIDS_DARK_ELVES_SORCERESS',
  HumanoidsDarkElvesWitchElves = 'HUMANOIDS_DARK_ELVES_WITCH_ELVES',
  HumanoidsDwarfsDwarf = 'HUMANOIDS_DWARFS_DWARF',
  HumanoidsDwarfsEngineer = 'HUMANOIDS_DWARFS_ENGINEER',
  HumanoidsDwarfsHammerer = 'HUMANOIDS_DWARFS_HAMMERER',
  HumanoidsDwarfsIronbreaker = 'HUMANOIDS_DWARFS_IRONBREAKER',
  HumanoidsDwarfsRunepriest = 'HUMANOIDS_DWARFS_RUNEPRIEST',
  HumanoidsDwarfsSlayer = 'HUMANOIDS_DWARFS_SLAYER',
  HumanoidsElvesArchmage = 'HUMANOIDS_ELVES_ARCHMAGE',
  HumanoidsElvesHighElf = 'HUMANOIDS_ELVES_HIGH_ELF',
  HumanoidsElvesShadowWarrior = 'HUMANOIDS_ELVES_SHADOW_WARRIOR',
  HumanoidsElvesSwordmaster = 'HUMANOIDS_ELVES_SWORDMASTER',
  HumanoidsElvesWhiteLion = 'HUMANOIDS_ELVES_WHITE_LION',
  HumanoidsGreenskinsBlackOrc = 'HUMANOIDS_GREENSKINS_BLACK_ORC',
  HumanoidsGreenskinsChoppa = 'HUMANOIDS_GREENSKINS_CHOPPA',
  HumanoidsGreenskinsGnoblar = 'HUMANOIDS_GREENSKINS_GNOBLAR',
  HumanoidsGreenskinsGoblin = 'HUMANOIDS_GREENSKINS_GOBLIN',
  HumanoidsGreenskinsNightGoblin = 'HUMANOIDS_GREENSKINS_NIGHT_GOBLIN',
  HumanoidsGreenskinsOrc = 'HUMANOIDS_GREENSKINS_ORC',
  HumanoidsGreenskinsSavageOrc = 'HUMANOIDS_GREENSKINS_SAVAGE_ORC',
  HumanoidsGreenskinsShaman = 'HUMANOIDS_GREENSKINS_SHAMAN',
  HumanoidsGreenskinsSnotling = 'HUMANOIDS_GREENSKINS_SNOTLING',
  HumanoidsGreenskinsSquig = 'HUMANOIDS_GREENSKINS_SQUIG',
  HumanoidsGreenskinsSquigHerder = 'HUMANOIDS_GREENSKINS_SQUIG_HERDER',
  HumanoidsHumansBandit = 'HUMANOIDS_HUMANS_BANDIT',
  HumanoidsHumansBrightWizard = 'HUMANOIDS_HUMANS_BRIGHT_WIZARD',
  HumanoidsHumansChaos = 'HUMANOIDS_HUMANS_CHAOS',
  HumanoidsHumansChosen = 'HUMANOIDS_HUMANS_CHOSEN',
  HumanoidsHumansDrakkCultist = 'HUMANOIDS_HUMANS_DRAKK_CULTIST',
  HumanoidsHumansEmpire = 'HUMANOIDS_HUMANS_EMPIRE',
  HumanoidsHumansGhoul = 'HUMANOIDS_HUMANS_GHOUL',
  HumanoidsHumansHuman = 'HUMANOIDS_HUMANS_HUMAN',
  HumanoidsHumansKnightOfTheBlazingSun = 'HUMANOIDS_HUMANS_KNIGHT_OF_THE_BLAZING_SUN',
  HumanoidsHumansMagus = 'HUMANOIDS_HUMANS_MAGUS',
  HumanoidsHumansMarauder = 'HUMANOIDS_HUMANS_MARAUDER',
  HumanoidsHumansPlagueVictim = 'HUMANOIDS_HUMANS_PLAGUE_VICTIM',
  HumanoidsHumansWarriorPriest = 'HUMANOIDS_HUMANS_WARRIOR_PRIEST',
  HumanoidsHumansWitchHunter = 'HUMANOIDS_HUMANS_WITCH_HUNTER',
  HumanoidsHumansZealot = 'HUMANOIDS_HUMANS_ZEALOT',
  HumanoidsOgresGorger = 'HUMANOIDS_OGRES_GORGER',
  HumanoidsOgresOgre = 'HUMANOIDS_OGRES_OGRE',
  HumanoidsOgresOgreBull = 'HUMANOIDS_OGRES_OGRE_BULL',
  HumanoidsOgresOgreTyrant = 'HUMANOIDS_OGRES_OGRE_TYRANT',
  HumanoidsOgresYhetee = 'HUMANOIDS_OGRES_YHETEE',
  HumanoidsSkavenRatOgre = 'HUMANOIDS_SKAVEN_RAT_OGRE',
  HumanoidsSkavenSkaven = 'HUMANOIDS_SKAVEN_SKAVEN',
  MonstersChaosBreedsCentigor = 'MONSTERS_CHAOS_BREEDS_CENTIGOR',
  MonstersChaosBreedsChaosMutant = 'MONSTERS_CHAOS_BREEDS_CHAOS_MUTANT',
  MonstersChaosBreedsDragonOgre = 'MONSTERS_CHAOS_BREEDS_DRAGON_OGRE',
  MonstersChaosBreedsFlayerkin = 'MONSTERS_CHAOS_BREEDS_FLAYERKIN',
  MonstersChaosBreedsHarpy = 'MONSTERS_CHAOS_BREEDS_HARPY',
  MonstersChaosBreedsMaggot = 'MONSTERS_CHAOS_BREEDS_MAGGOT',
  MonstersChaosBreedsMinotaur = 'MONSTERS_CHAOS_BREEDS_MINOTAUR',
  MonstersChaosBreedsTuskgor = 'MONSTERS_CHAOS_BREEDS_TUSKGOR',
  MonstersDragonoidsHydra = 'MONSTERS_DRAGONOIDS_HYDRA',
  MonstersDragonoidsWyvern = 'MONSTERS_DRAGONOIDS_WYVERN',
  MonstersDragonoidDragon = 'MONSTERS_DRAGONOID_DRAGON',
  MonstersGiantsChaosGiant = 'MONSTERS_GIANTS_CHAOS_GIANT',
  MonstersGiantsGiant = 'MONSTERS_GIANTS_GIANT',
  MonstersMagicalBeastsCockatrice = 'MONSTERS_MAGICAL_BEASTS_COCKATRICE',
  MonstersMagicalBeastsGriffon = 'MONSTERS_MAGICAL_BEASTS_GRIFFON',
  MonstersMagicalBeastsImp = 'MONSTERS_MAGICAL_BEASTS_IMP',
  MonstersMagicalBeastsManticore = 'MONSTERS_MAGICAL_BEASTS_MANTICORE',
  MonstersMagicalBeastsPegasus = 'MONSTERS_MAGICAL_BEASTS_PEGASUS',
  MonstersMagicalBeastsUnicorn = 'MONSTERS_MAGICAL_BEASTS_UNICORN',
  MonstersTrollsChaosTroll = 'MONSTERS_TROLLS_CHAOS_TROLL',
  MonstersTrollsRiverTroll = 'MONSTERS_TROLLS_RIVER_TROLL',
  MonstersTrollsStoneTroll = 'MONSTERS_TROLLS_STONE_TROLL',
  MonstersTrollsTroll = 'MONSTERS_TROLLS_TROLL',
  PlantsForestSpiritsDryad = 'PLANTS_FOREST_SPIRITS_DRYAD',
  PlantsForestSpiritsKurnous = 'PLANTS_FOREST_SPIRITS_KURNOUS',
  PlantsForestSpiritsSpite = 'PLANTS_FOREST_SPIRITS_SPITE',
  PlantsForestSpiritsTreekin = 'PLANTS_FOREST_SPIRITS_TREEKIN',
  PlantsForestSpiritsTreeman = 'PLANTS_FOREST_SPIRITS_TREEMAN',
  SiegeCatapult = 'SIEGE_CATAPULT',
  SiegeGtaoe = 'SIEGE_GTAOE',
  SiegeOil = 'SIEGE_OIL',
  SiegeRam = 'SIEGE_RAM',
  SiegeSingleTarget = 'SIEGE_SINGLE_TARGET',
  Unclassified = 'UNCLASSIFIED',
  UndeadConstructsAspBoneConstruct = 'UNDEAD_CONSTRUCTS_ASP_BONE_CONSTRUCT',
  UndeadConstructsBoneGiant = 'UNDEAD_CONSTRUCTS_BONE_GIANT',
  UndeadConstructsConstruct = 'UNDEAD_CONSTRUCTS_CONSTRUCT',
  UndeadConstructsLivingArmor = 'UNDEAD_CONSTRUCTS_LIVING_ARMOR',
  UndeadConstructsScarabBoneConstruct = 'UNDEAD_CONSTRUCTS_SCARAB_BONE_CONSTRUCT',
  UndeadConstructsTombScorpion = 'UNDEAD_CONSTRUCTS_TOMB_SCORPION',
  UndeadConstructsUshabti = 'UNDEAD_CONSTRUCTS_USHABTI',
  UndeadConstructsWingedNightmare = 'UNDEAD_CONSTRUCTS_WINGED_NIGHTMARE',
  UndeadGreaterUndeadLiche = 'UNDEAD_GREATER_UNDEAD_LICHE',
  UndeadGreaterUndeadPreservedDead = 'UNDEAD_GREATER_UNDEAD_PRESERVED_DEAD',
  UndeadGreaterUndeadVampire = 'UNDEAD_GREATER_UNDEAD_VAMPIRE',
  UndeadSkeletonsCarrion = 'UNDEAD_SKELETONS_CARRION',
  UndeadSkeletonsSkeleton = 'UNDEAD_SKELETONS_SKELETON',
  UndeadSpiritsBanshee = 'UNDEAD_SPIRITS_BANSHEE',
  UndeadSpiritsSpiritHost = 'UNDEAD_SPIRITS_SPIRIT_HOST',
  UndeadSpiritsWraith = 'UNDEAD_SPIRITS_WRAITH',
  UndeadWightsWight = 'UNDEAD_WIGHTS_WIGHT',
  UndeadZombiesZombie = 'UNDEAD_ZOMBIES_ZOMBIE'
}

export type CreatureSubTypesOperationFilterInput = {
  eq?: InputMaybe<CreatureSubType>;
  in?: InputMaybe<Array<CreatureSubType>>;
  neq?: InputMaybe<CreatureSubType>;
  nin?: InputMaybe<Array<CreatureSubType>>;
};

export enum CreatureType {
  AnimalsBeasts = 'ANIMALS_BEASTS',
  AnimalsBirds = 'ANIMALS_BIRDS',
  AnimalsCritter = 'ANIMALS_CRITTER',
  AnimalsInsectsArachnids = 'ANIMALS_INSECTS_ARACHNIDS',
  AnimalsLivestock = 'ANIMALS_LIVESTOCK',
  AnimalsReptiles = 'ANIMALS_REPTILES',
  DaemonsKhorne = 'DAEMONS_KHORNE',
  DaemonsNurgle = 'DAEMONS_NURGLE',
  DaemonsSlaanesh = 'DAEMONS_SLAANESH',
  DaemonsTzeentch = 'DAEMONS_TZEENTCH',
  DaemonsUnmarked = 'DAEMONS_UNMARKED',
  HumanoidsBeastmen = 'HUMANOIDS_BEASTMEN',
  HumanoidsDarkElves = 'HUMANOIDS_DARK_ELVES',
  HumanoidsDwarfs = 'HUMANOIDS_DWARFS',
  HumanoidsElves = 'HUMANOIDS_ELVES',
  HumanoidsGreenskins = 'HUMANOIDS_GREENSKINS',
  HumanoidsHumans = 'HUMANOIDS_HUMANS',
  HumanoidsOgres = 'HUMANOIDS_OGRES',
  HumanoidsSkaven = 'HUMANOIDS_SKAVEN',
  MonstersChaosBreeds = 'MONSTERS_CHAOS_BREEDS',
  MonstersDragonoids = 'MONSTERS_DRAGONOIDS',
  MonstersGiants = 'MONSTERS_GIANTS',
  MonstersMagicalBeasts = 'MONSTERS_MAGICAL_BEASTS',
  MonstersTrolls = 'MONSTERS_TROLLS',
  PlantsForestSpirits = 'PLANTS_FOREST_SPIRITS',
  Siege = 'SIEGE',
  Unclassified = 'UNCLASSIFIED',
  UndeadConstructs = 'UNDEAD_CONSTRUCTS',
  UndeadGreaterUndead = 'UNDEAD_GREATER_UNDEAD',
  UndeadSkeletons = 'UNDEAD_SKELETONS',
  UndeadSpirits = 'UNDEAD_SPIRITS',
  UndeadWights = 'UNDEAD_WIGHTS',
  UndeadZombies = 'UNDEAD_ZOMBIES'
}

export type CreatureTypesOperationFilterInput = {
  eq?: InputMaybe<CreatureType>;
  in?: InputMaybe<Array<CreatureType>>;
  neq?: InputMaybe<CreatureType>;
  nin?: InputMaybe<Array<CreatureType>>;
};

/** A connection to a list of items. */
export type CreaturesConnection = {
  __typename?: 'CreaturesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<CreaturesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Creature>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type CreaturesEdge = {
  __typename?: 'CreaturesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Creature;
};

/** A connection to a list of items. */
export type DropsFromCreaturesConnection = {
  __typename?: 'DropsFromCreaturesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<DropsFromCreaturesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Creature>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type DropsFromCreaturesEdge = {
  __typename?: 'DropsFromCreaturesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Creature;
};

/** A connection to a list of items. */
export type DropsFromGameObjectsConnection = {
  __typename?: 'DropsFromGameObjectsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<DropsFromGameObjectsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<GameObject>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type DropsFromGameObjectsEdge = {
  __typename?: 'DropsFromGameObjectsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: GameObject;
};

/** Character equipment slots */
export enum EquipSlot {
  Back = 'BACK',
  Belt = 'BELT',
  Body = 'BODY',
  Boots = 'BOOTS',
  EitherHand = 'EITHER_HAND',
  Event = 'EVENT',
  Gloves = 'GLOVES',
  Helm = 'HELM',
  Jewellery1 = 'JEWELLERY1',
  Jewellery2 = 'JEWELLERY2',
  Jewellery3 = 'JEWELLERY3',
  Jewellery4 = 'JEWELLERY4',
  MainHand = 'MAIN_HAND',
  None = 'NONE',
  OffHand = 'OFF_HAND',
  Pocket1 = 'POCKET1',
  Pocket2 = 'POCKET2',
  RangedWeapon = 'RANGED_WEAPON',
  Shoulder = 'SHOULDER',
  Standard = 'STANDARD',
  Trophy1 = 'TROPHY1',
  Trophy2 = 'TROPHY2',
  Trophy3 = 'TROPHY3',
  Trophy4 = 'TROPHY4',
  Trophy5 = 'TROPHY5'
}

export type EquipSlotOperationFilterInput = {
  eq?: InputMaybe<EquipSlot>;
  in?: InputMaybe<Array<EquipSlot>>;
  neq?: InputMaybe<EquipSlot>;
  nin?: InputMaybe<Array<EquipSlot>>;
};

export type Event = {
  endTime?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  startTime: Scalars['DateTime']['output'];
};

export type FloatOperationFilterInput = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
  ngt?: InputMaybe<Scalars['Float']['input']>;
  ngte?: InputMaybe<Scalars['Float']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  nlt?: InputMaybe<Scalars['Float']['input']>;
  nlte?: InputMaybe<Scalars['Float']['input']>;
};

export type GameObject = {
  __typename?: 'GameObject';
  id: Scalars['ID']['output'];
  modelName?: Maybe<Scalars['String']['output']>;
  /** The name of the Game Object */
  name: Scalars['String']['output'];
  questsFinisher: Array<Quest>;
  questsStarter: Array<Quest>;
  spawns: Array<GameObjectSpawn>;
};

export type GameObjectProtoFilterInput = {
  and?: InputMaybe<Array<GameObjectProtoFilterInput>>;
  /** Name */
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<GameObjectProtoFilterInput>>;
};

export type GameObjectProtoSortInput = {
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type GameObjectSpawn = {
  __typename?: 'GameObjectSpawn';
  id: Scalars['ID']['output'];
  /** Position Info */
  position: Position;
  /** Zone Info */
  zone: Zone;
};

/** A connection to a list of items. */
export type GameObjectsConnection = {
  __typename?: 'GameObjectsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<GameObjectsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<GameObject>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type GameObjectsEdge = {
  __typename?: 'GameObjectsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: GameObject;
};

export type Guild = SearchContent & {
  __typename?: 'Guild';
  /** Recruiting brief description */
  briefDescription: Scalars['String']['output'];
  /** Recruiting description */
  description: Scalars['String']['output'];
  /** Guild heraldry */
  heraldry: GuildHeraldry;
  /** Guild Id */
  id: Scalars['ID']['output'];
  /** Guild leader */
  leader?: Maybe<Character>;
  /** Guild level */
  level: Scalars['Byte']['output'];
  /** Guild members */
  members?: Maybe<MembersConnection>;
  /** Guild name */
  name: Scalars['String']['output'];
  /** Guild ranks */
  ranks: Array<GuildRank>;
  /** Guild realm */
  realm: Realm;
};


export type GuildMembersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type GuildFeudFilterInput = {
  guild1Id: Scalars['ID']['input'];
  guild2Id: Scalars['ID']['input'];
};

export type GuildFilterInput = {
  and?: InputMaybe<Array<GuildFilterInput>>;
  /** Guild level */
  level?: InputMaybe<ByteOperationFilterInput>;
  /** Guild name */
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<GuildFilterInput>>;
  /** Guild realm */
  realm?: InputMaybe<RealmsOperationFilterInput>;
};

export type GuildHeraldry = {
  __typename?: 'GuildHeraldry';
  /** Primary Color */
  color1: Scalars['Int']['output'];
  /** Secondary Color */
  color2: Scalars['Int']['output'];
  /** Emblem */
  emblem: Scalars['Int']['output'];
  /** Pattern */
  pattern: Scalars['Int']['output'];
  /** Shape */
  shape: Scalars['Int']['output'];
};

export type GuildInfoSortInput = {
  level?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

export type GuildMember = {
  __typename?: 'GuildMember';
  /** Character info */
  character: Character;
  /** Guild */
  guild: Guild;
  /** Guild rank */
  rank: GuildRank;
};

export type GuildRank = {
  __typename?: 'GuildRank';
  /** Rank name */
  name: Scalars['String']['output'];
  /** Rank id */
  rank: Scalars['Byte']['output'];
};

/** A connection to a list of items. */
export type GuildsConnection = {
  __typename?: 'GuildsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<GuildsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Guild>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type GuildsEdge = {
  __typename?: 'GuildsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Guild;
};

export type Icon = {
  __typename?: 'Icon';
  /** Icon Id */
  id: Scalars['ID']['output'];
  /** Name */
  name: Scalars['String']['output'];
  /** URL to image file */
  url?: Maybe<Scalars['String']['output']>;
};

export type Instance = {
  __typename?: 'Instance';
  /** Encounters */
  encounters?: Maybe<Array<Maybe<InstanceEncounter>>>;
  /** Id */
  id: Scalars['ID']['output'];
  /** Name */
  name: Scalars['String']['output'];
  /** Zone information */
  zone: Zone;
};

export type InstanceEncounter = {
  __typename?: 'InstanceEncounter';
  /** Id */
  id: Scalars['ID']['output'];
  /** Name */
  name: Scalars['String']['output'];
};

export type InstanceEncounterRun = {
  __typename?: 'InstanceEncounterRun';
  /** If the encounter was completed */
  completed: Scalars['Boolean']['output'];
  /** Encounter info */
  encounter?: Maybe<InstanceEncounter>;
  /** The Id of the encounter */
  encounterId: Scalars['ID']['output'];
  /** End time of the run */
  end: Scalars['Long']['output'];
  /** The unique id of the run */
  id: Scalars['ID']['output'];
  /** Instance information */
  instance: Instance;
  /** The Id of the instance */
  instanceId: Scalars['ID']['output'];
  /** The Id of the instance run */
  instanceRunId: Scalars['ID']['output'];
  /** Scoreboard entries */
  scoreboardEntries: Array<InstanceEncounterRunScoreboardEntry>;
  /** Start time of the run */
  start: Scalars['Long']['output'];
};

export type InstanceEncounterRunScoreboardEntry = {
  __typename?: 'InstanceEncounterRunScoreboardEntry';
  /** Archetype at the time of the run */
  archetype: Archetype;
  /** Career at the time of the run */
  career: Career;
  /** Character information */
  character: Character;
  /** Damage */
  damage: Scalars['UnsignedInt']['output'];
  /** Damage Received */
  damageReceived: Scalars['UnsignedInt']['output'];
  /** Deaths */
  deaths: Scalars['UnsignedInt']['output'];
  /** Guild at the time of the run */
  guild?: Maybe<Guild>;
  /** Healing */
  healing: Scalars['UnsignedInt']['output'];
  /** Healing of others */
  healingOthers: Scalars['UnsignedInt']['output'];
  /** Healing of self */
  healingReceived: Scalars['UnsignedInt']['output'];
  /** Healing of self */
  healingSelf: Scalars['UnsignedInt']['output'];
  /** Total item rating */
  itemRating: Scalars['UnsignedInt']['output'];
  /** Damage contributing to kills */
  killDamage: Scalars['UnsignedInt']['output'];
  /** Level at the time of the run */
  level: Scalars['Byte']['output'];
  /** Damage Prevented */
  protection: Scalars['UnsignedInt']['output'];
  /** Protection of others */
  protectionOthers: Scalars['UnsignedInt']['output'];
  /** Protection Received */
  protectionReceived: Scalars['UnsignedInt']['output'];
  /** Protection of self */
  protectionSelf: Scalars['UnsignedInt']['output'];
  /** Renown rank at the time of the run */
  renownRank: Scalars['Byte']['output'];
  /** Resurrections */
  resurrectionsDone: Scalars['UnsignedInt']['output'];
};

export type InstanceFilterInput = {
  and?: InputMaybe<Array<InstanceFilterInput>>;
  id?: InputMaybe<UnsignedShortOperationFilterInputType>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<InstanceFilterInput>>;
};

export type InstanceRun = {
  __typename?: 'InstanceRun';
  /** If all encounters have been completed */
  completed: Scalars['Boolean']['output'];
  /** Encounters */
  encounters: Array<InstanceEncounterRun>;
  /** End time of the run */
  end: Scalars['Long']['output'];
  /** The unique id of the run */
  id: Scalars['ID']['output'];
  /** Instance information */
  instance: Instance;
  /** The id of the instance */
  instanceId: Scalars['ID']['output'];
  /** Scoreboard entries */
  scoreboardEntries: Array<InstanceRunScoreboardEntry>;
  /** Start time of the run */
  start: Scalars['Long']['output'];
  /** Zone information */
  zone: Zone;
};

export type InstanceRunFilterInput = {
  and?: InputMaybe<Array<InstanceRunFilterInput>>;
  averageItemRating?: InputMaybe<FloatOperationFilterInput>;
  completed?: InputMaybe<BooleanOperationFilterInput>;
  completedEncounters?: InputMaybe<IntOperationFilterInput>;
  end?: InputMaybe<LongOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  instanceId?: InputMaybe<UnsignedShortOperationFilterInputType>;
  maxItemRating?: InputMaybe<UnsignedIntOperationFilterInputType>;
  minItemRating?: InputMaybe<UnsignedIntOperationFilterInputType>;
  or?: InputMaybe<Array<InstanceRunFilterInput>>;
  scoreboardEntryCount?: InputMaybe<IntOperationFilterInput>;
  start?: InputMaybe<LongOperationFilterInput>;
  totalDeaths?: InputMaybe<LongOperationFilterInput>;
};

export type InstanceRunScoreboardEntry = {
  __typename?: 'InstanceRunScoreboardEntry';
  /** Archetype at the time of the run */
  archetype: Archetype;
  /** Career at the time of the run */
  career: Career;
  /** Character information */
  character: Character;
  /** Damage */
  damage: Scalars['UnsignedInt']['output'];
  /** Damage Received */
  damageReceived: Scalars['UnsignedInt']['output'];
  /** Deaths */
  deaths: Scalars['UnsignedInt']['output'];
  /** Guild at the time of the run */
  guild?: Maybe<Guild>;
  /** Healing */
  healing: Scalars['UnsignedInt']['output'];
  /** Healing of others */
  healingOthers: Scalars['UnsignedInt']['output'];
  /** Healing of self */
  healingReceived: Scalars['UnsignedInt']['output'];
  /** Healing of self */
  healingSelf: Scalars['UnsignedInt']['output'];
  /** Total item rating */
  itemRating: Scalars['UnsignedInt']['output'];
  /** Damage contributing to kills */
  killDamage: Scalars['UnsignedInt']['output'];
  /** Level at the time of the run */
  level: Scalars['Byte']['output'];
  /** Damage Prevented */
  protection: Scalars['UnsignedInt']['output'];
  /** Protection of others */
  protectionOthers: Scalars['UnsignedInt']['output'];
  /** Protection Received */
  protectionReceived: Scalars['UnsignedInt']['output'];
  /** Protection of self */
  protectionSelf: Scalars['UnsignedInt']['output'];
  /** Renown rank at the time of the run */
  renownRank: Scalars['Byte']['output'];
  /** Resurrections */
  resurrectionsDone: Scalars['UnsignedInt']['output'];
};

export type InstanceRunSortInput = {
  end?: InputMaybe<SortEnumType>;
  start?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type InstanceRunsConnection = {
  __typename?: 'InstanceRunsConnection';
  /** Average deaths of all matching runs */
  averageDeaths: Scalars['Float']['output'];
  /** Average duration of all matching runs */
  averageDuration: Scalars['Float']['output'];
  /** A list of edges. */
  edges?: Maybe<Array<InstanceRunsEdge>>;
  /** Max duration of all matching runs */
  maxDuration: Scalars['Float']['output'];
  /** Min duration of all matching runs */
  minDuration: Scalars['Float']['output'];
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<InstanceRun>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type InstanceRunsEdge = {
  __typename?: 'InstanceRunsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: InstanceRun;
};

export type InstanceSortInput = {
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
};

/** A connection to a list of items. */
export type InstancesConnection = {
  __typename?: 'InstancesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<InstancesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Instance>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type InstancesEdge = {
  __typename?: 'InstancesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Instance;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type Item = SearchContent & {
  __typename?: 'Item';
  abilities: Array<Ability>;
  /** Armor value, block rating on shields */
  armor: Scalars['UnsignedShort']['output'];
  buffs: Array<Ability>;
  careerRestriction: Array<Career>;
  /** Description */
  description: Scalars['String']['output'];
  /** Weapon DPS */
  dps: Scalars['UnsignedShort']['output'];
  /** Creatures that drop this item */
  dropsFromCreatures?: Maybe<DropsFromCreaturesConnection>;
  /** Game Objects that drop this item */
  dropsFromGameObjects?: Maybe<DropsFromGameObjectsConnection>;
  iconUrl: Scalars['URL']['output'];
  /** Id */
  id: Scalars['ID']['output'];
  /** Item level */
  itemLevel: Scalars['Byte']['output'];
  itemSet?: Maybe<ItemSet>;
  /** Level requirement */
  levelRequirement: Scalars['Byte']['output'];
  /** Name */
  name: Scalars['String']['output'];
  raceRestriction: Array<Race>;
  /** Rarity level */
  rarity: ItemRarity;
  /** Renown rank requirement */
  renownRankRequirement: Scalars['Byte']['output'];
  /** Chapters that reward this item */
  rewardedFromChapters?: Maybe<RewardedFromChaptersConnection>;
  /** Quests that reward this item */
  rewardedFromQuests?: Maybe<RewardedFromQuestsConnection>;
  /** Character equipment slot */
  slot: EquipSlot;
  /** Vendors that sell this item */
  soldByVendors?: Maybe<SoldByVendorsConnection>;
  /** Weapon speed */
  speed: Scalars['UnsignedShort']['output'];
  stats: Array<ItemStat>;
  /** Number of talisman slots */
  talismanSlots: Scalars['Byte']['output'];
  /** Type */
  type: ItemType;
  /** Unique equipped */
  uniqueEquipped: Scalars['Boolean']['output'];
  /** Vendors that trade this item */
  usedToPurchase?: Maybe<UsedToPurchaseConnection>;
};


export type ItemDropsFromCreaturesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ItemDropsFromGameObjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ItemRewardedFromChaptersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ItemRewardedFromQuestsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ItemSoldByVendorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ItemUsedToPurchaseArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  slot?: InputMaybe<EquipSlot>;
  usableByCareer?: InputMaybe<Career>;
};

export enum ItemBindType {
  /** Bound to account on equip */
  AccountBindOnEquip = 'ACCOUNT_BIND_ON_EQUIP',
  /** Bound to account on pickup */
  AccountBindOnPickup = 'ACCOUNT_BIND_ON_PICKUP',
  /** Bound to character on equip */
  BindOnEquip = 'BIND_ON_EQUIP',
  /** Bound to character on pickup */
  BindOnPickup = 'BIND_ON_PICKUP',
  /** Not Bound */
  None = 'NONE'
}

export enum ItemExpirationTimeType {
  /** Time offset is absolute (i.e. unix timestamp) */
  Absolute = 'ABSOLUTE',
  /** Time offset is when a live event ends. */
  LiveEvent = 'LIVE_EVENT',
  /** Time offset is relative to current time */
  Relative = 'RELATIVE',
  /** This will expire on a hardcoded time (after next zandri expedition) */
  ZandriExpedition = 'ZANDRI_EXPEDITION'
}

export enum ItemExpirationType {
  /** Normal non expiring items */
  NonExpiring = 'NON_EXPIRING',
  /** Expire stats on equip */
  OnEquip = 'ON_EQUIP',
  /** Expire starts on pickup */
  OnPickup = 'ON_PICKUP'
}

/** Item filtering options */
export type ItemFilterInput = {
  and?: InputMaybe<Array<ItemFilterInput>>;
  /** Armor value, block rating on shields */
  armor?: InputMaybe<UnsignedShortOperationFilterInputType>;
  /** Description */
  description?: InputMaybe<StringOperationFilterInput>;
  /** Weapon DPS */
  dps?: InputMaybe<UnsignedShortOperationFilterInputType>;
  /** Item Id */
  id?: InputMaybe<UnsignedIntOperationFilterInputType>;
  /** Item level */
  itemLevel?: InputMaybe<ByteOperationFilterInput>;
  /** Level requirement */
  levelRequirement?: InputMaybe<ByteOperationFilterInput>;
  /** Name */
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ItemFilterInput>>;
  /** Rarity level */
  rarity?: InputMaybe<ItemRarityOperationFilterInput>;
  /** Renown rank requirement */
  renownRankRequirement?: InputMaybe<ByteOperationFilterInput>;
  /** Character equipment slot */
  slot?: InputMaybe<EquipSlotOperationFilterInput>;
  /** Weapon speed */
  speed?: InputMaybe<UnsignedShortOperationFilterInputType>;
  /** Number of talisman slots */
  talismanSlots?: InputMaybe<ByteOperationFilterInput>;
  /** Type */
  type?: InputMaybe<ItemTypeOperationFilterInput>;
  /** Unique equipped */
  uniqueEquipped?: InputMaybe<BooleanOperationFilterInput>;
};

export enum ItemRarity {
  Common = 'COMMON',
  Mythic = 'MYTHIC',
  Rare = 'RARE',
  Uncommon = 'UNCOMMON',
  Utility = 'UTILITY',
  VeryRare = 'VERY_RARE'
}

export type ItemRarityOperationFilterInput = {
  eq?: InputMaybe<ItemRarity>;
  in?: InputMaybe<Array<ItemRarity>>;
  neq?: InputMaybe<ItemRarity>;
  nin?: InputMaybe<Array<ItemRarity>>;
};

export type ItemSet = SearchContent & {
  __typename?: 'ItemSet';
  bonuses: Array<ItemSetBonus>;
  id: Scalars['ID']['output'];
  items: Array<Item>;
  level: Scalars['Byte']['output'];
  name: Scalars['String']['output'];
};

export type ItemSetBonus = {
  __typename?: 'ItemSetBonus';
  bonus: ItemSetBonusValue;
  itemsRequired: Scalars['Byte']['output'];
};

export type ItemSetBonusValue = Ability | ItemStat;

/** Item sorting options */
export type ItemSortInput = {
  /** Armor value, block rating on shields */
  armor?: InputMaybe<SortEnumType>;
  /** Description */
  description?: InputMaybe<SortEnumType>;
  /** Weapon DPS */
  dps?: InputMaybe<SortEnumType>;
  /** Item Id */
  id?: InputMaybe<SortEnumType>;
  /** Item level */
  itemLevel?: InputMaybe<SortEnumType>;
  /** Level requirement */
  levelRequirement?: InputMaybe<SortEnumType>;
  /** Name */
  name?: InputMaybe<SortEnumType>;
  /** Rarity level */
  rarity?: InputMaybe<SortEnumType>;
  /** Renown rank requirement */
  renownRankRequirement?: InputMaybe<SortEnumType>;
  /** Character equipment slot */
  slot?: InputMaybe<SortEnumType>;
  /** Weapon speed */
  speed?: InputMaybe<SortEnumType>;
  /** Number of talisman slots */
  talismanSlots?: InputMaybe<SortEnumType>;
  /** Type */
  type?: InputMaybe<SortEnumType>;
};

export type ItemStat = {
  __typename?: 'ItemStat';
  /** Percentage */
  percentage: Scalars['Boolean']['output'];
  /** Stat */
  stat: Stat;
  /** Value */
  value: Scalars['Short']['output'];
};

export enum ItemType {
  Accessory = 'ACCESSORY',
  AdvancedMount = 'ADVANCED_MOUNT',
  Axe = 'AXE',
  BasicMount = 'BASIC_MOUNT',
  BasicShield = 'BASIC_SHIELD',
  Bow = 'BOW',
  Charm = 'CHARM',
  Crafting = 'CRAFTING',
  Crossbow = 'CROSSBOW',
  Currency = 'CURRENCY',
  Dagger = 'DAGGER',
  Dye = 'DYE',
  Enhancement = 'ENHANCEMENT',
  ExpertShield = 'EXPERT_SHIELD',
  Gun = 'GUN',
  Hammer = 'HAMMER',
  HeavyArmor = 'HEAVY_ARMOR',
  Lance = 'LANCE',
  LightArmor = 'LIGHT_ARMOR',
  Marketing = 'MARKETING',
  MediumArmor = 'MEDIUM_ARMOR',
  MediumRobe = 'MEDIUM_ROBE',
  None = 'NONE',
  Pistol = 'PISTOL',
  Potion = 'POTION',
  Quest = 'QUEST',
  RefinerTool = 'REFINER_TOOL',
  RepeatingCrossbow = 'REPEATING_CROSSBOW',
  Robe = 'ROBE',
  Salvaging = 'SALVAGING',
  Shield = 'SHIELD',
  Siege = 'SIEGE',
  Spear = 'SPEAR',
  Staff = 'STAFF',
  Sword = 'SWORD',
  Teleport = 'TELEPORT',
  TeleportGroup = 'TELEPORT_GROUP',
  TreasureChest = 'TREASURE_CHEST',
  TreasureKey = 'TREASURE_KEY',
  Trophy = 'TROPHY'
}

export type ItemTypeOperationFilterInput = {
  eq?: InputMaybe<ItemType>;
  in?: InputMaybe<Array<ItemType>>;
  neq?: InputMaybe<ItemType>;
  nin?: InputMaybe<Array<ItemType>>;
};

/** A connection to a list of items. */
export type ItemsConnection = {
  __typename?: 'ItemsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<ItemsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Item>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type ItemsEdge = {
  __typename?: 'ItemsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Item;
};

export type Kill = {
  __typename?: 'Kill';
  /** List of all enemy players contributing to the kill */
  attackers: Array<Attacker>;
  /** Damage by attacker and source */
  damage: Array<KillDamage>;
  /** The player who landed the killing blow */
  deathblow?: Maybe<Character>;
  /** Kill Id */
  id: Scalars['ID']['output'];
  /** Scenario instance, null if not in a scenario */
  instance?: Maybe<ScenarioRecord>;
  /** Specifies the instance of a scenario this kill happened in */
  instanceId?: Maybe<Scalars['ID']['output']>;
  /** Position of the victim at the time of the kill */
  position: Position;
  /** Scenario, null if not in a scenario */
  scenario?: Maybe<Scenario>;
  /**
   * ScenarioId, 0 if not in a scenario
   * @deprecated No longer supported.
   */
  scenarioId?: Maybe<Scalars['ID']['output']>;
  /** Scenario information */
  scenarioRecord?: Maybe<ScenarioRecord>;
  /** Skirmish information */
  skirmish?: Maybe<Skirmish>;
  /** UTC Timestamp */
  time: Scalars['Int']['output'];
  /** The total renown generated from the kill, including AAO modifiers */
  totalRenown: Scalars['UnsignedInt']['output'];
  /** The victim */
  victim: Victim;
};

export type KillDamage = {
  __typename?: 'KillDamage';
  /** Ability information */
  ability?: Maybe<AbilityInfo>;
  /** The character doing the damage */
  attacker?: Maybe<Character>;
  /** Type of attacker */
  attackerType: KillDamageAttackerType;
  /** Damage amount */
  damageAmount: Scalars['UnsignedInt']['output'];
  /** Type of damage source */
  damageType: KillDamageSourceType;
};

export enum KillDamageAttackerType {
  Other = 'OTHER',
  Player = 'PLAYER'
}

export enum KillDamageSourceType {
  Ability = 'ABILITY',
  FallDamage = 'FALL_DAMAGE',
  Other = 'OTHER'
}

export type KillFilterInput = {
  and?: InputMaybe<Array<KillFilterInput>>;
  /** Percent of the total damage done by the killer */
  damagePercent?: InputMaybe<ByteOperationFilterInput>;
  /** Specifies the instance of a scenario this kill happened in */
  instanceId?: InputMaybe<UuidOperationFilterInput>;
  killerCareer?: InputMaybe<CareerLineOperationFilterInput>;
  killerCharacterId?: InputMaybe<UnsignedIntOperationFilterInputType>;
  killerGuildId?: InputMaybe<UnsignedIntOperationFilterInputType>;
  killerLevel?: InputMaybe<ByteOperationFilterInput>;
  killerRenownRank?: InputMaybe<ByteOperationFilterInput>;
  /** Number of assists */
  numAssists?: InputMaybe<UnsignedIntOperationFilterInputType>;
  or?: InputMaybe<Array<KillFilterInput>>;
  /** ScenarioId, 0 if not in a scenario */
  scenarioId?: InputMaybe<UnsignedIntOperationFilterInputType>;
  /** Id of the skirmish the kill happened in */
  skirmishId?: InputMaybe<UuidOperationFilterInput>;
  /** UTC Timestamp */
  time?: InputMaybe<IntOperationFilterInput>;
  victimCareer?: InputMaybe<CareerLineOperationFilterInput>;
  victimCharacterId?: InputMaybe<UnsignedIntOperationFilterInputType>;
  victimGuildId?: InputMaybe<UnsignedIntOperationFilterInputType>;
  victimLevel?: InputMaybe<ByteOperationFilterInput>;
  victimRenownRank?: InputMaybe<ByteOperationFilterInput>;
  /** Zone Id */
  zoneId?: InputMaybe<UnsignedShortOperationFilterInputType>;
};

export type KillGuildLeaderboardEntry = {
  __typename?: 'KillGuildLeaderboardEntry';
  /** Number of deaths */
  deaths: Scalars['Int']['output'];
  /** Guild information */
  guild: Guild;
  /** Number of kills */
  kills: Scalars['Int']['output'];
  /** Rank */
  rank: Scalars['Int']['output'];
};

export type KillLeaderboardEntry = {
  __typename?: 'KillLeaderboardEntry';
  /** Character information */
  character: Character;
  /** Number of deaths */
  deaths: Scalars['Int']['output'];
  /** Number of kills */
  kills: Scalars['Int']['output'];
  /** Rank */
  rank: Scalars['Int']['output'];
};

/** A connection to a list of items. */
export type KillsConnection = {
  __typename?: 'KillsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<KillsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Kill>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type KillsEdge = {
  __typename?: 'KillsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Kill;
};

export type KillsHeatmapPoint = {
  __typename?: 'KillsHeatmapPoint';
  count: Scalars['UnsignedInt']['output'];
  x: Scalars['UnsignedInt']['output'];
  y: Scalars['UnsignedInt']['output'];
};

/** A connection to a list of items. */
export type LeaderboardConnection = {
  __typename?: 'LeaderboardConnection';
  /** A list of edges. */
  edges?: Maybe<Array<LeaderboardEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<RankedLeaderboardCharacter>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type LeaderboardEdge = {
  __typename?: 'LeaderboardEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: RankedLeaderboardCharacter;
};

export type LiveEvent = Event & SearchContent & {
  __typename?: 'LiveEvent';
  endTime: Scalars['DateTime']['output'];
  /** Id of the content */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  startTime: Scalars['DateTime']['output'];
};

export type LongOperationFilterInput = {
  eq?: InputMaybe<Scalars['Long']['input']>;
  gt?: InputMaybe<Scalars['Long']['input']>;
  gte?: InputMaybe<Scalars['Long']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  lt?: InputMaybe<Scalars['Long']['input']>;
  lte?: InputMaybe<Scalars['Long']['input']>;
  neq?: InputMaybe<Scalars['Long']['input']>;
  ngt?: InputMaybe<Scalars['Long']['input']>;
  ngte?: InputMaybe<Scalars['Long']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  nlt?: InputMaybe<Scalars['Long']['input']>;
  nlte?: InputMaybe<Scalars['Long']['input']>;
};

export type MapSetup = {
  __typename?: 'MapSetup';
  /** The unique id of the map setup */
  id: Scalars['ID']['output'];
  /** The NW corner X coordinate of the map */
  nwCornerX: Scalars['Int']['output'];
  /** The NW corner Y coordinate of the map */
  nwCornerY: Scalars['Int']['output'];
  /** The SE corner X coordinate of the map */
  seCornerX: Scalars['Int']['output'];
  /** The SE corner Y coordinate of the map */
  seCornerY: Scalars['Int']['output'];
};

/** A connection to a list of items. */
export type MembersConnection = {
  __typename?: 'MembersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<MembersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<GuildMember>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type MembersEdge = {
  __typename?: 'MembersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: GuildMember;
};

export type NullableOfTomeSectionOperationFilterInput = {
  eq?: InputMaybe<TomeOfKnowledgeSection>;
  in?: InputMaybe<Array<InputMaybe<TomeOfKnowledgeSection>>>;
  neq?: InputMaybe<TomeOfKnowledgeSection>;
  nin?: InputMaybe<Array<InputMaybe<TomeOfKnowledgeSection>>>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PlayerFeudFilterInput = {
  player1Id: Scalars['ID']['input'];
  player2Id: Scalars['ID']['input'];
};

export type Position = {
  __typename?: 'Position';
  /** The map setup of the zone */
  mapSetup?: Maybe<MapSetup>;
  /** Zone X position */
  x: Scalars['UnsignedShort']['output'];
  /** Zone Y position */
  y: Scalars['UnsignedShort']['output'];
  /** Z position */
  z: Scalars['UnsignedShort']['output'];
  /** Zone Info */
  zone?: Maybe<Zone>;
  /** ZoneId */
  zoneId: Scalars['UnsignedShort']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get an ability by its ID. */
  ability?: Maybe<AbilityInfo>;
  /** Get one chapter */
  chapter?: Maybe<Chapter>;
  /** Query for chapters matching a filter */
  chapters?: Maybe<ChaptersConnection>;
  /** Get one character */
  character?: Maybe<Character>;
  /** Query for CharacterRatings matching a filter */
  characterRatings?: Maybe<CharacterRatingsConnection>;
  /** Query for characters matching a filter */
  characters?: Maybe<CharactersConnection>;
  /** Get one creature */
  creature?: Maybe<Creature>;
  /** Query for creatures matching a filter */
  creatures?: Maybe<CreaturesConnection>;
  events: Array<Event>;
  /** Get one game object */
  gameObject?: Maybe<GameObject>;
  /** Query for game objects matching a filter */
  gameObjects?: Maybe<GameObjectsConnection>;
  /** Get one guild */
  guild?: Maybe<Guild>;
  /** Query for guilds matching a filter */
  guilds?: Maybe<GuildsConnection>;
  /** Get information on an instance */
  instance?: Maybe<Instance>;
  /** Get information on an instance encounter run */
  instanceEncounterRun?: Maybe<InstanceEncounterRun>;
  /** Get information on an instance run */
  instanceRun?: Maybe<InstanceRun>;
  /** Query for instance runs matching a filter */
  instanceRuns?: Maybe<InstanceRunsConnection>;
  /** Query for instances matching a filter */
  instances?: Maybe<InstancesConnection>;
  /** Get one item by Id */
  item?: Maybe<Item>;
  /** Query for items matching a filter */
  items?: Maybe<ItemsConnection>;
  /** Get one kill */
  kill?: Maybe<Kill>;
  /** Query for kills matching a filter */
  kills?: Maybe<KillsConnection>;
  killsHeatmap: Array<KillsHeatmapPoint>;
  monthlyGuildKillLeaderboard: Array<KillGuildLeaderboardEntry>;
  monthlyKillLeaderboard: Array<KillLeaderboardEntry>;
  /** Get one guild */
  quest?: Maybe<Quest>;
  /** Query for quests matching a filter */
  quests?: Maybe<QuestsConnection>;
  rankedSeason?: Maybe<RankedSeason>;
  rankedSeasons: Array<RankedSeason>;
  /** Get scenario result from instance id */
  scenario?: Maybe<ScenarioRecord>;
  /** Query for scenario records matching a filter */
  scenarios?: Maybe<ScenariosConnection>;
  /** Unified search */
  search?: Maybe<SearchConnection>;
  /** Get one skirmish */
  skirmish?: Maybe<Skirmish>;
  /** Query for skirmishes records matching a filter */
  skirmishes?: Maybe<SkirmishesConnection>;
  /** Query for Tome of Knowledge Achievement entries matching a filter */
  tomeOfKnowledgeAchievementEntries?: Maybe<TomeOfKnowledgeAchievementEntriesConnection>;
  /** Get one Tome of Knowledge Achievement entry by Id */
  tomeOfKnowledgeAchievementEntry?: Maybe<TomeOfKnowledgeAchievementEntry>;
  /** Get one Tome of Knowledge Achievement subtype by Id */
  tomeOfKnowledgeAchievementSubType?: Maybe<TomeOfKnowledgeAchievementType>;
  /** Get one Tome of Knowledge Achievement type by Id */
  tomeOfKnowledgeAchievementType?: Maybe<TomeOfKnowledgeAchievementType>;
  /** Query for Tome of Knowledge Achievement types matching a filter */
  tomeOfKnowledgeAchievementTypes: Array<TomeOfKnowledgeAchievementType>;
  /** Query for Tome of Knowledge entries matching a filter */
  tomeOfKnowledgeEntries?: Maybe<TomeOfKnowledgeEntriesConnection>;
  /** Get one Tome of Knowledge entry by Id */
  tomeOfKnowledgeEntry?: Maybe<TomeOfKnowledgeEntry>;
  /** Get top skirmishes in last seven days */
  topSkirmishes: Array<Skirmish>;
  /** Query for War Journal entries matching a filter */
  warJournalEntries?: Maybe<Array<Maybe<WarJournalEntry>>>;
  /** Get one War Journal Entry by Id */
  warJournalEntry?: Maybe<WarJournalEntry>;
  /** Get one War Journal Storyline by Id */
  warJournalStoryline?: Maybe<WarJournalStoryline>;
  /** Query for War Journal Storylines matching a filter */
  warJournalStorylines: Array<WarJournalStoryline>;
  weeklyGuildKillLeaderboard: Array<KillGuildLeaderboardEntry>;
  weeklyKillLeaderboard: Array<KillLeaderboardEntry>;
};


export type QueryAbilityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChapterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChaptersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ChapterSortInput>>;
  where?: InputMaybe<ChapterFilterInput>;
};


export type QueryCharacterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCharacterRatingsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<CharacterRatingSortInput>>;
  where?: InputMaybe<CharacterRatingFilterInput>;
};


export type QueryCharactersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<CharacterSortInput>>;
  where?: InputMaybe<CharacterFilterInput>;
};


export type QueryCreatureArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCreaturesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<CreatureSortInput>>;
  where?: InputMaybe<CreatureFilterInput>;
};


export type QueryGameObjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGameObjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<GameObjectProtoSortInput>>;
  where?: InputMaybe<GameObjectProtoFilterInput>;
};


export type QueryGuildArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGuildsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<GuildInfoSortInput>>;
  where?: InputMaybe<GuildFilterInput>;
};


export type QueryInstanceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInstanceEncounterRunArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInstanceRunArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInstanceRunsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<InstanceRunSortInput>>;
  where?: InputMaybe<InstanceRunFilterInput>;
};


export type QueryInstancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<InstanceSortInput>>;
  where?: InputMaybe<InstanceFilterInput>;
};


export type QueryItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryItemsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  hasStats?: InputMaybe<Array<Stat>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<ItemSortInput>>;
  usableByCareer?: InputMaybe<Career>;
  where?: InputMaybe<ItemFilterInput>;
};


export type QueryKillArgs = {
  id: Scalars['ID']['input'];
  includeAssists?: Scalars['Boolean']['input'];
};


export type QueryKillsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  guildFeudFilter?: InputMaybe<GuildFeudFilterInput>;
  includeAssists?: InputMaybe<Scalars['Boolean']['input']>;
  instanceId?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  playerFeudFilter?: InputMaybe<PlayerFeudFilterInput>;
  soloOnly?: Scalars['Boolean']['input'];
  where?: InputMaybe<KillFilterInput>;
};


export type QueryKillsHeatmapArgs = {
  from?: InputMaybe<Scalars['Long']['input']>;
  instanceId?: InputMaybe<Scalars['ID']['input']>;
  killerGuildId?: InputMaybe<Scalars['ID']['input']>;
  killerId?: InputMaybe<Scalars['ID']['input']>;
  soloOnly?: Scalars['Boolean']['input'];
  to?: InputMaybe<Scalars['Long']['input']>;
  victimGuildId?: InputMaybe<Scalars['ID']['input']>;
  victimId?: InputMaybe<Scalars['ID']['input']>;
  zoneId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryMonthlyGuildKillLeaderboardArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type QueryMonthlyKillLeaderboardArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type QueryQuestArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQuestsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<QuestSortInput>>;
  where?: InputMaybe<QuestFilterInput>;
};


export type QueryRankedSeasonArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryScenarioArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScenariosArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  characterId?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  from?: InputMaybe<Scalars['Long']['input']>;
  guildId?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  premadeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  queueType?: InputMaybe<ScenarioQueueType>;
  scenarioId?: InputMaybe<Scalars['ID']['input']>;
  to?: InputMaybe<Scalars['Long']['input']>;
  where?: InputMaybe<ScenarioRecordFilterInput>;
  wins?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QuerySearchArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySkirmishArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySkirmishesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  characterId?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  guildId?: InputMaybe<Scalars['ID']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SkirmishFilterInput>;
};


export type QueryTomeOfKnowledgeAchievementEntriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TomeOfKnowledgeAchievementEntryFilterInput>;
};


export type QueryTomeOfKnowledgeAchievementEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTomeOfKnowledgeAchievementSubTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTomeOfKnowledgeAchievementTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTomeOfKnowledgeEntriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TomeOfKnowledgeEntryFilterInput>;
};


export type QueryTomeOfKnowledgeEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWarJournalEntriesArgs = {
  where?: InputMaybe<WarJournalEntryFilterInput>;
};


export type QueryWarJournalEntryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWarJournalStorylineArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWarJournalStorylinesArgs = {
  where?: InputMaybe<WarJournalStorylineFilterInput>;
};


export type QueryWeeklyGuildKillLeaderboardArgs = {
  week: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type QueryWeeklyKillLeaderboardArgs = {
  week: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};

/** Info about a quest */
export type Quest = SearchContent & {
  __typename?: 'Quest';
  /** Available to careers */
  careerRestriction: Array<Career>;
  /** Number of choice rewards */
  choiceCount: Scalars['Byte']['output'];
  /** Description */
  description?: Maybe<Scalars['String']['output']>;
  /** Gold reward (in brass coins) */
  gold: Scalars['UnsignedInt']['output'];
  /** Id of the quest */
  id: Scalars['ID']['output'];
  /** Journal Entry Text */
  journalEntry?: Maybe<Scalars['String']['output']>;
  /** Maximum level */
  maxLevel: Scalars['Byte']['output'];
  /** Maximum renown */
  maxRenown: Scalars['Byte']['output'];
  /** Minimum level */
  minLevel: Scalars['Byte']['output'];
  /** Minimum renown */
  minRenown: Scalars['Byte']['output'];
  /** Name */
  name: Scalars['String']['output'];
  /** Objectives */
  objectives: Array<QuestObjective>;
  /** Available to races */
  raceRestriction: Array<Race>;
  /** Repeatable Type */
  repeatableType: QuestRepeatableType;
  /** Choice rewards */
  rewardsChoice: Array<QuestReward>;
  /** Given rewards */
  rewardsGiven: Array<QuestReward>;
  /** Creatures starting quest */
  starterCreatures: Array<Creature>;
  /** Quest Type */
  type: QuestTypeFlagsFlags;
  /** XP Reward */
  xp: Scalars['UnsignedInt']['output'];
};

export type QuestFilterInput = {
  and?: InputMaybe<Array<QuestFilterInput>>;
  careerRestriction?: InputMaybe<CareerMaskOperationFilterInput>;
  id?: InputMaybe<UnsignedShortOperationFilterInputType>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<QuestFilterInput>>;
  raceRestriction?: InputMaybe<RaceMaskOperationFilterInput>;
  type?: InputMaybe<QuestTypeFlagsOperationFilterInput>;
};

/** Info about a quest objective */
export type QuestObjective = {
  __typename?: 'QuestObjective';
  /** Number of times the objective needs to be done */
  count: Scalars['UnsignedInt']['output'];
  /** Objective description */
  description: Scalars['String']['output'];
};

export enum QuestRepeatableType {
  /** Repeatable */
  Done = 'DONE',
  /** Not repeatable */
  None = 'NONE',
  /** Each Week */
  Weekly = 'WEEKLY'
}

/** Info about a quest reward */
export type QuestReward = {
  __typename?: 'QuestReward';
  /** Number of items rewarded */
  count: Scalars['UnsignedShort']['output'];
  /** Item rewarded */
  item: Item;
};

export type QuestSortInput = {
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
};

export enum QuestTypeFlags {
  Epic = 'EPIC',
  Group = 'GROUP',
  None = 'NONE',
  PlayerKill = 'PLAYER_KILL',
  RvR = 'RV_R',
  Tome = 'TOME',
  Travel = 'TRAVEL'
}

export type QuestTypeFlagsFlags = {
  __typename?: 'QuestTypeFlagsFlags';
  isEpic: Scalars['Boolean']['output'];
  isGroup: Scalars['Boolean']['output'];
  isNone: Scalars['Boolean']['output'];
  isPlayerKill: Scalars['Boolean']['output'];
  isRvR: Scalars['Boolean']['output'];
  isTome: Scalars['Boolean']['output'];
  isTravel: Scalars['Boolean']['output'];
};

export type QuestTypeFlagsFlagsInput = {
  isEpic?: InputMaybe<Scalars['Boolean']['input']>;
  isGroup?: InputMaybe<Scalars['Boolean']['input']>;
  isNone?: InputMaybe<Scalars['Boolean']['input']>;
  isPlayerKill?: InputMaybe<Scalars['Boolean']['input']>;
  isRvR?: InputMaybe<Scalars['Boolean']['input']>;
  isTome?: InputMaybe<Scalars['Boolean']['input']>;
  isTravel?: InputMaybe<Scalars['Boolean']['input']>;
};

export type QuestTypeFlagsOperationFilterInput = {
  eq?: InputMaybe<QuestTypeFlagsFlagsInput>;
  in?: InputMaybe<Array<QuestTypeFlagsFlagsInput>>;
  neq?: InputMaybe<QuestTypeFlagsFlagsInput>;
  nin?: InputMaybe<Array<QuestTypeFlagsFlagsInput>>;
};

/** A connection to a list of items. */
export type QuestsConnection = {
  __typename?: 'QuestsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<QuestsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Quest>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type QuestsEdge = {
  __typename?: 'QuestsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Quest;
};

/** Player Races */
export enum Race {
  Chaos = 'CHAOS',
  DarkElf = 'DARK_ELF',
  Dwarf = 'DWARF',
  Empire = 'EMPIRE',
  Goblin = 'GOBLIN',
  HighElf = 'HIGH_ELF',
  Orc = 'ORC'
}

export enum RaceMask {
  Chaos = 'CHAOS',
  DarkElf = 'DARK_ELF',
  Dwarf = 'DWARF',
  Empire = 'EMPIRE',
  Goblin = 'GOBLIN',
  HighElf = 'HIGH_ELF',
  Orc = 'ORC'
}

export type RaceMaskFlagsInput = {
  isChaos?: InputMaybe<Scalars['Boolean']['input']>;
  isDarkElf?: InputMaybe<Scalars['Boolean']['input']>;
  isDwarf?: InputMaybe<Scalars['Boolean']['input']>;
  isEmpire?: InputMaybe<Scalars['Boolean']['input']>;
  isGoblin?: InputMaybe<Scalars['Boolean']['input']>;
  isHighElf?: InputMaybe<Scalars['Boolean']['input']>;
  isOrc?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RaceMaskOperationFilterInput = {
  eq?: InputMaybe<RaceMaskFlagsInput>;
  in?: InputMaybe<Array<RaceMaskFlagsInput>>;
  neq?: InputMaybe<RaceMaskFlagsInput>;
  nin?: InputMaybe<Array<RaceMaskFlagsInput>>;
};

export type RankedLeaderboardCharacter = {
  __typename?: 'RankedLeaderboardCharacter';
  /** Rank within career */
  careerRank: Scalars['UnsignedInt']['output'];
  character: Character;
  /** Draws */
  draws: Scalars['UnsignedInt']['output'];
  guild?: Maybe<Guild>;
  /** Losses */
  losses: Scalars['UnsignedInt']['output'];
  /** Matches needed */
  matchesNeeded: Scalars['UnsignedInt']['output'];
  /** Rank */
  rank: Scalars['UnsignedInt']['output'];
  /** Rating */
  rating: Scalars['UnsignedInt']['output'];
  /** Rating type */
  ratingType: RankedLeaderboardRatingType;
  /** Renown rank after last match in season */
  renownRank: Scalars['Byte']['output'];
  /** Season ID */
  seasonId: Scalars['UnsignedShort']['output'];
  /** Wins */
  wins: Scalars['UnsignedInt']['output'];
};

export enum RankedLeaderboardRatingType {
  RankedGroup = 'RANKED_GROUP',
  RankedSolo = 'RANKED_SOLO'
}

export type RankedSeason = {
  __typename?: 'RankedSeason';
  end: Scalars['DateTime']['output'];
  /** Season ID */
  id: Scalars['ID']['output'];
  leaderboard?: Maybe<LeaderboardConnection>;
  /** Is main season or off season */
  mainSeason: Scalars['Boolean']['output'];
  /** Season name */
  name: Scalars['String']['output'];
  start: Scalars['DateTime']['output'];
};


export type RankedSeasonLeaderboardArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  type: RankedLeaderboardRatingType;
  where?: InputMaybe<CharacterSeasonStatsFilterInput>;
};

export enum RatingType {
  Casual = 'CASUAL',
  City = 'CITY',
  RankedGroup = 'RANKED_GROUP',
  RankedSolo = 'RANKED_SOLO'
}

export type RatingTypeOperationFilterInput = {
  eq?: InputMaybe<RatingType>;
  in?: InputMaybe<Array<RatingType>>;
  neq?: InputMaybe<RatingType>;
  nin?: InputMaybe<Array<RatingType>>;
};

export enum Realm {
  /** Destruction */
  Destruction = 'DESTRUCTION',
  /** No realm */
  Neutral = 'NEUTRAL',
  /** Order */
  Order = 'ORDER'
}

export type RealmsOperationFilterInput = {
  eq?: InputMaybe<Realm>;
  in?: InputMaybe<Array<Realm>>;
  neq?: InputMaybe<Realm>;
  nin?: InputMaybe<Array<Realm>>;
};

/** A connection to a list of items. */
export type RewardedFromChaptersConnection = {
  __typename?: 'RewardedFromChaptersConnection';
  /** A list of edges. */
  edges?: Maybe<Array<RewardedFromChaptersEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Chapter>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type RewardedFromChaptersEdge = {
  __typename?: 'RewardedFromChaptersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Chapter;
};

/** A connection to a list of items. */
export type RewardedFromQuestsConnection = {
  __typename?: 'RewardedFromQuestsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<RewardedFromQuestsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Quest>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type RewardedFromQuestsEdge = {
  __typename?: 'RewardedFromQuestsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Quest;
};

export type Scenario = SearchContent & {
  __typename?: 'Scenario';
  /** The unique id of the scenario */
  id: Scalars['ID']['output'];
  /** The name of the scenario */
  name: Scalars['String']['output'];
  /** Zone information */
  zone: Zone;
};

export enum ScenarioEnabledType {
  AlwaysEnabled = 'ALWAYS_ENABLED',
  ByCommand = 'BY_COMMAND',
  Developer = 'DEVELOPER',
  Disabled = 'DISABLED',
  Normal = 'NORMAL'
}

export enum ScenarioQueueType {
  /** City Sieges */
  CitySiege = 'CITY_SIEGE',
  /** Group Ranked scenarios */
  GroupRanked = 'GROUP_RANKED',
  /** Discordant scenarios */
  Solo = 'SOLO',
  /** Solo Ranked scenarios */
  SoloRanked = 'SOLO_RANKED',
  /** Normal scenarios */
  Standard = 'STANDARD'
}

export type ScenarioRecord = {
  __typename?: 'ScenarioRecord';
  /** The end time of the scenario */
  endTime: Scalars['Long']['output'];
  /** Scenario instance Id */
  id: Scalars['ID']['output'];
  /** The kills that occurred in the scenario */
  kills: Array<Kill>;
  /** Points for each team, 0 is order, 1 is destruction */
  points: Array<Maybe<Scalars['UnsignedInt']['output']>>;
  /** Queue type */
  queueType: Scalars['Byte']['output'];
  /** Scenario information */
  scenario: Scenario;
  /** Scenario Id */
  scenarioId: Scalars['ID']['output'];
  /** Scoreboard entries */
  scoreboardEntries: Array<ScenarioScoreboardEntry>;
  /** The skirmishes that occurred in the scenario */
  skirmishes: Array<Skirmish>;
  /** The start time of the scenario */
  startTime: Scalars['Long']['output'];
  /** Scenario tier */
  tier: Scalars['Byte']['output'];
  /** Winning team, 0 is order, 1 is destruction */
  winner: Scalars['Byte']['output'];
};

export type ScenarioRecordFilterInput = {
  and?: InputMaybe<Array<ScenarioRecordFilterInput>>;
  /** The end time of the scenario */
  endTime?: InputMaybe<LongOperationFilterInput>;
  /** Scenario instance Id */
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<ScenarioRecordFilterInput>>;
  /** Queue type */
  queueType?: InputMaybe<ByteOperationFilterInput>;
  /** Scenario Id */
  scenarioId?: InputMaybe<UnsignedIntOperationFilterInputType>;
  /** The start time of the scenario */
  startTime?: InputMaybe<LongOperationFilterInput>;
  /** Scenario tier */
  tier?: InputMaybe<ByteOperationFilterInput>;
  /** Winning team, 0 is order, 1 is destruction */
  winner?: InputMaybe<ByteOperationFilterInput>;
};

export type ScenarioScoreboardEntry = {
  __typename?: 'ScenarioScoreboardEntry';
  /** Character information */
  character: Character;
  /** Damage */
  damage: Scalars['UnsignedInt']['output'];
  /** Damage Received */
  damageReceived: Scalars['UnsignedInt']['output'];
  /** Death blows */
  deathBlows: Scalars['UnsignedInt']['output'];
  /** Deaths */
  deaths: Scalars['UnsignedInt']['output'];
  /** Guild at the time of the scenario */
  guild?: Maybe<Guild>;
  /** Healing */
  healing: Scalars['UnsignedInt']['output'];
  /** Healing of others */
  healingOthers: Scalars['UnsignedInt']['output'];
  /** Healing of self */
  healingReceived: Scalars['UnsignedInt']['output'];
  /** Healing of self */
  healingSelf: Scalars['UnsignedInt']['output'];
  /** Damage contributing to kills */
  killDamage: Scalars['UnsignedInt']['output'];
  /** Kills */
  kills: Scalars['UnsignedInt']['output'];
  /** Solo Kills */
  killsSolo: Scalars['UnsignedInt']['output'];
  /** Level at the time of the scenario */
  level: Scalars['Byte']['output'];
  /** Objective Score */
  objectiveScore: Scalars['UnsignedInt']['output'];
  /** Damage Prevented */
  protection: Scalars['UnsignedInt']['output'];
  /** Protection of others */
  protectionOthers: Scalars['UnsignedInt']['output'];
  /** Protection Received */
  protectionReceived: Scalars['UnsignedInt']['output'];
  /** Protection of self */
  protectionSelf: Scalars['UnsignedInt']['output'];
  /** If true the player left the scenario before it ended */
  quitter: Scalars['Boolean']['output'];
  /** Renown rank at the time of the scenario */
  renownRank: Scalars['Byte']['output'];
  /** Resurrections */
  resurrectionsDone: Scalars['UnsignedInt']['output'];
  /** The team of the player. Normally Order=0, Destruction=1. */
  team: Scalars['Byte']['output'];
};

export enum ScenarioType {
  CaptureTheFlag = 'CAPTURE_THE_FLAG',
  CitySiege = 'CITY_SIEGE',
  DaemonBall = 'DAEMON_BALL',
  Deathmatch = 'DEATHMATCH',
  Domination = 'DOMINATION',
  DominationDragonsBane = 'DOMINATION_DRAGONS_BANE',
  DominationEc = 'DOMINATION_EC',
  DominationForge = 'DOMINATION_FORGE',
  DominationKhaine = 'DOMINATION_KHAINE',
  DominationPush = 'DOMINATION_PUSH',
  DominationPushCenter = 'DOMINATION_PUSH_CENTER',
  DominationTwistingTower = 'DOMINATION_TWISTING_TOWER',
  DoubleDomination = 'DOUBLE_DOMINATION',
  DropBomb = 'DROP_BOMB',
  DropPart = 'DROP_PART',
  FlagDomination = 'FLAG_DOMINATION',
  FlagDominationCreatureBoss = 'FLAG_DOMINATION_CREATURE_BOSS',
  MonsterDefend = 'MONSTER_DEFEND',
  Murderball = 'MURDERBALL',
  PickUpGroupRandom = 'PICK_UP_GROUP_RANDOM',
  Random6V6 = 'RANDOM6V6',
  ReverseDaemonBall = 'REVERSE_DAEMON_BALL',
  RotatingKingOfTheHill = 'ROTATING_KING_OF_THE_HILL'
}

/** A connection to a list of items. */
export type ScenariosConnection = {
  __typename?: 'ScenariosConnection';
  /** A list of edges. */
  edges?: Maybe<Array<ScenariosEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<ScenarioRecord>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type ScenariosEdge = {
  __typename?: 'ScenariosEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: ScenarioRecord;
};

/** A connection to a list of items. */
export type ScoreboardEntriesConnection = {
  __typename?: 'ScoreboardEntriesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<ScoreboardEntriesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<SkirmishScoreboardEntry>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type ScoreboardEntriesEdge = {
  __typename?: 'ScoreboardEntriesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: SkirmishScoreboardEntry;
};

/** A connection to a list of items. */
export type SearchConnection = {
  __typename?: 'SearchConnection';
  /** A list of edges. */
  edges?: Maybe<Array<SearchEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<SearchContent>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

export type SearchContent = {
  /** Id of the content */
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

/** An edge in a connection. */
export type SearchEdge = {
  __typename?: 'SearchEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: SearchContent;
};

export enum Sex {
  /** Female */
  Female = 'FEMALE',
  /** Male */
  Male = 'MALE'
}

export type Skirmish = {
  __typename?: 'Skirmish';
  /** UTC Timestamp of Skirmish end */
  endTime: Scalars['Long']['output'];
  /** Heatmap of kills that happened during this skirmish primary zone */
  heatmap: Array<KillsHeatmapPoint>;
  /** Skirmish Id */
  id: Scalars['ID']['output'];
  /** Scenario instance, null if not in a scenario */
  instance?: Maybe<ScenarioRecord>;
  /** Damage leading to player kills in this skirmish */
  killDamage: Array<KillDamage>;
  /** Damage leading to player kills in this skirmish from a specific character */
  killDamageByCharacter: Array<KillDamage>;
  /** Kills that happened during this skirmish */
  kills?: Maybe<KillsConnection>;
  /** Total number of kills that happened during this skirmish */
  numberOfKills: Scalars['Int']['output'];
  /** Total number of kills that happened during this skirmish for Destruction */
  numberOfKillsDestruction: Scalars['Int']['output'];
  /** Total number of kills that happened during this skirmish for Order */
  numberOfKillsOrder: Scalars['Int']['output'];
  /** Total number of players that participated in this skirmish */
  numberOfPlayers: Scalars['Int']['output'];
  /** Total number of destruction players that participated in this skirmish */
  numberOfPlayersDestruction: Scalars['Int']['output'];
  /** Total number of order players that participated in this skirmish */
  numberOfPlayersOrder: Scalars['Int']['output'];
  /** Primary Zone Info */
  primaryZone?: Maybe<Zone>;
  /** Primary Zone Area Info */
  primaryZoneArea?: Maybe<ZoneArea>;
  /** Scenario, null if not in a scenario */
  scenario?: Maybe<Scenario>;
  /** Scoreboard entries */
  scoreboardEntries?: Maybe<ScoreboardEntriesConnection>;
  /** UTC Timestamp of Skirmish start */
  startTime: Scalars['Long']['output'];
  /** Top guilds by kills */
  topGuildsByKills: Array<SkirmishTopGuild>;
  /** Top guilds by players */
  topGuildsByPlayers: Array<SkirmishTopGuild>;
};


export type SkirmishKillDamageByCharacterArgs = {
  id: Scalars['ID']['input'];
};


export type SkirmishKillsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type SkirmishScoreboardEntriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<SkirmishScoreboardEntrySortInput>>;
};

export type SkirmishFilterInput = {
  and?: InputMaybe<Array<SkirmishFilterInput>>;
  /** End time */
  endTime?: InputMaybe<LongOperationFilterInput>;
  /** Scenario instance */
  instanceId?: InputMaybe<UuidOperationFilterInput>;
  /** Total number of kills */
  numberOfKills?: InputMaybe<IntOperationFilterInput>;
  /** Total number of kills for destruction */
  numberOfKillsDestruction?: InputMaybe<IntOperationFilterInput>;
  /** Total number of kills for order */
  numberOfKillsOrder?: InputMaybe<IntOperationFilterInput>;
  /** Total number of players */
  numberOfPlayers?: InputMaybe<IntOperationFilterInput>;
  /** Total number of players destruction */
  numberOfPlayersDestruction?: InputMaybe<IntOperationFilterInput>;
  /** Total number of players order */
  numberOfPlayersOrder?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<SkirmishFilterInput>>;
  /** Primary Area */
  primaryAreaId?: InputMaybe<UnsignedShortOperationFilterInputType>;
  /** Primary Zone */
  primaryZoneId?: InputMaybe<UnsignedShortOperationFilterInputType>;
  /** Scenario Id */
  scenarioId?: InputMaybe<UnsignedShortOperationFilterInputType>;
  /** Start time */
  startTime?: InputMaybe<LongOperationFilterInput>;
};

export type SkirmishScoreboardEntry = {
  __typename?: 'SkirmishScoreboardEntry';
  /** If true the player left the scenario before it ended */
  career: Career;
  /** Character information */
  character: Character;
  /** Damage */
  damage: Scalars['UnsignedInt']['output'];
  /** Damage Received */
  damageReceived: Scalars['UnsignedInt']['output'];
  /** Death blows */
  deathBlows: Scalars['UnsignedInt']['output'];
  /** Deaths */
  deaths: Scalars['UnsignedInt']['output'];
  /** Guild at the time of the scenario */
  guild?: Maybe<Guild>;
  /** Healing */
  healing: Scalars['UnsignedInt']['output'];
  /** Healing of others */
  healingOthers: Scalars['UnsignedInt']['output'];
  /** Healing of self */
  healingReceived: Scalars['UnsignedInt']['output'];
  /** Healing of self */
  healingSelf: Scalars['UnsignedInt']['output'];
  /** Damage contributing to kills */
  killDamage: Scalars['UnsignedInt']['output'];
  /** Kills */
  kills: Scalars['UnsignedInt']['output'];
  /** Solo Kills */
  killsSolo: Scalars['UnsignedInt']['output'];
  /** Level at the time of the scenario */
  level: Scalars['Byte']['output'];
  /** Damage Prevented */
  protection: Scalars['UnsignedInt']['output'];
  /** Protection of others */
  protectionOthers: Scalars['UnsignedInt']['output'];
  /** Protection Received */
  protectionReceived: Scalars['UnsignedInt']['output'];
  /** Protection of self */
  protectionSelf: Scalars['UnsignedInt']['output'];
  /** The realm of the player */
  realm: Realm;
  /** Renown rank at the time of the scenario */
  renownRank: Scalars['Byte']['output'];
  /** Resurrections */
  resurrectionsDone: Scalars['UnsignedInt']['output'];
};

export type SkirmishScoreboardEntrySortInput = {
  damage?: InputMaybe<SortEnumType>;
  deathBlows?: InputMaybe<SortEnumType>;
  deaths?: InputMaybe<SortEnumType>;
  healing?: InputMaybe<SortEnumType>;
  killDamage?: InputMaybe<SortEnumType>;
  kills?: InputMaybe<SortEnumType>;
  level?: InputMaybe<SortEnumType>;
  protection?: InputMaybe<SortEnumType>;
  renownRank?: InputMaybe<SortEnumType>;
};

export type SkirmishTopGuild = {
  __typename?: 'SkirmishTopGuild';
  /** Value */
  count: Scalars['Int']['output'];
  /** Guild information */
  guild: Guild;
};

/** A connection to a list of items. */
export type SkirmishesConnection = {
  __typename?: 'SkirmishesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<SkirmishesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Skirmish>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type SkirmishesEdge = {
  __typename?: 'SkirmishesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Skirmish;
};

/** A connection to a list of items. */
export type SoldByVendorsConnection = {
  __typename?: 'SoldByVendorsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<SoldByVendorsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<VendorItem>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type SoldByVendorsEdge = {
  __typename?: 'SoldByVendorsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: VendorItem;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum Stat {
  ActionPointCost = 'ACTION_POINT_COST',
  ActionPointRegen = 'ACTION_POINT_REGEN',
  AggroRadius = 'AGGRO_RADIUS',
  Agility = 'AGILITY',
  Apothecary = 'APOTHECARY',
  Armor = 'ARMOR',
  ArmorPenetration = 'ARMOR_PENETRATION',
  ArmorPenetrationReduction = 'ARMOR_PENETRATION_REDUCTION',
  AutoAttackDamage = 'AUTO_ATTACK_DAMAGE',
  AutoAttackSpeed = 'AUTO_ATTACK_SPEED',
  BallisticSkill = 'BALLISTIC_SKILL',
  Block = 'BLOCK',
  BlockStrikethrough = 'BLOCK_STRIKETHROUGH',
  BuildTime = 'BUILD_TIME',
  Butchering = 'BUTCHERING',
  Cooldown = 'COOLDOWN',
  CorporealResistance = 'CORPOREAL_RESISTANCE',
  CriticalDamage = 'CRITICAL_DAMAGE',
  CriticalDamageTakenReduction = 'CRITICAL_DAMAGE_TAKEN_REDUCTION',
  CriticalHitRate = 'CRITICAL_HIT_RATE',
  CriticalHitRateReduction = 'CRITICAL_HIT_RATE_REDUCTION',
  Cultivation = 'CULTIVATION',
  DamageAbsorb = 'DAMAGE_ABSORB',
  DismountChance = 'DISMOUNT_CHANCE',
  Disrupt = 'DISRUPT',
  DisruptStrikethrough = 'DISRUPT_STRIKETHROUGH',
  EffectBuff = 'EFFECT_BUFF',
  EffectResist = 'EFFECT_RESIST',
  ElementalResistance = 'ELEMENTAL_RESISTANCE',
  Evade = 'EVADE',
  EvadeStrikethrough = 'EVADE_STRIKETHROUGH',
  Fortitude = 'FORTITUDE',
  GoldLooted = 'GOLD_LOOTED',
  Gravity = 'GRAVITY',
  HateCaused = 'HATE_CAUSED',
  HateReceived = 'HATE_RECEIVED',
  HealingPower = 'HEALING_POWER',
  HealthRegen = 'HEALTH_REGEN',
  HealCritRate = 'HEAL_CRIT_RATE',
  IncomingDamage = 'INCOMING_DAMAGE',
  IncomingDamagePercent = 'INCOMING_DAMAGE_PERCENT',
  IncomingHealPercent = 'INCOMING_HEAL_PERCENT',
  InfluenceReceived = 'INFLUENCE_RECEIVED',
  InfluenceWorth = 'INFLUENCE_WORTH',
  Initiative = 'INITIATIVE',
  Intelligence = 'INTELLIGENCE',
  InteractTime = 'INTERACT_TIME',
  LevitationHeight = 'LEVITATION_HEIGHT',
  LootChance = 'LOOT_CHANCE',
  MagicCritRate = 'MAGIC_CRIT_RATE',
  MagicPower = 'MAGIC_POWER',
  Mastery_1Bonus = 'MASTERY_1_BONUS',
  Mastery_2Bonus = 'MASTERY_2_BONUS',
  Mastery_3Bonus = 'MASTERY_3_BONUS',
  MaxActionPoints = 'MAX_ACTION_POINTS',
  MeleeCritRate = 'MELEE_CRIT_RATE',
  MeleePower = 'MELEE_POWER',
  MinimumRange = 'MINIMUM_RANGE',
  MonetaryWorth = 'MONETARY_WORTH',
  MoraleRegen = 'MORALE_REGEN',
  OffhandDamage = 'OFFHAND_DAMAGE',
  OffhandProcChance = 'OFFHAND_PROC_CHANCE',
  OutgoingDamage = 'OUTGOING_DAMAGE',
  OutgoingDamagePercent = 'OUTGOING_DAMAGE_PERCENT',
  OutgoingHealPercent = 'OUTGOING_HEAL_PERCENT',
  Parry = 'PARRY',
  ParryStrikethrough = 'PARRY_STRIKETHROUGH',
  Radius = 'RADIUS',
  Range = 'RANGE',
  RangedCritRate = 'RANGED_CRIT_RATE',
  RangedPower = 'RANGED_POWER',
  RenownReceived = 'RENOWN_RECEIVED',
  RenownWorth = 'RENOWN_WORTH',
  Salvaging = 'SALVAGING',
  Scavenging = 'SCAVENGING',
  SetbackChance = 'SETBACK_CHANCE',
  SetbackValue = 'SETBACK_VALUE',
  Specialization = 'SPECIALIZATION',
  SpiritResistance = 'SPIRIT_RESISTANCE',
  Stealth = 'STEALTH',
  StealthDetection = 'STEALTH_DETECTION',
  Strength = 'STRENGTH',
  TalismanMaking = 'TALISMAN_MAKING',
  TargetDuration = 'TARGET_DURATION',
  Toughness = 'TOUGHNESS',
  Velocity = 'VELOCITY',
  WeaponSkill = 'WEAPON_SKILL',
  Willpower = 'WILLPOWER',
  Wounds = 'WOUNDS',
  XpReceived = 'XP_RECEIVED',
  XpWorth = 'XP_WORTH'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum TomeHelpType {
  AdvancedHelp = 'ADVANCED_HELP',
  BeginnerHelp = 'BEGINNER_HELP',
  GameplayHelp = 'GAMEPLAY_HELP',
  None = 'NONE',
  UiHelp = 'UI_HELP'
}

export type TomeHelpTypeOperationFilterInput = {
  eq?: InputMaybe<TomeHelpType>;
  in?: InputMaybe<Array<TomeHelpType>>;
  neq?: InputMaybe<TomeHelpType>;
  nin?: InputMaybe<Array<TomeHelpType>>;
};

/** A connection to a list of items. */
export type TomeOfKnowledgeAchievementEntriesConnection = {
  __typename?: 'TomeOfKnowledgeAchievementEntriesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TomeOfKnowledgeAchievementEntriesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<TomeOfKnowledgeAchievementEntry>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type TomeOfKnowledgeAchievementEntriesEdge = {
  __typename?: 'TomeOfKnowledgeAchievementEntriesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: TomeOfKnowledgeAchievementEntry;
};

export type TomeOfKnowledgeAchievementEntry = {
  __typename?: 'TomeOfKnowledgeAchievementEntry';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  rewards: Array<TomeOfKnowledgeAchievementReward>;
  subType: TomeOfKnowledgeAchievementSubType;
};

export type TomeOfKnowledgeAchievementEntryFilterInput = {
  and?: InputMaybe<Array<TomeOfKnowledgeAchievementEntryFilterInput>>;
  /** Name */
  description?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TomeOfKnowledgeAchievementEntryFilterInput>>;
  /** SubType */
  tomeAchievementSubTypeId?: InputMaybe<UnsignedIntOperationFilterInputType>;
};

export type TomeOfKnowledgeAchievementReward = {
  id: Scalars['ID']['output'];
};

export type TomeOfKnowledgeAchievementRewardActionCounter = TomeOfKnowledgeAchievementReward & {
  __typename?: 'TomeOfKnowledgeAchievementRewardActionCounter';
  /** Ability Info */
  ability: AbilityInfo;
  id: Scalars['ID']['output'];
};

export type TomeOfKnowledgeAchievementRewardItem = TomeOfKnowledgeAchievementReward & {
  __typename?: 'TomeOfKnowledgeAchievementRewardItem';
  /** Item is automatically added to player inventory */
  autoCreate: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /** Item info */
  item: Item;
};

export type TomeOfKnowledgeAchievementRewardTitle = TomeOfKnowledgeAchievementReward & {
  __typename?: 'TomeOfKnowledgeAchievementRewardTitle';
  id: Scalars['ID']['output'];
  /** Tome of Knowledge entry */
  title: TomeOfKnowledgeEntry;
};

export type TomeOfKnowledgeAchievementSubType = {
  __typename?: 'TomeOfKnowledgeAchievementSubType';
  description: Scalars['String']['output'];
  entries: Array<TomeOfKnowledgeAchievementEntry>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: TomeOfKnowledgeAchievementType;
};

export type TomeOfKnowledgeAchievementType = {
  __typename?: 'TomeOfKnowledgeAchievementType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  subTypes: Array<TomeOfKnowledgeAchievementSubType>;
};

/** A connection to a list of items. */
export type TomeOfKnowledgeEntriesConnection = {
  __typename?: 'TomeOfKnowledgeEntriesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<TomeOfKnowledgeEntriesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<TomeOfKnowledgeEntry>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type TomeOfKnowledgeEntriesEdge = {
  __typename?: 'TomeOfKnowledgeEntriesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: TomeOfKnowledgeEntry;
};

export type TomeOfKnowledgeEntry = SearchContent & {
  __typename?: 'TomeOfKnowledgeEntry';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  realm: Realm;
  xp: Scalars['UnsignedInt']['output'];
};

export type TomeOfKnowledgeEntryFilterInput = {
  and?: InputMaybe<Array<TomeOfKnowledgeEntryFilterInput>>;
  /** Description */
  description?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TomeOfKnowledgeEntryFilterInput>>;
  /** Realm */
  realm?: InputMaybe<RealmsOperationFilterInput>;
  /** Tome of Knowledge section */
  tomeSection?: InputMaybe<NullableOfTomeSectionOperationFilterInput>;
  /** Type */
  type?: InputMaybe<TomeHelpTypeOperationFilterInput>;
  /** XP reward */
  xp?: InputMaybe<UnsignedIntOperationFilterInputType>;
};

/** Tome Of Knowledge sections */
export enum TomeOfKnowledgeSection {
  Achievements = 'ACHIEVEMENTS',
  Bestiary = 'BESTIARY',
  GameFaq = 'GAME_FAQ',
  GameManual = 'GAME_MANUAL',
  Help = 'HELP',
  HistoryAndLore = 'HISTORY_AND_LORE',
  LiveEvent = 'LIVE_EVENT',
  NoteworthyPersons = 'NOTEWORTHY_PERSONS',
  OldWorldArmory = 'OLD_WORLD_ARMORY',
  PlayerTitles = 'PLAYER_TITLES',
  Tactics = 'TACTICS',
  Ward = 'WARD',
  WarJournal = 'WAR_JOURNAL',
  ZoneMaps = 'ZONE_MAPS'
}

export enum TradeSkill {
  Apothecary = 'APOTHECARY',
  Butchering = 'BUTCHERING',
  Cultivation = 'CULTIVATION',
  None = 'NONE',
  Salvaging = 'SALVAGING',
  Scavenging = 'SCAVENGING',
  TalismanMaking = 'TALISMAN_MAKING'
}

export type UnsignedIntOperationFilterInputType = {
  eq?: InputMaybe<Scalars['UnsignedInt']['input']>;
  gt?: InputMaybe<Scalars['UnsignedInt']['input']>;
  gte?: InputMaybe<Scalars['UnsignedInt']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UnsignedInt']['input']>>>;
  lt?: InputMaybe<Scalars['UnsignedInt']['input']>;
  lte?: InputMaybe<Scalars['UnsignedInt']['input']>;
  neq?: InputMaybe<Scalars['UnsignedInt']['input']>;
  ngt?: InputMaybe<Scalars['UnsignedInt']['input']>;
  ngte?: InputMaybe<Scalars['UnsignedInt']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UnsignedInt']['input']>>>;
  nlt?: InputMaybe<Scalars['UnsignedInt']['input']>;
  nlte?: InputMaybe<Scalars['UnsignedInt']['input']>;
};

export type UnsignedLongOperationFilterInputType = {
  eq?: InputMaybe<Scalars['UnsignedLong']['input']>;
  gt?: InputMaybe<Scalars['UnsignedLong']['input']>;
  gte?: InputMaybe<Scalars['UnsignedLong']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UnsignedLong']['input']>>>;
  lt?: InputMaybe<Scalars['UnsignedLong']['input']>;
  lte?: InputMaybe<Scalars['UnsignedLong']['input']>;
  neq?: InputMaybe<Scalars['UnsignedLong']['input']>;
  ngt?: InputMaybe<Scalars['UnsignedLong']['input']>;
  ngte?: InputMaybe<Scalars['UnsignedLong']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UnsignedLong']['input']>>>;
  nlt?: InputMaybe<Scalars['UnsignedLong']['input']>;
  nlte?: InputMaybe<Scalars['UnsignedLong']['input']>;
};

export type UnsignedShortOperationFilterInputType = {
  eq?: InputMaybe<Scalars['UnsignedShort']['input']>;
  gt?: InputMaybe<Scalars['UnsignedShort']['input']>;
  gte?: InputMaybe<Scalars['UnsignedShort']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UnsignedShort']['input']>>>;
  lt?: InputMaybe<Scalars['UnsignedShort']['input']>;
  lte?: InputMaybe<Scalars['UnsignedShort']['input']>;
  neq?: InputMaybe<Scalars['UnsignedShort']['input']>;
  ngt?: InputMaybe<Scalars['UnsignedShort']['input']>;
  ngte?: InputMaybe<Scalars['UnsignedShort']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UnsignedShort']['input']>>>;
  nlt?: InputMaybe<Scalars['UnsignedShort']['input']>;
  nlte?: InputMaybe<Scalars['UnsignedShort']['input']>;
};

/** A connection to a list of items. */
export type UsedToPurchaseConnection = {
  __typename?: 'UsedToPurchaseConnection';
  /** A list of edges. */
  edges?: Maybe<Array<UsedToPurchaseEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<VendorItem>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type UsedToPurchaseEdge = {
  __typename?: 'UsedToPurchaseEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: VendorItem;
};

export type UuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  gt?: InputMaybe<Scalars['UUID']['input']>;
  gte?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  lt?: InputMaybe<Scalars['UUID']['input']>;
  lte?: InputMaybe<Scalars['UUID']['input']>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
  ngt?: InputMaybe<Scalars['UUID']['input']>;
  ngte?: InputMaybe<Scalars['UUID']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  nlt?: InputMaybe<Scalars['UUID']['input']>;
  nlte?: InputMaybe<Scalars['UUID']['input']>;
};

export type VendorItem = {
  __typename?: 'VendorItem';
  count: Scalars['UnsignedShort']['output'];
  creatures: Array<Creature>;
  item: Item;
  /** Cost in copper coins */
  price: Scalars['UnsignedInt']['output'];
  requiredItems: Array<VendorItemRequiredItem>;
  soldBy: Array<Creature>;
};

export type VendorItemRequiredItem = {
  __typename?: 'VendorItemRequiredItem';
  /** Amount needed */
  count: Scalars['UnsignedShort']['output'];
  item: Item;
};

/** A connection to a list of items. */
export type VendorItemsConnection = {
  __typename?: 'VendorItemsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<VendorItemsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<VendorItem>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type VendorItemsEdge = {
  __typename?: 'VendorItemsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: VendorItem;
};

/** Holds information about one attacker in a kill */
export type Victim = {
  __typename?: 'Victim';
  /** Character information */
  character: Character;
  /** Guild at the time of the kill */
  guild?: Maybe<Guild>;
  /** Level at the time of the kill */
  level: Scalars['Byte']['output'];
  /** Renown rank at the time of the kill */
  renownRank: Scalars['Byte']['output'];
};

/** Activities in a War Journal entry */
export type WarJournalActivity = {
  __typename?: 'WarJournalActivity';
  activityType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Name of the activity */
  name: Scalars['String']['output'];
  tasks: Array<WarJournalActivityTask>;
  text: Scalars['String']['output'];
  zone?: Maybe<Zone>;
};

/** Tasks in a War Journal activity */
export type WarJournalActivityTask = {
  __typename?: 'WarJournalActivityTask';
  name: Scalars['String']['output'];
  text: Scalars['String']['output'];
};

/** Entries in the War Journal */
export type WarJournalEntry = {
  __typename?: 'WarJournalEntry';
  activities: Array<WarJournalActivity>;
  area?: Maybe<ZoneArea>;
  id: Scalars['ID']['output'];
  influenceRewards: Array<ChapterInfluenceReward>;
  isRvR: Scalars['Boolean']['output'];
  locationText?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  npcName?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Position>;
  shortTitle?: Maybe<Scalars['String']['output']>;
  storyline: WarJournalStoryline;
  text?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  zone?: Maybe<Zone>;
};

export type WarJournalEntryFilterInput = {
  and?: InputMaybe<Array<WarJournalEntryFilterInput>>;
  areaId?: InputMaybe<UnsignedShortOperationFilterInputType>;
  isRvR?: InputMaybe<BooleanOperationFilterInput>;
  /** Name of the entry */
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<WarJournalEntryFilterInput>>;
  storylineId?: InputMaybe<UnsignedIntOperationFilterInputType>;
  zoneId?: InputMaybe<UnsignedShortOperationFilterInputType>;
};

/** Storylines in the War Journal */
export type WarJournalStoryline = {
  __typename?: 'WarJournalStoryline';
  entries: Array<WarJournalEntry>;
  id: Scalars['ID']['output'];
  /** Name of the storyline */
  name: Scalars['String']['output'];
  summary: Scalars['String']['output'];
};

export type WarJournalStorylineFilterInput = {
  and?: InputMaybe<Array<WarJournalStorylineFilterInput>>;
  /** Name of the storyline */
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<WarJournalStorylineFilterInput>>;
};

export type ZandriExpeditionEvent = Event & {
  __typename?: 'ZandriExpeditionEvent';
  endTime?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  startTime: Scalars['DateTime']['output'];
};

export type Zone = SearchContent & {
  __typename?: 'Zone';
  /** The unique id of the zone */
  id: Scalars['ID']['output'];
  /** The map setup of the zone */
  mapSetup?: Maybe<MapSetup>;
  /** The name of the zone */
  name: Scalars['String']['output'];
};

export type ZoneArea = {
  __typename?: 'ZoneArea';
  /** The unique id of the zone area */
  id: Scalars['ID']['output'];
  /** The map setup of the zone area */
  mapSetup?: Maybe<MapSetup>;
  /** The name of the zone area */
  name?: Maybe<Scalars['String']['output']>;
  /** Zone information */
  zone: Zone;
};

export enum ZoneType {
  Instance = 'INSTANCE',
  Normal = 'NORMAL',
  Scenario = 'SCENARIO'
}

export type GetRankedLeaderboardQueryVariables = Exact<{
  season?: InputMaybe<Scalars['ID']['input']>;
  type: RankedLeaderboardRatingType;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetRankedLeaderboardQuery = { __typename?: 'Query', rankedSeason?: { __typename?: 'RankedSeason', id: string, mainSeason: boolean, name: string, start: any, end: any, leaderboard?: { __typename?: 'LeaderboardConnection', nodes?: Array<{ __typename?: 'RankedLeaderboardCharacter', careerRank: any, rank: any, rating: any, wins: any, losses: any, draws: any, renownRank: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null } | null };

export type GetCharacterArmoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCharacterArmoryQuery = { __typename?: 'Query', character?: { __typename?: 'Character', items: Array<{ __typename?: 'CharacterItem', equipSlot: EquipSlot, talismans: Array<{ __typename?: 'Item', id: string, name: string, rarity: ItemRarity, iconUrl: any, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }> }>, item: { __typename?: 'Item', id: string, iconUrl: any, name: string, careerRestriction: Array<Career>, raceRestriction: Array<Race>, uniqueEquipped: boolean, description: string, type: ItemType, slot: EquipSlot, rarity: ItemRarity, armor: any, dps: any, speed: any, levelRequirement: any, renownRankRequirement: any, itemLevel: any, talismanSlots: any, itemSet?: { __typename?: 'ItemSet', id: string, name: string, items: Array<{ __typename?: 'Item', id: string }>, bonuses: Array<{ __typename?: 'ItemSetBonus', itemsRequired: any, bonus: { __typename: 'Ability', description?: string | null } | { __typename: 'ItemStat', stat: Stat, value: any, percentage: boolean } }> } | null, abilities: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }> } }> } | null };

export type GetCharacterInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCharacterInfoQuery = { __typename?: 'Query', character?: { __typename?: 'Character', name: string, career: Career, level: any, renownRank: any, guildMembership?: { __typename?: 'GuildMember', guild: { __typename?: 'Guild', id: string, name: string } } | null } | null };

export type TalismanFragment = { __typename?: 'Item', id: string, name: string, rarity: ItemRarity, iconUrl: any, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }> };

export type EquippedCharacterItemFragment = { __typename?: 'CharacterItem', equipSlot: EquipSlot, talismans: Array<{ __typename?: 'Item', id: string, name: string, rarity: ItemRarity, iconUrl: any, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }> }>, item: { __typename?: 'Item', id: string, iconUrl: any, name: string, careerRestriction: Array<Career>, raceRestriction: Array<Race>, uniqueEquipped: boolean, description: string, type: ItemType, slot: EquipSlot, rarity: ItemRarity, armor: any, dps: any, speed: any, levelRequirement: any, renownRankRequirement: any, itemLevel: any, talismanSlots: any, itemSet?: { __typename?: 'ItemSet', id: string, name: string, items: Array<{ __typename?: 'Item', id: string }>, bonuses: Array<{ __typename?: 'ItemSetBonus', itemsRequired: any, bonus: { __typename: 'Ability', description?: string | null } | { __typename: 'ItemStat', stat: Stat, value: any, percentage: boolean } }> } | null, abilities: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }> } };

export type GetCharacterLatestSkirmishesQueryVariables = Exact<{
  characterId?: InputMaybe<Scalars['ID']['input']>;
  where?: InputMaybe<SkirmishFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCharacterLatestSkirmishesQuery = { __typename?: 'Query', skirmishes?: { __typename?: 'SkirmishesConnection', nodes?: Array<{ __typename?: 'Skirmish', id: string, startTime: any, endTime: any, numberOfKills: number, numberOfKillsOrder: number, numberOfKillsDestruction: number, numberOfPlayers: number, numberOfPlayersOrder: number, numberOfPlayersDestruction: number, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, primaryZone?: { __typename?: 'Zone', id: string, name: string } | null, primaryZoneArea?: { __typename?: 'ZoneArea', id: string, name?: string | null } | null, topGuildsByPlayers: Array<{ __typename?: 'SkirmishTopGuild', count: number, guild: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetLatestCharacterDeathsQueryVariables = Exact<{
  id: Scalars['UnsignedInt']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<IntOperationFilterInput>;
  soloOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetLatestCharacterDeathsQuery = { __typename?: 'Query', kills?: { __typename?: 'KillsConnection', nodes?: Array<{ __typename?: 'Kill', id: string, time: number, position: { __typename?: 'Position', zone?: { __typename?: 'Zone', id: string, name: string } | null }, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, attackers: Array<{ __typename?: 'Attacker', level: any, renownRank: any, damagePercent: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetLatestCharacterKillsQueryVariables = Exact<{
  id: Scalars['UnsignedInt']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<IntOperationFilterInput>;
  soloOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetLatestCharacterKillsQuery = { __typename?: 'Query', kills?: { __typename?: 'KillsConnection', totalCount: number, nodes?: Array<{ __typename?: 'Kill', id: string, time: number, position: { __typename?: 'Position', zone?: { __typename?: 'Zone', id: string, name: string } | null }, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, attackers: Array<{ __typename?: 'Attacker', damagePercent: any }>, victim: { __typename?: 'Victim', level: any, renownRank: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null } }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetVendorItemsFromCreatureQueryVariables = Exact<{
  creatureId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetVendorItemsFromCreatureQuery = { __typename?: 'Query', creature?: { __typename?: 'Creature', id: string, vendorItems?: { __typename?: 'VendorItemsConnection', nodes?: Array<{ __typename?: 'VendorItem', count: any, price: any, item: { __typename?: 'Item', id: string, name: string, iconUrl: any }, requiredItems: Array<{ __typename?: 'VendorItemRequiredItem', count: any, item: { __typename?: 'Item', id: string, name: string, iconUrl: any } }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null } | null };

export type GetGuildFeudQueryVariables = Exact<{
  guild1Id: Scalars['ID']['input'];
  guild2Id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGuildFeudQuery = { __typename?: 'Query', kills?: { __typename?: 'KillsConnection', nodes?: Array<{ __typename?: 'Kill', id: string, time: number, position: { __typename?: 'Position', zoneId: any }, scenario?: { __typename?: 'Scenario', id: string } | null, victim: { __typename?: 'Victim', level: any, renownRank: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }, attackers: Array<{ __typename?: 'Attacker', level: any, renownRank: any, damagePercent: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GuildInfoFragment = { __typename?: 'Guild', name: string, description: string, briefDescription: string, level: any, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number }, leader?: { __typename?: 'Character', id: string, name: string, career: Career } | null, members?: { __typename?: 'MembersConnection', totalCount: number } | null };

export type GetGuildLatestSkirmishesQueryVariables = Exact<{
  guildId?: InputMaybe<Scalars['ID']['input']>;
  where?: InputMaybe<SkirmishFilterInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGuildLatestSkirmishesQuery = { __typename?: 'Query', skirmishes?: { __typename?: 'SkirmishesConnection', nodes?: Array<{ __typename?: 'Skirmish', id: string, startTime: any, endTime: any, numberOfKills: number, numberOfKillsOrder: number, numberOfKillsDestruction: number, numberOfPlayers: number, numberOfPlayersOrder: number, numberOfPlayersDestruction: number, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, primaryZone?: { __typename?: 'Zone', id: string, name: string } | null, primaryZoneArea?: { __typename?: 'ZoneArea', id: string, name?: string | null } | null, topGuildsByPlayers: Array<{ __typename?: 'SkirmishTopGuild', count: number, guild: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetGuildMembersQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGuildMembersQuery = { __typename?: 'Query', guild?: { __typename?: 'Guild', members?: { __typename?: 'MembersConnection', nodes?: Array<{ __typename?: 'GuildMember', rank: { __typename?: 'GuildRank', name: string }, character: { __typename?: 'Character', id: string, name: string, career: Career, level: any, renownRank: any } }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null } | null };

export type GetLatestGuildDeathsQueryVariables = Exact<{
  id: Scalars['UnsignedInt']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<IntOperationFilterInput>;
  soloOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetLatestGuildDeathsQuery = { __typename?: 'Query', kills?: { __typename?: 'KillsConnection', nodes?: Array<{ __typename?: 'Kill', id: string, time: number, position: { __typename?: 'Position', zone?: { __typename?: 'Zone', id: string, name: string } | null }, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, attackers: Array<{ __typename?: 'Attacker', level: any, renownRank: any, damagePercent: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }>, victim: { __typename?: 'Victim', level: any, renownRank: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null } }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetLatestGuildKillsQueryVariables = Exact<{
  id: Scalars['UnsignedInt']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  time?: InputMaybe<IntOperationFilterInput>;
  soloOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetLatestGuildKillsQuery = { __typename?: 'Query', kills?: { __typename?: 'KillsConnection', totalCount: number, nodes?: Array<{ __typename?: 'Kill', id: string, time: number, position: { __typename?: 'Position', zone?: { __typename?: 'Zone', id: string, name: string } | null }, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, attackers: Array<{ __typename?: 'Attacker', level: any, renownRank: any, damagePercent: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }>, victim: { __typename?: 'Victim', level: any, renownRank: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null } }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type InstanceRunScoreboardEntryFragment = { __typename?: 'InstanceRunScoreboardEntry', level: any, renownRank: any, archetype: Archetype, itemRating: any, deaths: any, damage: any, killDamage: any, healing: any, healingSelf: any, healingOthers: any, protection: any, protectionSelf: any, protectionOthers: any, damageReceived: any, resurrectionsDone: any, healingReceived: any, protectionReceived: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null };

export type InstanceEncounterRunScoreboardEntryFragment = { __typename?: 'InstanceEncounterRunScoreboardEntry', level: any, renownRank: any, archetype: Archetype, itemRating: any, deaths: any, damage: any, killDamage: any, healing: any, healingSelf: any, healingOthers: any, protection: any, protectionSelf: any, protectionOthers: any, damageReceived: any, resurrectionsDone: any, healingReceived: any, protectionReceived: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null };

export type GetInstanceRunsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<InstanceRunFilterInput>;
}>;


export type GetInstanceRunsQuery = { __typename?: 'Query', instanceRuns?: { __typename?: 'InstanceRunsConnection', totalCount: number, averageDuration: number, averageDeaths: number, nodes?: Array<{ __typename?: 'InstanceRun', id: string, instanceId: string, start: any, end: any, completed: boolean, instance: { __typename?: 'Instance', id: string, name: string }, scoreboardEntries: Array<{ __typename?: 'InstanceRunScoreboardEntry', itemRating: any, deaths: any, archetype: Archetype, damage: any, healing: any }>, encounters: Array<{ __typename?: 'InstanceEncounterRun', encounterId: string }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type ItemListEntryFragment = { __typename?: 'Item', id: string, iconUrl: any, name: string, careerRestriction: Array<Career>, raceRestriction: Array<Race>, uniqueEquipped: boolean, description: string, type: ItemType, slot: EquipSlot, rarity: ItemRarity, armor: any, dps: any, speed: any, levelRequirement: any, renownRankRequirement: any, itemLevel: any, talismanSlots: any, itemSet?: { __typename?: 'ItemSet', id: string, name: string, items: Array<{ __typename?: 'Item', id: string }>, bonuses: Array<{ __typename?: 'ItemSetBonus', itemsRequired: any, bonus: { __typename: 'Ability', description?: string | null } | { __typename: 'ItemStat', stat: Stat, value: any, percentage: boolean } }> } | null, abilities: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }> };

export type GetItemPopupInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetItemPopupInfoQuery = { __typename?: 'Query', item?: { __typename?: 'Item', id: string, iconUrl: any, name: string, careerRestriction: Array<Career>, raceRestriction: Array<Race>, uniqueEquipped: boolean, description: string, type: ItemType, slot: EquipSlot, rarity: ItemRarity, armor: any, dps: any, speed: any, levelRequirement: any, renownRankRequirement: any, itemLevel: any, talismanSlots: any, itemSet?: { __typename?: 'ItemSet', id: string, name: string, items: Array<{ __typename?: 'Item', id: string }>, bonuses: Array<{ __typename?: 'ItemSetBonus', itemsRequired: any, bonus: { __typename: 'Ability', description?: string | null } | { __typename: 'ItemStat', stat: Stat, value: any, percentage: boolean } }> } | null, abilities: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }> } | null };

export type GetItemRewardedFromQuestsQueryVariables = Exact<{
  itemId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetItemRewardedFromQuestsQuery = { __typename?: 'Query', item?: { __typename?: 'Item', id: string, rewardedFromQuests?: { __typename?: 'RewardedFromQuestsConnection', nodes?: Array<{ __typename?: 'Quest', id: string, name: string, repeatableType: QuestRepeatableType, type: { __typename?: 'QuestTypeFlagsFlags', isGroup: boolean, isTravel: boolean, isTome: boolean, isRvR: boolean, isPlayerKill: boolean, isEpic: boolean }, rewardsChoice: Array<{ __typename?: 'QuestReward', count: any, item: { __typename?: 'Item', id: string, name: string, iconUrl: any } }>, rewardsGiven: Array<{ __typename?: 'QuestReward', count: any, item: { __typename?: 'Item', id: string, name: string, iconUrl: any } }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null } | null };

export type GetItemUsedToPurchaseQueryVariables = Exact<{
  itemId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  usableByCareer?: InputMaybe<Career>;
}>;


export type GetItemUsedToPurchaseQuery = { __typename?: 'Query', item?: { __typename?: 'Item', id: string, usedToPurchase?: { __typename?: 'UsedToPurchaseConnection', nodes?: Array<{ __typename?: 'VendorItem', count: any, price: any, item: { __typename?: 'Item', id: string, name: string, iconUrl: any }, requiredItems: Array<{ __typename?: 'VendorItemRequiredItem', count: any, item: { __typename?: 'Item', id: string, name: string, iconUrl: any } }>, creatures: Array<{ __typename?: 'Creature', id: string, name: string, realm?: Realm | null, spawns: Array<{ __typename?: 'CreatureSpawn', zone: { __typename?: 'Zone', name: string } }> }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null } | null };

export type GetItemSoldByVendorsQueryVariables = Exact<{
  itemId: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetItemSoldByVendorsQuery = { __typename?: 'Query', item?: { __typename?: 'Item', id: string, soldByVendors?: { __typename?: 'SoldByVendorsConnection', nodes?: Array<{ __typename?: 'VendorItem', price: any, requiredItems: Array<{ __typename?: 'VendorItemRequiredItem', count: any, item: { __typename?: 'Item', id: string, name: string, iconUrl: any } }>, creatures: Array<{ __typename?: 'Creature', id: string, name: string, realm?: Realm | null, spawns: Array<{ __typename?: 'CreatureSpawn', zone: { __typename?: 'Zone', name: string } }> }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null } | null };

export type AttackerFragment = { __typename?: 'Attacker', damagePercent: any, level: any, renownRank: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null };

export type KillDamageFragment = { __typename?: 'KillDamage', attackerType: KillDamageAttackerType, damageType: KillDamageSourceType, damageAmount: any, attacker?: { __typename?: 'Character', id: string } | null, ability?: { __typename?: 'AbilityInfo', id: string, name?: string | null, iconUrl: string } | null };

export type GetLatestKillsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetLatestKillsQuery = { __typename?: 'Query', kills?: { __typename?: 'KillsConnection', nodes?: Array<{ __typename?: 'Kill', id: string, time: number, position: { __typename?: 'Position', zone?: { __typename?: 'Zone', id: string, name: string } | null }, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, victim: { __typename?: 'Victim', level: any, renownRank: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }, attackers: Array<{ __typename?: 'Attacker', level: any, renownRank: any, damagePercent: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetMonthlyGuildLeaderboardQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
}>;


export type GetMonthlyGuildLeaderboardQuery = { __typename?: 'Query', monthlyGuildKillLeaderboard: Array<{ __typename?: 'KillGuildLeaderboardEntry', rank: number, kills: number, guild: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } }> };

export type GetMonthlyLeaderboardQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
}>;


export type GetMonthlyLeaderboardQuery = { __typename?: 'Query', monthlyKillLeaderboard: Array<{ __typename?: 'KillLeaderboardEntry', rank: number, kills: number, character: { __typename?: 'Character', id: string, name: string, career: Career, level: any, renownRank: any, guildMembership?: { __typename?: 'GuildMember', guild: { __typename?: 'Guild', id: string, name: string } } | null } }> };

export type GetPlayerFeudQueryVariables = Exact<{
  player1Id: Scalars['ID']['input'];
  player2Id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPlayerFeudQuery = { __typename?: 'Query', kills?: { __typename?: 'KillsConnection', nodes?: Array<{ __typename?: 'Kill', id: string, time: number, position: { __typename?: 'Position', zoneId: any }, scenario?: { __typename?: 'Scenario', id: string } | null, victim: { __typename?: 'Victim', level: any, renownRank: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }, attackers: Array<{ __typename?: 'Attacker', level: any, renownRank: any, damagePercent: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetWeeklyLeaderboardQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  week: Scalars['Int']['input'];
}>;


export type GetWeeklyLeaderboardQuery = { __typename?: 'Query', weeklyKillLeaderboard: Array<{ __typename?: 'KillLeaderboardEntry', rank: number, kills: number, character: { __typename?: 'Character', id: string, name: string, career: Career, level: any, renownRank: any, guildMembership?: { __typename?: 'GuildMember', guild: { __typename?: 'Guild', id: string, name: string } } | null } }> };

export type GetWeeklyGuildLeaderboardQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  week: Scalars['Int']['input'];
}>;


export type GetWeeklyGuildLeaderboardQuery = { __typename?: 'Query', weeklyGuildKillLeaderboard: Array<{ __typename?: 'KillGuildLeaderboardEntry', rank: number, kills: number, guild: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } }> };

export type GetScenarioCountQueryVariables = Exact<{
  characterId?: InputMaybe<Scalars['ID']['input']>;
  guildId?: InputMaybe<Scalars['ID']['input']>;
  queueType?: InputMaybe<ScenarioQueueType>;
  premadeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  wins?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetScenarioCountQuery = { __typename?: 'Query', scenarios?: { __typename?: 'ScenariosConnection', totalCount: number } | null };

export type GetScenarioHeatmapQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetScenarioHeatmapQuery = { __typename?: 'Query', killsHeatmap: Array<{ __typename?: 'KillsHeatmapPoint', x: any, y: any, count: any }> };

export type GetScenarioKillsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  soloOnly?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<KillFilterInput>;
}>;


export type GetScenarioKillsQuery = { __typename?: 'Query', kills?: { __typename?: 'KillsConnection', totalCount: number, nodes?: Array<{ __typename?: 'Kill', id: string, time: number, position: { __typename?: 'Position', zoneId: any }, scenario?: { __typename?: 'Scenario', id: string } | null, attackers: Array<{ __typename?: 'Attacker', level: any, renownRank: any, damagePercent: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }>, victim: { __typename?: 'Victim', level: any, renownRank: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null } }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetScenarioListQueryVariables = Exact<{
  characterId?: InputMaybe<Scalars['ID']['input']>;
  guildId?: InputMaybe<Scalars['ID']['input']>;
  queueType?: InputMaybe<ScenarioQueueType>;
  premadeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetScenarioListQuery = { __typename?: 'Query', scenarios?: { __typename?: 'ScenariosConnection', totalCount: number, nodes?: Array<{ __typename?: 'ScenarioRecord', id: string, startTime: any, endTime: any, winner: any, points: Array<any | null>, scenario: { __typename?: 'Scenario', id: string, name: string } }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetScenarioSkirmishesQueryVariables = Exact<{
  instanceId?: InputMaybe<Scalars['UUID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetScenarioSkirmishesQuery = { __typename?: 'Query', skirmishes?: { __typename?: 'SkirmishesConnection', nodes?: Array<{ __typename?: 'Skirmish', id: string, startTime: any, endTime: any, numberOfKills: number, numberOfKillsOrder: number, numberOfKillsDestruction: number, numberOfPlayers: number, numberOfPlayersOrder: number, numberOfPlayersDestruction: number, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, primaryZone?: { __typename?: 'Zone', id: string, name: string } | null, primaryZoneArea?: { __typename?: 'ZoneArea', id: string, name?: string | null } | null, topGuildsByPlayers: Array<{ __typename?: 'SkirmishTopGuild', count: number, guild: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetLatestSkirmishesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<SkirmishFilterInput>;
}>;


export type GetLatestSkirmishesQuery = { __typename?: 'Query', skirmishes?: { __typename?: 'SkirmishesConnection', nodes?: Array<{ __typename?: 'Skirmish', id: string, startTime: any, endTime: any, numberOfKills: number, numberOfKillsOrder: number, numberOfKillsDestruction: number, numberOfPlayers: number, numberOfPlayersOrder: number, numberOfPlayersDestruction: number, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, primaryZone?: { __typename?: 'Zone', id: string, name: string } | null, primaryZoneArea?: { __typename?: 'ZoneArea', id: string, name?: string | null } | null, topGuildsByPlayers: Array<{ __typename?: 'SkirmishTopGuild', count: number, guild: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetSkirmishDamageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSkirmishDamageQuery = { __typename?: 'Query', skirmish?: { __typename?: 'Skirmish', id: string, killDamage: Array<{ __typename?: 'KillDamage', attackerType: KillDamageAttackerType, damageType: KillDamageSourceType, damageAmount: any, ability?: { __typename?: 'AbilityInfo', id: string, name?: string | null, iconUrl: string } | null }> } | null };

export type GetSkirmishDamageByCharacterQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  characterId: Scalars['ID']['input'];
}>;


export type GetSkirmishDamageByCharacterQuery = { __typename?: 'Query', character?: { __typename?: 'Character', name: string, renownRank: any, level: any, career: Career, guildMembership?: { __typename?: 'GuildMember', guild: { __typename?: 'Guild', id: string, name: string } } | null } | null, skirmish?: { __typename?: 'Skirmish', id: string, killDamageByCharacter: Array<{ __typename?: 'KillDamage', attackerType: KillDamageAttackerType, damageType: KillDamageSourceType, damageAmount: any, ability?: { __typename?: 'AbilityInfo', id: string, name?: string | null, iconUrl: string } | null }> } | null };

export type GetSkirmishKillsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  soloOnly?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<KillFilterInput>;
}>;


export type GetSkirmishKillsQuery = { __typename?: 'Query', kills?: { __typename?: 'KillsConnection', totalCount: number, nodes?: Array<{ __typename?: 'Kill', id: string, time: number, position: { __typename?: 'Position', zoneId: any }, scenario?: { __typename?: 'Scenario', id: string } | null, attackers: Array<{ __typename?: 'Attacker', level: any, renownRank: any, damagePercent: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }>, victim: { __typename?: 'Victim', level: any, renownRank: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null } }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetSkirmishScoreboardQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Array<SkirmishScoreboardEntrySortInput> | SkirmishScoreboardEntrySortInput>;
}>;


export type GetSkirmishScoreboardQuery = { __typename?: 'Query', skirmish?: { __typename?: 'Skirmish', id: string, scoreboardEntries?: { __typename?: 'ScoreboardEntriesConnection', nodes?: Array<{ __typename?: 'SkirmishScoreboardEntry', realm: Realm, kills: any, killsSolo: any, deaths: any, deathBlows: any, damage: any, damageReceived: any, healing: any, healingReceived: any, protection: any, protectionReceived: any, killDamage: any, healingSelf: any, healingOthers: any, protectionSelf: any, protectionOthers: any, resurrectionsDone: any, level: any, renownRank: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null } | null };

export type GetSkirmishTopPlayerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  order?: InputMaybe<Array<SkirmishScoreboardEntrySortInput> | SkirmishScoreboardEntrySortInput>;
}>;


export type GetSkirmishTopPlayerQuery = { __typename?: 'Query', skirmish?: { __typename?: 'Skirmish', id: string, scoreboardEntries?: { __typename?: 'ScoreboardEntriesConnection', nodes?: Array<{ __typename?: 'SkirmishScoreboardEntry', realm: Realm, damage: any, healing: any, protection: any, deathBlows: any, level: any, renownRank: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null }> | null } | null } | null };

export type GetTopSkirmishesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTopSkirmishesQuery = { __typename?: 'Query', topSkirmishes: Array<{ __typename?: 'Skirmish', id: string, startTime: any, endTime: any, numberOfKills: number, numberOfKillsOrder: number, numberOfKillsDestruction: number, numberOfPlayers: number, numberOfPlayersOrder: number, numberOfPlayersDestruction: number, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, primaryZone?: { __typename?: 'Zone', id: string, name: string } | null, primaryZoneArea?: { __typename?: 'ZoneArea', id: string, name?: string | null } | null, topGuildsByPlayers: Array<{ __typename?: 'SkirmishTopGuild', count: number, guild: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } }> }> };

export type ChapterInfluenceRewardFragment = { __typename?: 'ChapterInfluenceReward', count: any, tier: any, item: { __typename?: 'Item', id: string, iconUrl: any, name: string, careerRestriction: Array<Career>, raceRestriction: Array<Race>, uniqueEquipped: boolean, description: string, type: ItemType, slot: EquipSlot, rarity: ItemRarity, armor: any, dps: any, speed: any, levelRequirement: any, renownRankRequirement: any, itemLevel: any, talismanSlots: any, itemSet?: { __typename?: 'ItemSet', id: string, name: string, items: Array<{ __typename?: 'Item', id: string }>, bonuses: Array<{ __typename?: 'ItemSetBonus', itemsRequired: any, bonus: { __typename: 'Ability', description?: string | null } | { __typename: 'ItemStat', stat: Stat, value: any, percentage: boolean } }> } | null, abilities: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }> } };

export type GetChapterQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetChapterQuery = { __typename?: 'Query', chapter?: { __typename?: 'Chapter', id: string, name?: string | null, position: { __typename?: 'Position', x: any, y: any, zone?: { __typename?: 'Zone', id: string, name: string } | null, mapSetup?: { __typename?: 'MapSetup', nwCornerX: number, nwCornerY: number, seCornerX: number, seCornerY: number } | null }, influenceRewards: Array<{ __typename?: 'ChapterInfluenceReward', count: any, realm: Realm, tier: any, item: { __typename?: 'Item', id: string, iconUrl: any, name: string, careerRestriction: Array<Career>, raceRestriction: Array<Race>, uniqueEquipped: boolean, description: string, type: ItemType, slot: EquipSlot, rarity: ItemRarity, armor: any, dps: any, speed: any, levelRequirement: any, renownRankRequirement: any, itemLevel: any, talismanSlots: any, itemSet?: { __typename?: 'ItemSet', id: string, name: string, items: Array<{ __typename?: 'Item', id: string }>, bonuses: Array<{ __typename?: 'ItemSetBonus', itemsRequired: any, bonus: { __typename: 'Ability', description?: string | null } | { __typename: 'ItemStat', stat: Stat, value: any, percentage: boolean } }> } | null, abilities: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }> } }> } | null };

export type GetChaptersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<ChapterFilterInput>;
}>;


export type GetChaptersQuery = { __typename?: 'Query', chapters?: { __typename?: 'ChaptersConnection', nodes?: Array<{ __typename?: 'Chapter', id: string, name?: string | null, rank: any, position: { __typename?: 'Position', zone?: { __typename?: 'Zone', name: string } | null } }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetCreatureQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCreatureQuery = { __typename?: 'Query', creature?: { __typename?: 'Creature', id: string, name: string, creatureType: CreatureType, creatureSubType: CreatureSubType, realm?: Realm | null, spawns: Array<{ __typename?: 'CreatureSpawn', id: string, position: { __typename?: 'Position', x: any, y: any, zone?: { __typename?: 'Zone', id: string, name: string } | null, mapSetup?: { __typename?: 'MapSetup', nwCornerX: number, nwCornerY: number, seCornerX: number, seCornerY: number } | null } }>, questsStarter: Array<{ __typename?: 'Quest', id: string, name: string, repeatableType: QuestRepeatableType, type: { __typename?: 'QuestTypeFlagsFlags', isEpic: boolean, isGroup: boolean, isNone: boolean, isPlayerKill: boolean, isRvR: boolean, isTome: boolean, isTravel: boolean } }>, vendorItems?: { __typename?: 'VendorItemsConnection', totalCount: number } | null } | null };

export type GetCreaturesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<CreatureFilterInput>;
}>;


export type GetCreaturesQuery = { __typename?: 'Query', creatures?: { __typename?: 'CreaturesConnection', nodes?: Array<{ __typename?: 'Creature', id: string, name: string, creatureType: CreatureType, creatureSubType: CreatureSubType, realm?: Realm | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetGameObjectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGameObjectQuery = { __typename?: 'Query', gameObject?: { __typename?: 'GameObject', id: string, name: string, modelName?: string | null, spawns: Array<{ __typename?: 'GameObjectSpawn', id: string, position: { __typename?: 'Position', x: any, y: any, zone?: { __typename?: 'Zone', id: string, name: string } | null, mapSetup?: { __typename?: 'MapSetup', nwCornerX: number, nwCornerY: number, seCornerX: number, seCornerY: number } | null } }>, questsStarter: Array<{ __typename?: 'Quest', id: string, name: string, repeatableType: QuestRepeatableType, type: { __typename?: 'QuestTypeFlagsFlags', isEpic: boolean, isGroup: boolean, isNone: boolean, isPlayerKill: boolean, isRvR: boolean, isTome: boolean, isTravel: boolean } }> } | null };

export type GetGuildInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGuildInfoQuery = { __typename?: 'Query', guild?: { __typename?: 'Guild', name: string, description: string, briefDescription: string, level: any, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number }, leader?: { __typename?: 'Character', id: string, name: string, career: Career } | null, members?: { __typename?: 'MembersConnection', totalCount: number, nodes?: Array<{ __typename?: 'GuildMember', rank: { __typename?: 'GuildRank', name: string }, character: { __typename?: 'Character', id: string, name: string, career: Career } }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null } | null };

export type GetGuildFeudInfoQueryVariables = Exact<{
  guildId1: Scalars['ID']['input'];
  guildInt1: Scalars['UnsignedInt']['input'];
  guildId2: Scalars['ID']['input'];
  guildInt2: Scalars['UnsignedInt']['input'];
}>;


export type GetGuildFeudInfoQuery = { __typename?: 'Query', guild1?: { __typename?: 'Guild', name: string, description: string, briefDescription: string, level: any, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number }, leader?: { __typename?: 'Character', id: string, name: string, career: Career } | null, members?: { __typename?: 'MembersConnection', totalCount: number } | null } | null, guild2?: { __typename?: 'Guild', name: string, description: string, briefDescription: string, level: any, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number }, leader?: { __typename?: 'Character', id: string, name: string, career: Career } | null, members?: { __typename?: 'MembersConnection', totalCount: number } | null } | null, guild1kills?: { __typename?: 'KillsConnection', totalCount: number } | null, guild2kills?: { __typename?: 'KillsConnection', totalCount: number } | null };

export type GetInstanceEncounterRunQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetInstanceEncounterRunQuery = { __typename?: 'Query', instanceEncounterRun?: { __typename?: 'InstanceEncounterRun', id: string, start: any, end: any, scoreboardEntries: Array<{ __typename?: 'InstanceEncounterRunScoreboardEntry', level: any, renownRank: any, archetype: Archetype, itemRating: any, deaths: any, damage: any, killDamage: any, healing: any, healingSelf: any, healingOthers: any, protection: any, protectionSelf: any, protectionOthers: any, damageReceived: any, resurrectionsDone: any, healingReceived: any, protectionReceived: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null }>, encounter?: { __typename?: 'InstanceEncounter', id: string, name: string } | null } | null };

export type InstanceRunQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type InstanceRunQuery = { __typename?: 'Query', instanceRun?: { __typename?: 'InstanceRun', id: string, start: any, end: any, instance: { __typename?: 'Instance', id: string, name: string }, scoreboardEntries: Array<{ __typename?: 'InstanceRunScoreboardEntry', level: any, renownRank: any, archetype: Archetype, itemRating: any, deaths: any, damage: any, killDamage: any, healing: any, healingSelf: any, healingOthers: any, protection: any, protectionSelf: any, protectionOthers: any, damageReceived: any, resurrectionsDone: any, healingReceived: any, protectionReceived: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null }>, encounters: Array<{ __typename?: 'InstanceEncounterRun', id: string, start: any, end: any, completed: boolean, instanceId: string, encounterId: string, scoreboardEntries: Array<{ __typename?: 'InstanceEncounterRunScoreboardEntry', itemRating: any, archetype: Archetype, deaths: any, damage: any, healing: any }>, encounter?: { __typename?: 'InstanceEncounter', name: string } | null }> } | null };

export type GetInstancesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<InstanceFilterInput>;
}>;


export type GetInstancesQuery = { __typename?: 'Query', instances?: { __typename?: 'InstancesConnection', nodes?: Array<{ __typename?: 'Instance', id: string, name: string, encounters?: Array<{ __typename?: 'InstanceEncounter', id: string } | null> | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetItemInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetItemInfoQuery = { __typename?: 'Query', item?: { __typename?: 'Item', id: string, name: string, description: string, careerRestriction: Array<Career>, rarity: ItemRarity, itemLevel: any, iconUrl: any, type: ItemType, levelRequirement: any, renownRankRequirement: any, slot: EquipSlot, armor: any, talismanSlots: any, speed: any, dps: any, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }>, itemSet?: { __typename?: 'ItemSet', id: string, name: string, items: Array<{ __typename?: 'Item', id: string, name: string, iconUrl: any }>, bonuses: Array<{ __typename?: 'ItemSetBonus', itemsRequired: any, bonus: { __typename: 'Ability', description?: string | null } | { __typename: 'ItemStat', stat: Stat, value: any, percentage: boolean } }> } | null, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, soldByVendors?: { __typename?: 'SoldByVendorsConnection', totalCount: number } | null, usedToPurchase?: { __typename?: 'UsedToPurchaseConnection', totalCount: number } | null, rewardedFromQuests?: { __typename?: 'RewardedFromQuestsConnection', totalCount: number } | null } | null };

export type SearchItemsQueryVariables = Exact<{
  query?: InputMaybe<ItemFilterInput>;
  usableByCareer?: InputMaybe<Career>;
  hasStats?: InputMaybe<Array<Stat> | Stat>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchItemsQuery = { __typename?: 'Query', items?: { __typename?: 'ItemsConnection', nodes?: Array<{ __typename?: 'Item', id: string, iconUrl: any, name: string, careerRestriction: Array<Career>, raceRestriction: Array<Race>, uniqueEquipped: boolean, description: string, type: ItemType, slot: EquipSlot, rarity: ItemRarity, armor: any, dps: any, speed: any, levelRequirement: any, renownRankRequirement: any, itemLevel: any, talismanSlots: any, itemSet?: { __typename?: 'ItemSet', id: string, name: string, items: Array<{ __typename?: 'Item', id: string }>, bonuses: Array<{ __typename?: 'ItemSetBonus', itemsRequired: any, bonus: { __typename: 'Ability', description?: string | null } | { __typename: 'ItemStat', stat: Stat, value: any, percentage: boolean } }> } | null, abilities: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetKillQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetKillQuery = { __typename?: 'Query', kill?: { __typename?: 'Kill', instanceId?: string | null, time: number, scenario?: { __typename?: 'Scenario', id: string, name: string } | null, skirmish?: { __typename?: 'Skirmish', id: string } | null, position: { __typename?: 'Position', zoneId: any, x: any, y: any, zone?: { __typename?: 'Zone', name: string } | null, mapSetup?: { __typename?: 'MapSetup', nwCornerX: number, nwCornerY: number, seCornerX: number, seCornerY: number } | null }, victim: { __typename?: 'Victim', level: any, renownRank: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null }, attackers: Array<{ __typename?: 'Attacker', damagePercent: any, level: any, renownRank: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null }>, damage: Array<{ __typename?: 'KillDamage', attackerType: KillDamageAttackerType, damageType: KillDamageSourceType, damageAmount: any, attacker?: { __typename?: 'Character', id: string } | null, ability?: { __typename?: 'AbilityInfo', id: string, name?: string | null, iconUrl: string } | null }>, deathblow?: { __typename?: 'Character', id: string } | null } | null };

export type GetKillsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['Int']['input']>;
  soloOnly?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetKillsQuery = { __typename?: 'Query', kills?: { __typename?: 'KillsConnection', nodes?: Array<{ __typename?: 'Kill', id: string, time: number, position: { __typename?: 'Position', zoneId: any }, scenario?: { __typename?: 'Scenario', id: string } | null, victim: { __typename?: 'Victim', level: any, renownRank: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }, attackers: Array<{ __typename?: 'Attacker', level: any, renownRank: any, damagePercent: any, character: { __typename?: 'Character', id: string, career: Career, name: string }, guild?: { __typename?: 'Guild', id: string, name: string } | null }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetPlayerFeudInfoQueryVariables = Exact<{
  playerId1: Scalars['ID']['input'];
  playerIntId1: Scalars['UnsignedInt']['input'];
  playerId2: Scalars['ID']['input'];
  playerIntId2: Scalars['UnsignedInt']['input'];
}>;


export type GetPlayerFeudInfoQuery = { __typename?: 'Query', player1?: { __typename?: 'Character', name: string, career: Career, level: any, renownRank: any, guildMembership?: { __typename?: 'GuildMember', guild: { __typename?: 'Guild', id: string, name: string } } | null } | null, player2?: { __typename?: 'Character', name: string, career: Career, level: any, renownRank: any, guildMembership?: { __typename?: 'GuildMember', guild: { __typename?: 'Guild', id: string, name: string } } | null } | null, player1kills?: { __typename?: 'KillsConnection', totalCount: number } | null, player2kills?: { __typename?: 'KillsConnection', totalCount: number } | null };

export type GetQuestInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetQuestInfoQuery = { __typename?: 'Query', quest?: { __typename?: 'Quest', id: string, name: string, xp: any, gold: any, choiceCount: any, description?: string | null, journalEntry?: string | null, raceRestriction: Array<Race>, careerRestriction: Array<Career>, minLevel: any, maxLevel: any, minRenown: any, maxRenown: any, type: { __typename?: 'QuestTypeFlagsFlags', isGroup: boolean, isTravel: boolean, isTome: boolean, isRvR: boolean, isPlayerKill: boolean, isEpic: boolean }, rewardsChoice: Array<{ __typename?: 'QuestReward', count: any, item: { __typename?: 'Item', id: string, iconUrl: any, name: string } }>, rewardsGiven: Array<{ __typename?: 'QuestReward', count: any, item: { __typename?: 'Item', id: string, iconUrl: any, name: string } }>, objectives: Array<{ __typename?: 'QuestObjective', description: string, count: any }>, starterCreatures: Array<{ __typename?: 'Creature', id: string, name: string, realm?: Realm | null }> } | null };

export type GetQuestsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<QuestFilterInput>;
}>;


export type GetQuestsQuery = { __typename?: 'Query', quests?: { __typename?: 'QuestsConnection', nodes?: Array<{ __typename?: 'Quest', id: string, name: string, repeatableType: QuestRepeatableType, xp: any, gold: any, choiceCount: any, type: { __typename?: 'QuestTypeFlagsFlags', isGroup: boolean, isTravel: boolean, isTome: boolean, isRvR: boolean, isPlayerKill: boolean, isEpic: boolean }, rewardsChoice: Array<{ __typename?: 'QuestReward', count: any, item: { __typename?: 'Item', id: string, iconUrl: any, name: string } }>, rewardsGiven: Array<{ __typename?: 'QuestReward', count: any, item: { __typename?: 'Item', id: string, iconUrl: any, name: string } }> }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetRankedLeaderboardSeasonsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRankedLeaderboardSeasonsQuery = { __typename?: 'Query', rankedSeasons: Array<{ __typename?: 'RankedSeason', id: string, name: string, start: any, end: any, mainSeason: boolean }> };

export type ScenarioScoreboardEntryFragment = { __typename?: 'ScenarioScoreboardEntry', team: any, level: any, renownRank: any, quitter: boolean, protection: any, kills: any, deathBlows: any, deaths: any, damage: any, healing: any, objectiveScore: any, killsSolo: any, killDamage: any, healingSelf: any, healingOthers: any, protectionSelf: any, protectionOthers: any, damageReceived: any, resurrectionsDone: any, healingReceived: any, protectionReceived: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null };

export type GetScenarioInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetScenarioInfoQuery = { __typename?: 'Query', scenario?: { __typename?: 'ScenarioRecord', id: string, startTime: any, endTime: any, winner: any, points: Array<any | null>, queueType: any, scenario: { __typename?: 'Scenario', id: string, name: string, zone: { __typename?: 'Zone', id: string } }, scoreboardEntries: Array<{ __typename?: 'ScenarioScoreboardEntry', team: any, level: any, renownRank: any, quitter: boolean, protection: any, kills: any, deathBlows: any, deaths: any, damage: any, healing: any, objectiveScore: any, killsSolo: any, killDamage: any, healingSelf: any, healingOthers: any, protectionSelf: any, protectionOthers: any, damageReceived: any, resurrectionsDone: any, healingReceived: any, protectionReceived: any, character: { __typename?: 'Character', id: string, name: string, career: Career }, guild?: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } | null }> } | null };

export type SearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchQuery = { __typename?: 'Query', search?: { __typename?: 'SearchConnection', nodes?: Array<{ __typename: 'Ability', id: string, name?: string | null } | { __typename: 'AbilityInfo', id: string, name?: string | null } | { __typename: 'Chapter', id: string, name?: string | null } | { __typename: 'Character', level: any, career: Career, renownRank: any, id: string, name: string, guildMembership?: { __typename?: 'GuildMember', guild: { __typename?: 'Guild', id: string, name: string } } | null } | { __typename: 'Creature', creatureSubType: CreatureSubType, id: string, name: string } | { __typename: 'Guild', level: any, realm: Realm, id: string, name: string, leader?: { __typename?: 'Character', id: string, name: string } | null, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number }, members?: { __typename?: 'MembersConnection', totalCount: number } | null } | { __typename: 'Item', iconUrl: any, description: string, type: ItemType, slot: EquipSlot, rarity: ItemRarity, itemLevel: any, id: string, name: string, itemSet?: { __typename?: 'ItemSet', id: string, name: string } | null } | { __typename: 'ItemSet', id: string, name: string } | { __typename: 'LiveEvent', id: string, name: string } | { __typename: 'Quest', repeatableType: QuestRepeatableType, minLevel: any, xp: any, gold: any, journalEntry?: string | null, id: string, name: string, questDescription?: string | null, questType: { __typename?: 'QuestTypeFlagsFlags', isGroup: boolean, isTravel: boolean, isTome: boolean, isRvR: boolean, isPlayerKill: boolean, isEpic: boolean } } | { __typename: 'Scenario', id: string, name: string } | { __typename: 'TomeOfKnowledgeEntry', id: string, name: string } | { __typename: 'Zone', id: string, name: string }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type SearchGuildsQueryVariables = Exact<{
  query: Scalars['String']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchGuildsQuery = { __typename?: 'Query', guilds?: { __typename?: 'GuildsConnection', nodes?: Array<{ __typename?: 'Guild', id: string, name: string, level: any, leader?: { __typename?: 'Character', id: string, level: any, name: string, renownRank: any } | null, members?: { __typename?: 'MembersConnection', totalCount: number } | null }> | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null, hasPreviousPage: boolean, startCursor?: string | null } } | null };

export type GetSkirmishInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSkirmishInfoQuery = { __typename?: 'Query', skirmish?: { __typename?: 'Skirmish', id: string, startTime: any, endTime: any, numberOfKills: number, numberOfKillsOrder: number, numberOfKillsDestruction: number, numberOfPlayers: number, numberOfPlayersOrder: number, numberOfPlayersDestruction: number, instance?: { __typename?: 'ScenarioRecord', id: string, scenario: { __typename?: 'Scenario', id: string, name: string } } | null, primaryZone?: { __typename?: 'Zone', id: string, name: string } | null, heatmap: Array<{ __typename?: 'KillsHeatmapPoint', x: any, y: any, count: any }>, topGuildsByPlayers: Array<{ __typename?: 'SkirmishTopGuild', count: number, guild: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } }>, topGuildsByKills: Array<{ __typename?: 'SkirmishTopGuild', count: number, guild: { __typename?: 'Guild', id: string, name: string, realm: Realm, heraldry: { __typename?: 'GuildHeraldry', emblem: number, pattern: number, color1: number, color2: number, shape: number } } }> } | null };

export type GetWarJournalStorylineQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWarJournalStorylineQuery = { __typename?: 'Query', warJournalStoryline?: { __typename?: 'WarJournalStoryline', id: string, name: string, summary: string, entries: Array<{ __typename?: 'WarJournalEntry', id: string, name: string, isRvR: boolean }> } | null };

export type GetWarJournalActivityQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWarJournalActivityQuery = { __typename?: 'Query', warJournalEntry?: { __typename?: 'WarJournalEntry', id: string, name: string, locationText?: string | null, npcName?: string | null, text?: string | null, title?: string | null, shortTitle?: string | null, isRvR: boolean, area?: { __typename?: 'ZoneArea', id: string, name?: string | null } | null, zone?: { __typename?: 'Zone', id: string, name: string } | null, activities: Array<{ __typename?: 'WarJournalActivity', id: string, name: string }>, position?: { __typename?: 'Position', x: any, y: any } | null } | null };

export type GetWarJournalEntryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWarJournalEntryQuery = { __typename?: 'Query', warJournalEntry?: { __typename?: 'WarJournalEntry', id: string, name: string, locationText?: string | null, npcName?: string | null, text?: string | null, title?: string | null, shortTitle?: string | null, isRvR: boolean, area?: { __typename?: 'ZoneArea', id: string, name?: string | null } | null, zone?: { __typename?: 'Zone', id: string, name: string } | null, activities: Array<{ __typename?: 'WarJournalActivity', id: string, name: string }>, position?: { __typename?: 'Position', x: any, y: any } | null, influenceRewards: Array<{ __typename?: 'ChapterInfluenceReward', count: any, tier: any, item: { __typename?: 'Item', id: string, iconUrl: any, name: string, careerRestriction: Array<Career>, raceRestriction: Array<Race>, uniqueEquipped: boolean, description: string, type: ItemType, slot: EquipSlot, rarity: ItemRarity, armor: any, dps: any, speed: any, levelRequirement: any, renownRankRequirement: any, itemLevel: any, talismanSlots: any, itemSet?: { __typename?: 'ItemSet', id: string, name: string, items: Array<{ __typename?: 'Item', id: string }>, bonuses: Array<{ __typename?: 'ItemSetBonus', itemsRequired: any, bonus: { __typename: 'Ability', description?: string | null } | { __typename: 'ItemStat', stat: Stat, value: any, percentage: boolean } }> } | null, abilities: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, buffs: Array<{ __typename?: 'Ability', id: string, description?: string | null }>, stats: Array<{ __typename?: 'ItemStat', stat: Stat, value: any }> } }> } | null };

export type GetWarJournalStorylinesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWarJournalStorylinesQuery = { __typename?: 'Query', warJournalStorylines: Array<{ __typename?: 'WarJournalStoryline', id: string, name: string }> };

export type GetZoneHeatmapQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  from?: InputMaybe<Scalars['Long']['input']>;
}>;


export type GetZoneHeatmapQuery = { __typename?: 'Query', killsHeatmap: Array<{ __typename?: 'KillsHeatmapPoint', x: any, y: any, count: any }> };

export const TalismanFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Talisman"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<TalismanFragment, unknown>;
export const ItemListEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"raceRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"uniqueEquipped"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slot"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"armor"}},{"kind":"Field","name":{"kind":"Name","value":"dps"}},{"kind":"Field","name":{"kind":"Name","value":"speed"}},{"kind":"Field","name":{"kind":"Name","value":"levelRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"renownRankRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"itemLevel"}},{"kind":"Field","name":{"kind":"Name","value":"talismanSlots"}},{"kind":"Field","name":{"kind":"Name","value":"itemSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsRequired"}},{"kind":"Field","name":{"kind":"Name","value":"bonus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ItemStat"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<ItemListEntryFragment, unknown>;
export const EquippedCharacterItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EquippedCharacterItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CharacterItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"equipSlot"}},{"kind":"Field","name":{"kind":"Name","value":"talismans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Talisman"}}]}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemListEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Talisman"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"raceRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"uniqueEquipped"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slot"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"armor"}},{"kind":"Field","name":{"kind":"Name","value":"dps"}},{"kind":"Field","name":{"kind":"Name","value":"speed"}},{"kind":"Field","name":{"kind":"Name","value":"levelRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"renownRankRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"itemLevel"}},{"kind":"Field","name":{"kind":"Name","value":"talismanSlots"}},{"kind":"Field","name":{"kind":"Name","value":"itemSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsRequired"}},{"kind":"Field","name":{"kind":"Name","value":"bonus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ItemStat"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<EquippedCharacterItemFragment, unknown>;
export const GuildInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GuildInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Guild"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"briefDescription"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GuildInfoFragment, unknown>;
export const InstanceRunScoreboardEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InstanceRunScoreboardEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InstanceRunScoreboardEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"archetype"}},{"kind":"Field","name":{"kind":"Name","value":"itemRating"}},{"kind":"Field","name":{"kind":"Name","value":"deaths"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"killDamage"}},{"kind":"Field","name":{"kind":"Name","value":"healing"}},{"kind":"Field","name":{"kind":"Name","value":"healingSelf"}},{"kind":"Field","name":{"kind":"Name","value":"healingOthers"}},{"kind":"Field","name":{"kind":"Name","value":"protection"}},{"kind":"Field","name":{"kind":"Name","value":"protectionSelf"}},{"kind":"Field","name":{"kind":"Name","value":"protectionOthers"}},{"kind":"Field","name":{"kind":"Name","value":"damageReceived"}},{"kind":"Field","name":{"kind":"Name","value":"resurrectionsDone"}},{"kind":"Field","name":{"kind":"Name","value":"healingReceived"}},{"kind":"Field","name":{"kind":"Name","value":"protectionReceived"}}]}}]} as unknown as DocumentNode<InstanceRunScoreboardEntryFragment, unknown>;
export const InstanceEncounterRunScoreboardEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InstanceEncounterRunScoreboardEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InstanceEncounterRunScoreboardEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"archetype"}},{"kind":"Field","name":{"kind":"Name","value":"itemRating"}},{"kind":"Field","name":{"kind":"Name","value":"deaths"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"killDamage"}},{"kind":"Field","name":{"kind":"Name","value":"healing"}},{"kind":"Field","name":{"kind":"Name","value":"healingSelf"}},{"kind":"Field","name":{"kind":"Name","value":"healingOthers"}},{"kind":"Field","name":{"kind":"Name","value":"protection"}},{"kind":"Field","name":{"kind":"Name","value":"protectionSelf"}},{"kind":"Field","name":{"kind":"Name","value":"protectionOthers"}},{"kind":"Field","name":{"kind":"Name","value":"damageReceived"}},{"kind":"Field","name":{"kind":"Name","value":"resurrectionsDone"}},{"kind":"Field","name":{"kind":"Name","value":"healingReceived"}},{"kind":"Field","name":{"kind":"Name","value":"protectionReceived"}}]}}]} as unknown as DocumentNode<InstanceEncounterRunScoreboardEntryFragment, unknown>;
export const AttackerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Attacker"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attacker"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}}]}}]} as unknown as DocumentNode<AttackerFragment, unknown>;
export const KillDamageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"KillDamage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"KillDamage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attackerType"}},{"kind":"Field","name":{"kind":"Name","value":"damageType"}},{"kind":"Field","name":{"kind":"Name","value":"attacker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ability"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"damageAmount"}}]}}]} as unknown as DocumentNode<KillDamageFragment, unknown>;
export const ChapterInfluenceRewardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChapterInfluenceReward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChapterInfluenceReward"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemListEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"raceRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"uniqueEquipped"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slot"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"armor"}},{"kind":"Field","name":{"kind":"Name","value":"dps"}},{"kind":"Field","name":{"kind":"Name","value":"speed"}},{"kind":"Field","name":{"kind":"Name","value":"levelRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"renownRankRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"itemLevel"}},{"kind":"Field","name":{"kind":"Name","value":"talismanSlots"}},{"kind":"Field","name":{"kind":"Name","value":"itemSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsRequired"}},{"kind":"Field","name":{"kind":"Name","value":"bonus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ItemStat"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<ChapterInfluenceRewardFragment, unknown>;
export const ScenarioScoreboardEntryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScenarioScoreboardEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ScenarioScoreboardEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"team"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"quitter"}},{"kind":"Field","name":{"kind":"Name","value":"protection"}},{"kind":"Field","name":{"kind":"Name","value":"kills"}},{"kind":"Field","name":{"kind":"Name","value":"deathBlows"}},{"kind":"Field","name":{"kind":"Name","value":"deaths"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"healing"}},{"kind":"Field","name":{"kind":"Name","value":"objectiveScore"}},{"kind":"Field","name":{"kind":"Name","value":"killsSolo"}},{"kind":"Field","name":{"kind":"Name","value":"killDamage"}},{"kind":"Field","name":{"kind":"Name","value":"healingSelf"}},{"kind":"Field","name":{"kind":"Name","value":"healingOthers"}},{"kind":"Field","name":{"kind":"Name","value":"protectionSelf"}},{"kind":"Field","name":{"kind":"Name","value":"protectionOthers"}},{"kind":"Field","name":{"kind":"Name","value":"damageReceived"}},{"kind":"Field","name":{"kind":"Name","value":"resurrectionsDone"}},{"kind":"Field","name":{"kind":"Name","value":"healingReceived"}},{"kind":"Field","name":{"kind":"Name","value":"protectionReceived"}}]}}]} as unknown as DocumentNode<ScenarioScoreboardEntryFragment, unknown>;
export const GetRankedLeaderboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRankedLeaderboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"season"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RankedLeaderboardRatingType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rankedSeason"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"season"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mainSeason"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"leaderboard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"careerRank"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"wins"}},{"kind":"Field","name":{"kind":"Name","value":"losses"}},{"kind":"Field","name":{"kind":"Name","value":"draws"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRankedLeaderboardQuery, GetRankedLeaderboardQueryVariables>;
export const GetCharacterArmoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCharacterArmory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EquippedCharacterItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Talisman"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"raceRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"uniqueEquipped"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slot"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"armor"}},{"kind":"Field","name":{"kind":"Name","value":"dps"}},{"kind":"Field","name":{"kind":"Name","value":"speed"}},{"kind":"Field","name":{"kind":"Name","value":"levelRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"renownRankRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"itemLevel"}},{"kind":"Field","name":{"kind":"Name","value":"talismanSlots"}},{"kind":"Field","name":{"kind":"Name","value":"itemSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsRequired"}},{"kind":"Field","name":{"kind":"Name","value":"bonus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ItemStat"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EquippedCharacterItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CharacterItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"equipSlot"}},{"kind":"Field","name":{"kind":"Name","value":"talismans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Talisman"}}]}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemListEntry"}}]}}]}}]} as unknown as DocumentNode<GetCharacterArmoryQuery, GetCharacterArmoryQueryVariables>;
export const GetCharacterInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCharacterInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"guildMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCharacterInfoQuery, GetCharacterInfoQueryVariables>;
export const GetCharacterLatestSkirmishesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCharacterLatestSkirmishes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"characterId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SkirmishFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skirmishes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"characterId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"characterId"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZoneArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"topGuildsByPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKills"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsDestruction"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersDestruction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetCharacterLatestSkirmishesQuery, GetCharacterLatestSkirmishesQueryVariables>;
export const GetLatestCharacterDeathsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestCharacterDeaths"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"time"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IntOperationFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"victimCharacterId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"time"},"value":{"kind":"Variable","name":{"kind":"Name","value":"time"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"soloOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetLatestCharacterDeathsQuery, GetLatestCharacterDeathsQueryVariables>;
export const GetLatestCharacterKillsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestCharacterKills"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"time"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IntOperationFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"killerCharacterId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"time"},"value":{"kind":"Variable","name":{"kind":"Name","value":"time"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"soloOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"victim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetLatestCharacterKillsQuery, GetLatestCharacterKillsQueryVariables>;
export const GetVendorItemsFromCreatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVendorItemsFromCreature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creatureId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creature"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creatureId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"vendorItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"requiredItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetVendorItemsFromCreatureQuery, GetVendorItemsFromCreatureQueryVariables>;
export const GetGuildFeudDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGuildFeud"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guild1Id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guild2Id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"guildFeudFilter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"guild1Id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guild1Id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"guild2Id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guild2Id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"victim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetGuildFeudQuery, GetGuildFeudQueryVariables>;
export const GetGuildLatestSkirmishesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGuildLatestSkirmishes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guildId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SkirmishFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skirmishes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"guildId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guildId"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZoneArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"topGuildsByPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKills"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsDestruction"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersDestruction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetGuildLatestSkirmishesQuery, GetGuildLatestSkirmishesQueryVariables>;
export const GetGuildMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGuildMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetGuildMembersQuery, GetGuildMembersQueryVariables>;
export const GetLatestGuildDeathsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestGuildDeaths"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"time"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IntOperationFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"victimGuildId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"time"},"value":{"kind":"Variable","name":{"kind":"Name","value":"time"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"soloOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"victim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetLatestGuildDeathsQuery, GetLatestGuildDeathsQueryVariables>;
export const GetLatestGuildKillsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestGuildKills"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"time"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IntOperationFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"killerGuildId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"time"},"value":{"kind":"Variable","name":{"kind":"Name","value":"time"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"soloOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"victim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetLatestGuildKillsQuery, GetLatestGuildKillsQueryVariables>;
export const GetInstanceRunsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInstanceRuns"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InstanceRunFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instanceRuns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"start"},"value":{"kind":"EnumValue","value":"DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"instanceId"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scoreboardEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemRating"}},{"kind":"Field","name":{"kind":"Name","value":"deaths"}},{"kind":"Field","name":{"kind":"Name","value":"archetype"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"healing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"encounters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"encounterId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"averageDuration"}},{"kind":"Field","name":{"kind":"Name","value":"averageDeaths"}}]}}]}}]} as unknown as DocumentNode<GetInstanceRunsQuery, GetInstanceRunsQueryVariables>;
export const GetItemPopupInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetItemPopupInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemListEntry"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"raceRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"uniqueEquipped"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slot"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"armor"}},{"kind":"Field","name":{"kind":"Name","value":"dps"}},{"kind":"Field","name":{"kind":"Name","value":"speed"}},{"kind":"Field","name":{"kind":"Name","value":"levelRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"renownRankRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"itemLevel"}},{"kind":"Field","name":{"kind":"Name","value":"talismanSlots"}},{"kind":"Field","name":{"kind":"Name","value":"itemSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsRequired"}},{"kind":"Field","name":{"kind":"Name","value":"bonus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ItemStat"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetItemPopupInfoQuery, GetItemPopupInfoQueryVariables>;
export const GetItemRewardedFromQuestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetItemRewardedFromQuests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rewardedFromQuests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"isTravel"}},{"kind":"Field","name":{"kind":"Name","value":"isTome"}},{"kind":"Field","name":{"kind":"Name","value":"isRvR"}},{"kind":"Field","name":{"kind":"Name","value":"isPlayerKill"}},{"kind":"Field","name":{"kind":"Name","value":"isEpic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"repeatableType"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsChoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rewardsGiven"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetItemRewardedFromQuestsQuery, GetItemRewardedFromQuestsQueryVariables>;
export const GetItemUsedToPurchaseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetItemUsedToPurchase"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"usableByCareer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Career"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"usedToPurchase"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"usableByCareer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"usableByCareer"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"requiredItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"spawns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetItemUsedToPurchaseQuery, GetItemUsedToPurchaseQueryVariables>;
export const GetItemSoldByVendorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetItemSoldByVendors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"soldByVendors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"requiredItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"creatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"spawns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetItemSoldByVendorsQuery, GetItemSoldByVendorsQueryVariables>;
export const GetLatestKillsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestKills"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"victim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetLatestKillsQuery, GetLatestKillsQueryVariables>;
export const GetMonthlyGuildLeaderboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMonthlyGuildLeaderboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthlyGuildKillLeaderboard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kills"}}]}}]}}]} as unknown as DocumentNode<GetMonthlyGuildLeaderboardQuery, GetMonthlyGuildLeaderboardQueryVariables>;
export const GetMonthlyLeaderboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMonthlyLeaderboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthlyKillLeaderboard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kills"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"guildMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMonthlyLeaderboardQuery, GetMonthlyLeaderboardQueryVariables>;
export const GetPlayerFeudDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlayerFeud"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"player1Id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"player2Id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"playerFeudFilter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"player1Id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"player1Id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"player2Id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"player2Id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"victim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetPlayerFeudQuery, GetPlayerFeudQueryVariables>;
export const GetWeeklyLeaderboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWeeklyLeaderboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"week"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weeklyKillLeaderboard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"week"},"value":{"kind":"Variable","name":{"kind":"Name","value":"week"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kills"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"guildMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetWeeklyLeaderboardQuery, GetWeeklyLeaderboardQueryVariables>;
export const GetWeeklyGuildLeaderboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWeeklyGuildLeaderboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"week"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weeklyGuildKillLeaderboard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"week"},"value":{"kind":"Variable","name":{"kind":"Name","value":"week"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kills"}}]}}]}}]} as unknown as DocumentNode<GetWeeklyGuildLeaderboardQuery, GetWeeklyGuildLeaderboardQueryVariables>;
export const GetScenarioCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetScenarioCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"characterId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guildId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ScenarioQueueType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"premadeOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wins"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scenarios"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"characterId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"characterId"}}},{"kind":"Argument","name":{"kind":"Name","value":"guildId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guildId"}}},{"kind":"Argument","name":{"kind":"Name","value":"queueType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueType"}}},{"kind":"Argument","name":{"kind":"Name","value":"premadeOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"premadeOnly"}}},{"kind":"Argument","name":{"kind":"Name","value":"wins"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wins"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetScenarioCountQuery, GetScenarioCountQueryVariables>;
export const GetScenarioHeatmapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetScenarioHeatmap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"killsHeatmap"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"instanceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<GetScenarioHeatmapQuery, GetScenarioHeatmapQueryVariables>;
export const GetScenarioKillsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetScenarioKills"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"KillFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"soloOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"victim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetScenarioKillsQuery, GetScenarioKillsQueryVariables>;
export const GetScenarioListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetScenarioList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"characterId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guildId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"queueType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ScenarioQueueType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"premadeOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scenarios"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"characterId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"characterId"}}},{"kind":"Argument","name":{"kind":"Name","value":"guildId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guildId"}}},{"kind":"Argument","name":{"kind":"Name","value":"queueType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"queueType"}}},{"kind":"Argument","name":{"kind":"Name","value":"premadeOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"premadeOnly"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetScenarioListQuery, GetScenarioListQueryVariables>;
export const GetScenarioSkirmishesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetScenarioSkirmishes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"instanceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skirmishes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"instanceId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"instanceId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZoneArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"topGuildsByPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKills"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsDestruction"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersDestruction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetScenarioSkirmishesQuery, GetScenarioSkirmishesQueryVariables>;
export const GetLatestSkirmishesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestSkirmishes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SkirmishFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skirmishes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZoneArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"topGuildsByPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKills"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsDestruction"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersDestruction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetLatestSkirmishesQuery, GetLatestSkirmishesQueryVariables>;
export const GetSkirmishDamageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSkirmishDamage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skirmish"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"killDamage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attackerType"}},{"kind":"Field","name":{"kind":"Name","value":"damageType"}},{"kind":"Field","name":{"kind":"Name","value":"ability"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"damageAmount"}}]}}]}}]}}]} as unknown as DocumentNode<GetSkirmishDamageQuery, GetSkirmishDamageQueryVariables>;
export const GetSkirmishDamageByCharacterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSkirmishDamageByCharacter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"characterId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"characterId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"guildMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"skirmish"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"killDamageByCharacter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"characterId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attackerType"}},{"kind":"Field","name":{"kind":"Name","value":"damageType"}},{"kind":"Field","name":{"kind":"Name","value":"ability"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"damageAmount"}}]}}]}}]}}]} as unknown as DocumentNode<GetSkirmishDamageByCharacterQuery, GetSkirmishDamageByCharacterQueryVariables>;
export const GetSkirmishKillsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSkirmishKills"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"KillFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"soloOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"victim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetSkirmishKillsQuery, GetSkirmishKillsQueryVariables>;
export const GetSkirmishScoreboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSkirmishScoreboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SkirmishScoreboardEntrySortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skirmish"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scoreboardEntries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"kills"}},{"kind":"Field","name":{"kind":"Name","value":"killsSolo"}},{"kind":"Field","name":{"kind":"Name","value":"deaths"}},{"kind":"Field","name":{"kind":"Name","value":"deathBlows"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"damageReceived"}},{"kind":"Field","name":{"kind":"Name","value":"healing"}},{"kind":"Field","name":{"kind":"Name","value":"healingReceived"}},{"kind":"Field","name":{"kind":"Name","value":"protection"}},{"kind":"Field","name":{"kind":"Name","value":"protectionReceived"}},{"kind":"Field","name":{"kind":"Name","value":"killDamage"}},{"kind":"Field","name":{"kind":"Name","value":"healingSelf"}},{"kind":"Field","name":{"kind":"Name","value":"healingOthers"}},{"kind":"Field","name":{"kind":"Name","value":"protectionSelf"}},{"kind":"Field","name":{"kind":"Name","value":"protectionOthers"}},{"kind":"Field","name":{"kind":"Name","value":"resurrectionsDone"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetSkirmishScoreboardQuery, GetSkirmishScoreboardQueryVariables>;
export const GetSkirmishTopPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSkirmishTopPlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SkirmishScoreboardEntrySortInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skirmish"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scoreboardEntries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"healing"}},{"kind":"Field","name":{"kind":"Name","value":"protection"}},{"kind":"Field","name":{"kind":"Name","value":"deathBlows"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetSkirmishTopPlayerQuery, GetSkirmishTopPlayerQueryVariables>;
export const GetTopSkirmishesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTopSkirmishes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topSkirmishes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZoneArea"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"topGuildsByPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKills"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsDestruction"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersDestruction"}}]}}]}}]} as unknown as DocumentNode<GetTopSkirmishesQuery, GetTopSkirmishesQueryVariables>;
export const GetChapterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChapter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chapter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mapSetup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nwCornerX"}},{"kind":"Field","name":{"kind":"Name","value":"nwCornerY"}},{"kind":"Field","name":{"kind":"Name","value":"seCornerX"}},{"kind":"Field","name":{"kind":"Name","value":"seCornerY"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"influenceRewards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"raceRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"uniqueEquipped"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slot"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"armor"}},{"kind":"Field","name":{"kind":"Name","value":"dps"}},{"kind":"Field","name":{"kind":"Name","value":"speed"}},{"kind":"Field","name":{"kind":"Name","value":"levelRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"renownRankRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"itemLevel"}},{"kind":"Field","name":{"kind":"Name","value":"talismanSlots"}},{"kind":"Field","name":{"kind":"Name","value":"itemSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsRequired"}},{"kind":"Field","name":{"kind":"Name","value":"bonus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ItemStat"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetChapterQuery, GetChapterQueryVariables>;
export const GetChaptersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChapters"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ChapterFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chapters"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetChaptersQuery, GetChaptersQueryVariables>;
export const GetCreatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCreature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creature"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"creatureType"}},{"kind":"Field","name":{"kind":"Name","value":"creatureSubType"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"spawns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mapSetup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nwCornerX"}},{"kind":"Field","name":{"kind":"Name","value":"nwCornerY"}},{"kind":"Field","name":{"kind":"Name","value":"seCornerX"}},{"kind":"Field","name":{"kind":"Name","value":"seCornerY"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"questsStarter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isEpic"}},{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"isNone"}},{"kind":"Field","name":{"kind":"Name","value":"isPlayerKill"}},{"kind":"Field","name":{"kind":"Name","value":"isRvR"}},{"kind":"Field","name":{"kind":"Name","value":"isTome"}},{"kind":"Field","name":{"kind":"Name","value":"isTravel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"repeatableType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendorItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetCreatureQuery, GetCreatureQueryVariables>;
export const GetCreaturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCreatures"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatureFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creatures"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"creatureType"}},{"kind":"Field","name":{"kind":"Name","value":"creatureSubType"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetCreaturesQuery, GetCreaturesQueryVariables>;
export const GetGameObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGameObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameObject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"spawns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mapSetup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nwCornerX"}},{"kind":"Field","name":{"kind":"Name","value":"nwCornerY"}},{"kind":"Field","name":{"kind":"Name","value":"seCornerX"}},{"kind":"Field","name":{"kind":"Name","value":"seCornerY"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"questsStarter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isEpic"}},{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"isNone"}},{"kind":"Field","name":{"kind":"Name","value":"isPlayerKill"}},{"kind":"Field","name":{"kind":"Name","value":"isRvR"}},{"kind":"Field","name":{"kind":"Name","value":"isTome"}},{"kind":"Field","name":{"kind":"Name","value":"isTravel"}}]}},{"kind":"Field","name":{"kind":"Name","value":"repeatableType"}}]}}]}}]}}]} as unknown as DocumentNode<GetGameObjectQuery, GetGameObjectQueryVariables>;
export const GetGuildInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGuildInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GuildInfo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"briefDescription"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GuildInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Guild"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"briefDescription"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetGuildInfoQuery, GetGuildInfoQueryVariables>;
export const GetGuildFeudInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGuildFeudInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guildId1"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guildInt1"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guildId2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"guildInt2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"guild1"},"name":{"kind":"Name","value":"guild"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guildId1"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GuildInfo"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"guild2"},"name":{"kind":"Name","value":"guild"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guildId2"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GuildInfo"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"guild1kills"},"name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"killerGuildId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guildInt1"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"victimGuildId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guildInt2"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"guild2kills"},"name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"killerGuildId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guildInt2"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"victimGuildId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"guildInt1"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GuildInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Guild"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"briefDescription"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}},{"kind":"Field","name":{"kind":"Name","value":"leader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetGuildFeudInfoQuery, GetGuildFeudInfoQueryVariables>;
export const GetInstanceEncounterRunDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInstanceEncounterRun"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instanceEncounterRun"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"scoreboardEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InstanceEncounterRunScoreboardEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"encounter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InstanceEncounterRunScoreboardEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InstanceEncounterRunScoreboardEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"archetype"}},{"kind":"Field","name":{"kind":"Name","value":"itemRating"}},{"kind":"Field","name":{"kind":"Name","value":"deaths"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"killDamage"}},{"kind":"Field","name":{"kind":"Name","value":"healing"}},{"kind":"Field","name":{"kind":"Name","value":"healingSelf"}},{"kind":"Field","name":{"kind":"Name","value":"healingOthers"}},{"kind":"Field","name":{"kind":"Name","value":"protection"}},{"kind":"Field","name":{"kind":"Name","value":"protectionSelf"}},{"kind":"Field","name":{"kind":"Name","value":"protectionOthers"}},{"kind":"Field","name":{"kind":"Name","value":"damageReceived"}},{"kind":"Field","name":{"kind":"Name","value":"resurrectionsDone"}},{"kind":"Field","name":{"kind":"Name","value":"healingReceived"}},{"kind":"Field","name":{"kind":"Name","value":"protectionReceived"}}]}}]} as unknown as DocumentNode<GetInstanceEncounterRunQuery, GetInstanceEncounterRunQueryVariables>;
export const InstanceRunDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InstanceRun"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instanceRun"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scoreboardEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InstanceRunScoreboardEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"encounters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"instanceId"}},{"kind":"Field","name":{"kind":"Name","value":"encounterId"}},{"kind":"Field","name":{"kind":"Name","value":"scoreboardEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemRating"}},{"kind":"Field","name":{"kind":"Name","value":"archetype"}},{"kind":"Field","name":{"kind":"Name","value":"deaths"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"healing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"encounter"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InstanceRunScoreboardEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InstanceRunScoreboardEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"archetype"}},{"kind":"Field","name":{"kind":"Name","value":"itemRating"}},{"kind":"Field","name":{"kind":"Name","value":"deaths"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"killDamage"}},{"kind":"Field","name":{"kind":"Name","value":"healing"}},{"kind":"Field","name":{"kind":"Name","value":"healingSelf"}},{"kind":"Field","name":{"kind":"Name","value":"healingOthers"}},{"kind":"Field","name":{"kind":"Name","value":"protection"}},{"kind":"Field","name":{"kind":"Name","value":"protectionSelf"}},{"kind":"Field","name":{"kind":"Name","value":"protectionOthers"}},{"kind":"Field","name":{"kind":"Name","value":"damageReceived"}},{"kind":"Field","name":{"kind":"Name","value":"resurrectionsDone"}},{"kind":"Field","name":{"kind":"Name","value":"healingReceived"}},{"kind":"Field","name":{"kind":"Name","value":"protectionReceived"}}]}}]} as unknown as DocumentNode<InstanceRunQuery, InstanceRunQueryVariables>;
export const GetInstancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInstances"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InstanceFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"encounters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetInstancesQuery, GetInstancesQueryVariables>;
export const GetItemInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetItemInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"item"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"itemLevel"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"levelRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"renownRankRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"slot"}},{"kind":"Field","name":{"kind":"Name","value":"armor"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"talismanSlots"}},{"kind":"Field","name":{"kind":"Name","value":"speed"}},{"kind":"Field","name":{"kind":"Name","value":"dps"}},{"kind":"Field","name":{"kind":"Name","value":"itemSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsRequired"}},{"kind":"Field","name":{"kind":"Name","value":"bonus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ItemStat"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"soldByVendors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usedToPurchase"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rewardedFromQuests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetItemInfoQuery, GetItemInfoQueryVariables>;
export const SearchItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"usableByCareer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Career"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hasStats"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Stat"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"usableByCareer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"usableByCareer"}}},{"kind":"Argument","name":{"kind":"Name","value":"hasStats"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hasStats"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemListEntry"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"raceRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"uniqueEquipped"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slot"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"armor"}},{"kind":"Field","name":{"kind":"Name","value":"dps"}},{"kind":"Field","name":{"kind":"Name","value":"speed"}},{"kind":"Field","name":{"kind":"Name","value":"levelRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"renownRankRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"itemLevel"}},{"kind":"Field","name":{"kind":"Name","value":"talismanSlots"}},{"kind":"Field","name":{"kind":"Name","value":"itemSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsRequired"}},{"kind":"Field","name":{"kind":"Name","value":"bonus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ItemStat"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<SearchItemsQuery, SearchItemsQueryVariables>;
export const GetKillDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetKill"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kill"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeAssists"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"instanceId"}},{"kind":"Field","name":{"kind":"Name","value":"skirmish"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zoneId"}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"mapSetup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nwCornerX"}},{"kind":"Field","name":{"kind":"Name","value":"nwCornerY"}},{"kind":"Field","name":{"kind":"Name","value":"seCornerX"}},{"kind":"Field","name":{"kind":"Name","value":"seCornerY"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"victim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Attacker"}}]}},{"kind":"Field","name":{"kind":"Name","value":"damage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"KillDamage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deathblow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Attacker"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Attacker"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"KillDamage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"KillDamage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attackerType"}},{"kind":"Field","name":{"kind":"Name","value":"damageType"}},{"kind":"Field","name":{"kind":"Name","value":"attacker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ability"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"damageAmount"}}]}}]} as unknown as DocumentNode<GetKillQuery, GetKillQueryVariables>;
export const GetKillsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetKills"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"time"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"soloOnly"},"value":{"kind":"Variable","name":{"kind":"Name","value":"soloOnly"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zoneId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"victim"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"attackers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"damagePercent"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetKillsQuery, GetKillsQueryVariables>;
export const GetPlayerFeudInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPlayerFeudInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playerId1"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playerIntId1"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playerId2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playerIntId2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"player1"},"name":{"kind":"Name","value":"character"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playerId1"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"guildMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"player2"},"name":{"kind":"Name","value":"character"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playerId2"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"guildMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"player1kills"},"name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"killerCharacterId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playerIntId1"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"victimCharacterId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playerIntId2"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"player2kills"},"name":{"kind":"Name","value":"kills"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"killerCharacterId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playerIntId2"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"victimCharacterId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playerIntId1"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetPlayerFeudInfoQuery, GetPlayerFeudInfoQueryVariables>;
export const GetQuestInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQuestInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"isTravel"}},{"kind":"Field","name":{"kind":"Name","value":"isTome"}},{"kind":"Field","name":{"kind":"Name","value":"isRvR"}},{"kind":"Field","name":{"kind":"Name","value":"isPlayerKill"}},{"kind":"Field","name":{"kind":"Name","value":"isEpic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"gold"}},{"kind":"Field","name":{"kind":"Name","value":"choiceCount"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsChoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rewardsGiven"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"objectives"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"journalEntry"}},{"kind":"Field","name":{"kind":"Name","value":"raceRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"minLevel"}},{"kind":"Field","name":{"kind":"Name","value":"maxLevel"}},{"kind":"Field","name":{"kind":"Name","value":"minRenown"}},{"kind":"Field","name":{"kind":"Name","value":"maxRenown"}},{"kind":"Field","name":{"kind":"Name","value":"starterCreatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}}]}}]}}]}}]} as unknown as DocumentNode<GetQuestInfoQuery, GetQuestInfoQueryVariables>;
export const GetQuestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetQuests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QuestFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"isTravel"}},{"kind":"Field","name":{"kind":"Name","value":"isTome"}},{"kind":"Field","name":{"kind":"Name","value":"isRvR"}},{"kind":"Field","name":{"kind":"Name","value":"isPlayerKill"}},{"kind":"Field","name":{"kind":"Name","value":"isEpic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"repeatableType"}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"gold"}},{"kind":"Field","name":{"kind":"Name","value":"choiceCount"}},{"kind":"Field","name":{"kind":"Name","value":"rewardsChoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rewardsGiven"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<GetQuestsQuery, GetQuestsQueryVariables>;
export const GetRankedLeaderboardSeasonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRankedLeaderboardSeasons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rankedSeasons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"mainSeason"}}]}}]}}]} as unknown as DocumentNode<GetRankedLeaderboardSeasonsQuery, GetRankedLeaderboardSeasonsQueryVariables>;
export const GetScenarioInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetScenarioInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scenario"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"queueType"}},{"kind":"Field","name":{"kind":"Name","value":"scoreboardEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ScenarioScoreboardEntry"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScenarioScoreboardEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ScenarioScoreboardEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"career"}}]}},{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"team"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"quitter"}},{"kind":"Field","name":{"kind":"Name","value":"protection"}},{"kind":"Field","name":{"kind":"Name","value":"kills"}},{"kind":"Field","name":{"kind":"Name","value":"deathBlows"}},{"kind":"Field","name":{"kind":"Name","value":"deaths"}},{"kind":"Field","name":{"kind":"Name","value":"damage"}},{"kind":"Field","name":{"kind":"Name","value":"healing"}},{"kind":"Field","name":{"kind":"Name","value":"objectiveScore"}},{"kind":"Field","name":{"kind":"Name","value":"killsSolo"}},{"kind":"Field","name":{"kind":"Name","value":"killDamage"}},{"kind":"Field","name":{"kind":"Name","value":"healingSelf"}},{"kind":"Field","name":{"kind":"Name","value":"healingOthers"}},{"kind":"Field","name":{"kind":"Name","value":"protectionSelf"}},{"kind":"Field","name":{"kind":"Name","value":"protectionOthers"}},{"kind":"Field","name":{"kind":"Name","value":"damageReceived"}},{"kind":"Field","name":{"kind":"Name","value":"resurrectionsDone"}},{"kind":"Field","name":{"kind":"Name","value":"healingReceived"}},{"kind":"Field","name":{"kind":"Name","value":"protectionReceived"}}]}}]} as unknown as DocumentNode<GetScenarioInfoQuery, GetScenarioInfoQueryVariables>;
export const SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Search"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Character"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"career"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}},{"kind":"Field","name":{"kind":"Name","value":"guildMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Guild"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"leader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slot"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"itemLevel"}},{"kind":"Field","name":{"kind":"Name","value":"itemSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Quest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"questType"},"name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isGroup"}},{"kind":"Field","name":{"kind":"Name","value":"isTravel"}},{"kind":"Field","name":{"kind":"Name","value":"isTome"}},{"kind":"Field","name":{"kind":"Name","value":"isRvR"}},{"kind":"Field","name":{"kind":"Name","value":"isPlayerKill"}},{"kind":"Field","name":{"kind":"Name","value":"isEpic"}}]}},{"kind":"Field","name":{"kind":"Name","value":"repeatableType"}},{"kind":"Field","name":{"kind":"Name","value":"minLevel"}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"gold"}},{"kind":"Field","name":{"kind":"Name","value":"journalEntry"}},{"kind":"Field","alias":{"kind":"Name","value":"questDescription"},"name":{"kind":"Name","value":"description"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Creature"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creatureSubType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<SearchQuery, SearchQueryVariables>;
export const SearchGuildsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchGuilds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guilds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"leader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"renownRank"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<SearchGuildsQuery, SearchGuildsQueryVariables>;
export const GetSkirmishInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSkirmishInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skirmish"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scenario"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"heatmap"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKills"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfKillsDestruction"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayers"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersOrder"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfPlayersDestruction"}},{"kind":"Field","name":{"kind":"Name","value":"topGuildsByPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topGuildsByKills"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guild"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"realm"}},{"kind":"Field","name":{"kind":"Name","value":"heraldry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emblem"}},{"kind":"Field","name":{"kind":"Name","value":"pattern"}},{"kind":"Field","name":{"kind":"Name","value":"color1"}},{"kind":"Field","name":{"kind":"Name","value":"color2"}},{"kind":"Field","name":{"kind":"Name","value":"shape"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetSkirmishInfoQuery, GetSkirmishInfoQueryVariables>;
export const GetWarJournalStorylineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWarJournalStoryline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"warJournalStoryline"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isRvR"}}]}}]}}]}}]} as unknown as DocumentNode<GetWarJournalStorylineQuery, GetWarJournalStorylineQueryVariables>;
export const GetWarJournalActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWarJournalActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"warJournalEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"locationText"}},{"kind":"Field","name":{"kind":"Name","value":"npcName"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"shortTitle"}},{"kind":"Field","name":{"kind":"Name","value":"isRvR"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}}]}}]} as unknown as DocumentNode<GetWarJournalActivityQuery, GetWarJournalActivityQueryVariables>;
export const GetWarJournalEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWarJournalEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"warJournalEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"locationText"}},{"kind":"Field","name":{"kind":"Name","value":"npcName"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"shortTitle"}},{"kind":"Field","name":{"kind":"Name","value":"isRvR"}},{"kind":"Field","name":{"kind":"Name","value":"area"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}},{"kind":"Field","name":{"kind":"Name","value":"influenceRewards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChapterInfluenceReward"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ItemListEntry"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Item"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"iconUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"careerRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"raceRestriction"}},{"kind":"Field","name":{"kind":"Name","value":"uniqueEquipped"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slot"}},{"kind":"Field","name":{"kind":"Name","value":"rarity"}},{"kind":"Field","name":{"kind":"Name","value":"armor"}},{"kind":"Field","name":{"kind":"Name","value":"dps"}},{"kind":"Field","name":{"kind":"Name","value":"speed"}},{"kind":"Field","name":{"kind":"Name","value":"levelRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"renownRankRequirement"}},{"kind":"Field","name":{"kind":"Name","value":"itemLevel"}},{"kind":"Field","name":{"kind":"Name","value":"talismanSlots"}},{"kind":"Field","name":{"kind":"Name","value":"itemSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bonuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsRequired"}},{"kind":"Field","name":{"kind":"Name","value":"bonus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Ability"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ItemStat"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"abilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"buffs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stat"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChapterInfluenceReward"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChapterInfluenceReward"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ItemListEntry"}}]}}]}}]} as unknown as DocumentNode<GetWarJournalEntryQuery, GetWarJournalEntryQueryVariables>;
export const GetWarJournalStorylinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWarJournalStorylines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"warJournalStorylines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetWarJournalStorylinesQuery, GetWarJournalStorylinesQueryVariables>;
export const GetZoneHeatmapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetZoneHeatmap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Long"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"killsHeatmap"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"zoneId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<GetZoneHeatmapQuery, GetZoneHeatmapQueryVariables>;