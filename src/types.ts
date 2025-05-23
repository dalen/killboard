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
  Byte: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Long: { input: any; output: any; }
  Short: { input: any; output: any; }
  URL: { input: any; output: any; }
  UUID: { input: any; output: any; }
  UnsignedInt: { input: any; output: any; }
  UnsignedLong: { input: any; output: any; }
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
