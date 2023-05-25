export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Byte: any;
  Long: any;
  UUID: any;
  UnsignedInt: any;
  UnsignedLong: any;
  UnsignedShort: any;
};

export type AssistFilterInput = {
  and?: InputMaybe<Array<AssistFilterInput>>;
  characterId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  damagePercent?: InputMaybe<ComparableByteOperationFilterInput>;
  guildId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  id?: InputMaybe<ComparableUInt64OperationFilterInput>;
  kill?: InputMaybe<KillFilterInput>;
  killId?: InputMaybe<ComparableUInt64OperationFilterInput>;
  level?: InputMaybe<ComparableByteOperationFilterInput>;
  or?: InputMaybe<Array<AssistFilterInput>>;
  renownRank?: InputMaybe<ComparableByteOperationFilterInput>;
};

/** Holds information about one attacker in a kill */
export type Attacker = {
  __typename?: 'Attacker';
  /** Character information */
  character: Character;
  /** Amount of the total damage done by this attacker */
  damagePercent: Scalars['Byte'];
  /** Guild at the time of the kill */
  guild?: Maybe<Guild>;
  /** Level at the time of the kill */
  level: Scalars['Byte'];
  /** Renown rank at the time of the kill */
  renownRank: Scalars['Byte'];
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  neq?: InputMaybe<Scalars['Boolean']>;
};

/** Player Career/Class */
export enum Career {
  /** Archmage */
  Archmage = 'ARCHMAGE',
  /** Blackguard */
  Blackguard = 'BLACK_GUARD',
  /** Black Orc */
  BlackOrc = 'BLACK_ORC',
  /** Bright Wizard */
  BrightWizard = 'BRIGHT_WIZARD',
  /** Choppa */
  Choppa = 'CHOPPA',
  /** Chosen */
  Chosen = 'CHOSEN',
  /** Disciple of Khaine */
  Disciple = 'DISCIPLE_OF_KHAINE',
  /** Engineer */
  Engineer = 'ENGINEER',
  /** Ironbreaker */
  Ironbreaker = 'IRON_BREAKER',
  /** Knight of the Blazing Sun */
  Knight = 'KNIGHT_OF_THE_BLAZING_SUN',
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
  /** Sorcerer */
  Sorcerer = 'SORCERER',
  /** Squig Herder */
  SquigHerder = 'SQUIG_HERDER',
  /** Swordmaster */
  Swordmaster = 'SWORD_MASTER',
  /** Warrior Priest */
  WarriorPriest = 'WARRIOR_PRIEST',
  /** White Lion */
  WhiteLion = 'WHITE_LION',
  /** Witch Elf */
  WitchElf = 'WITCH_ELF',
  /** Witch Hunter */
  WitchHunter = 'WITCH_HUNTER',
  /** Zealot */
  Zealot = 'ZEALOT',
}

export type CareerOperationFilterInput = {
  eq?: InputMaybe<Career>;
  in?: InputMaybe<Array<Career>>;
  neq?: InputMaybe<Career>;
  nin?: InputMaybe<Array<Career>>;
};

/** Info about a character */
export type Character = {
  __typename?: 'Character';
  /** Career/Class of the character */
  career: Career;
  /** Current Guild membership */
  guildMembership?: Maybe<GuildMember>;
  /** Character Id */
  id?: Maybe<Scalars['ID']>;
  /** Current Level */
  level: Scalars['Byte'];
  /** First name */
  name: Scalars['String'];
  /** Current Renown Rank */
  renownRank: Scalars['Byte'];
  /* Iteems aka Gear */
  items: Array<ItemSlot>;
};

/** Info about a character */
export type CharacterFilterInput = {
  /** Character career */
  career?: InputMaybe<CareerOperationFilterInput>;
  /** Character name */
  name?: InputMaybe<StringOperationFilterInput>;
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
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type CharactersEdge = {
  __typename?: 'CharactersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Character;
};

export type ComparableByteOperationFilterInput = {
  eq?: InputMaybe<Scalars['Byte']>;
  gt?: InputMaybe<Scalars['Byte']>;
  gte?: InputMaybe<Scalars['Byte']>;
  in?: InputMaybe<Array<Scalars['Byte']>>;
  lt?: InputMaybe<Scalars['Byte']>;
  lte?: InputMaybe<Scalars['Byte']>;
  neq?: InputMaybe<Scalars['Byte']>;
  ngt?: InputMaybe<Scalars['Byte']>;
  ngte?: InputMaybe<Scalars['Byte']>;
  nin?: InputMaybe<Array<Scalars['Byte']>>;
  nlt?: InputMaybe<Scalars['Byte']>;
  nlte?: InputMaybe<Scalars['Byte']>;
};

export type ComparableGuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']>;
  gt?: InputMaybe<Scalars['UUID']>;
  gte?: InputMaybe<Scalars['UUID']>;
  in?: InputMaybe<Array<Scalars['UUID']>>;
  lt?: InputMaybe<Scalars['UUID']>;
  lte?: InputMaybe<Scalars['UUID']>;
  neq?: InputMaybe<Scalars['UUID']>;
  ngt?: InputMaybe<Scalars['UUID']>;
  ngte?: InputMaybe<Scalars['UUID']>;
  nin?: InputMaybe<Array<Scalars['UUID']>>;
  nlt?: InputMaybe<Scalars['UUID']>;
  nlte?: InputMaybe<Scalars['UUID']>;
};

export type ComparableInt32OperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  neq?: InputMaybe<Scalars['Int']>;
  ngt?: InputMaybe<Scalars['Int']>;
  ngte?: InputMaybe<Scalars['Int']>;
  nin?: InputMaybe<Array<Scalars['Int']>>;
  nlt?: InputMaybe<Scalars['Int']>;
  nlte?: InputMaybe<Scalars['Int']>;
};

export type ComparableInt64OperationFilterInput = {
  eq?: InputMaybe<Scalars['Long']>;
  gt?: InputMaybe<Scalars['Long']>;
  gte?: InputMaybe<Scalars['Long']>;
  in?: InputMaybe<Array<Scalars['Long']>>;
  lt?: InputMaybe<Scalars['Long']>;
  lte?: InputMaybe<Scalars['Long']>;
  neq?: InputMaybe<Scalars['Long']>;
  ngt?: InputMaybe<Scalars['Long']>;
  ngte?: InputMaybe<Scalars['Long']>;
  nin?: InputMaybe<Array<Scalars['Long']>>;
  nlt?: InputMaybe<Scalars['Long']>;
  nlte?: InputMaybe<Scalars['Long']>;
};

export type ComparableNullableOfGuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']>;
  gt?: InputMaybe<Scalars['UUID']>;
  gte?: InputMaybe<Scalars['UUID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  lt?: InputMaybe<Scalars['UUID']>;
  lte?: InputMaybe<Scalars['UUID']>;
  neq?: InputMaybe<Scalars['UUID']>;
  ngt?: InputMaybe<Scalars['UUID']>;
  ngte?: InputMaybe<Scalars['UUID']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  nlt?: InputMaybe<Scalars['UUID']>;
  nlte?: InputMaybe<Scalars['UUID']>;
};

export type ComparableUInt16OperationFilterInput = {
  eq?: InputMaybe<Scalars['UnsignedShort']>;
  gt?: InputMaybe<Scalars['UnsignedShort']>;
  gte?: InputMaybe<Scalars['UnsignedShort']>;
  in?: InputMaybe<Array<Scalars['UnsignedShort']>>;
  lt?: InputMaybe<Scalars['UnsignedShort']>;
  lte?: InputMaybe<Scalars['UnsignedShort']>;
  neq?: InputMaybe<Scalars['UnsignedShort']>;
  ngt?: InputMaybe<Scalars['UnsignedShort']>;
  ngte?: InputMaybe<Scalars['UnsignedShort']>;
  nin?: InputMaybe<Array<Scalars['UnsignedShort']>>;
  nlt?: InputMaybe<Scalars['UnsignedShort']>;
  nlte?: InputMaybe<Scalars['UnsignedShort']>;
};

export type ComparableUInt32OperationFilterInput = {
  eq?: InputMaybe<Scalars['UnsignedInt']>;
  gt?: InputMaybe<Scalars['UnsignedInt']>;
  gte?: InputMaybe<Scalars['UnsignedInt']>;
  in?: InputMaybe<Array<Scalars['UnsignedInt']>>;
  lt?: InputMaybe<Scalars['UnsignedInt']>;
  lte?: InputMaybe<Scalars['UnsignedInt']>;
  neq?: InputMaybe<Scalars['UnsignedInt']>;
  ngt?: InputMaybe<Scalars['UnsignedInt']>;
  ngte?: InputMaybe<Scalars['UnsignedInt']>;
  nin?: InputMaybe<Array<Scalars['UnsignedInt']>>;
  nlt?: InputMaybe<Scalars['UnsignedInt']>;
  nlte?: InputMaybe<Scalars['UnsignedInt']>;
};

export type ComparableUInt64OperationFilterInput = {
  eq?: InputMaybe<Scalars['UnsignedLong']>;
  gt?: InputMaybe<Scalars['UnsignedLong']>;
  gte?: InputMaybe<Scalars['UnsignedLong']>;
  in?: InputMaybe<Array<Scalars['UnsignedLong']>>;
  lt?: InputMaybe<Scalars['UnsignedLong']>;
  lte?: InputMaybe<Scalars['UnsignedLong']>;
  neq?: InputMaybe<Scalars['UnsignedLong']>;
  ngt?: InputMaybe<Scalars['UnsignedLong']>;
  ngte?: InputMaybe<Scalars['UnsignedLong']>;
  nin?: InputMaybe<Array<Scalars['UnsignedLong']>>;
  nlt?: InputMaybe<Scalars['UnsignedLong']>;
  nlte?: InputMaybe<Scalars['UnsignedLong']>;
};

export type Guild = {
  __typename?: 'Guild';
  /** Recruiting brief description */
  briefDescription: Scalars['String'];
  /** Recruiting description */
  description: Scalars['String'];
  /** Guild heraldry */
  heraldry: GuildHeraldry;
  /** Guild Id */
  id?: Maybe<Scalars['ID']>;
  /** Guild leader */
  leader?: Maybe<Character>;
  /** Guild level */
  level: Scalars['Byte'];
  /** Guild members */
  members?: Maybe<MembersConnection>;
  /** Guild name */
  name: Scalars['String'];
  /** Guild ranks */
  ranks: Array<GuildRank>;
  /** Realm */
  realm: Realm;
};

export type GuildMembersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type GuildFeudFilterInput = {
  guild1Id?: InputMaybe<Scalars['ID']>;
  guild2Id?: InputMaybe<Scalars['ID']>;
};

export type GuildFilterInput = {
  /** Guild name */
  name?: InputMaybe<StringOperationFilterInput>;
  /** Guild realm */
  realm?: InputMaybe<RealmOperationFilterInput>;
};

export type GuildHeraldry = {
  __typename?: 'GuildHeraldry';
  color1: Scalars['Int'];
  color2: Scalars['Int'];
  emblem: Scalars['Int'];
  pattern: Scalars['Int'];
  shape: Scalars['Int'];
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
  /** Rank id */
  id: Scalars['Byte'];
  /** Rank name */
  name: Scalars['String'];
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
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type GuildsEdge = {
  __typename?: 'GuildsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Guild;
};

export type Kill = {
  __typename?: 'Kill';
  /** List of all enemy players contributing to the kill */
  attackers: Array<Attacker>;
  /** Kill Id */
  id: Scalars['UnsignedLong'];
  /** Specifies the instance of a scenario this kill happened in */
  instanceId?: Maybe<Scalars['ID']>;
  /** Position of the victim at the time of the kill */
  position: Position;
  /** Scenario, null if not in a scenario */
  scenario?: Maybe<Scenario>;
  /** ScenarioId, 0 if not in a scenario */
  scenarioId: Scalars['UnsignedInt'];
  /** Scenario information */
  scenarioRecord?: Maybe<ScenarioRecord>;
  /** UTC Timestamp */
  time: Scalars['Int'];
  /** The total renown generated from the kill, including AAO modifiers */
  totalRenown: Scalars['UnsignedInt'];
  /** The victim */
  victim: Victim;
};

export type KillFilterInput = {
  and?: InputMaybe<Array<KillFilterInput>>;
  assists?: InputMaybe<ListFilterInputTypeOfAssistFilterInput>;
  damagePercent?: InputMaybe<ComparableByteOperationFilterInput>;
  id?: InputMaybe<ComparableUInt64OperationFilterInput>;
  instanceId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  killerCharacterId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  killerGuildId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  killerLevel?: InputMaybe<ComparableByteOperationFilterInput>;
  killerRenownRank?: InputMaybe<ComparableByteOperationFilterInput>;
  numAssists?: InputMaybe<ComparableUInt32OperationFilterInput>;
  or?: InputMaybe<Array<KillFilterInput>>;
  scenarioId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  time?: InputMaybe<ComparableInt32OperationFilterInput>;
  totalRenown?: InputMaybe<ComparableUInt32OperationFilterInput>;
  victimCharacterId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  victimGuildId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  victimLevel?: InputMaybe<ComparableByteOperationFilterInput>;
  victimRenownRank?: InputMaybe<ComparableByteOperationFilterInput>;
  zoneId?: InputMaybe<ComparableUInt16OperationFilterInput>;
  zoneX?: InputMaybe<ComparableUInt16OperationFilterInput>;
  zoneY?: InputMaybe<ComparableUInt16OperationFilterInput>;
  zoneZ?: InputMaybe<ComparableUInt16OperationFilterInput>;
};

export type KillGuildLeaderboardEntry = {
  __typename?: 'KillGuildLeaderboardEntry';
  /** Number of deaths */
  deaths: Scalars['Int'];
  /** Guild information */
  guild: Guild;
  /** Number of kills */
  kills: Scalars['Int'];
  /** Rank */
  rank: Scalars['Int'];
};

export type KillLeaderboardEntry = {
  __typename?: 'KillLeaderboardEntry';
  /** Character information */
  character: Character;
  /** Number of deaths */
  deaths: Scalars['Int'];
  /** Number of kills */
  kills: Scalars['Int'];
  /** Rank */
  rank: Scalars['Int'];
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
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type KillsEdge = {
  __typename?: 'KillsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Kill;
};

export type KillsHeatmapPoint = {
  __typename?: 'KillsHeatmapPoint';
  count: Scalars['UnsignedInt'];
  x: Scalars['UnsignedInt'];
  y: Scalars['UnsignedInt'];
};

export type ListFilterInputTypeOfAssistFilterInput = {
  all?: InputMaybe<AssistFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<AssistFilterInput>;
  some?: InputMaybe<AssistFilterInput>;
};

export type ListFilterInputTypeOfScenarioScoreboardEntryFilterInput = {
  all?: InputMaybe<ScenarioScoreboardEntryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ScenarioScoreboardEntryFilterInput>;
  some?: InputMaybe<ScenarioScoreboardEntryFilterInput>;
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
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type MembersEdge = {
  __typename?: 'MembersEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: GuildMember;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type PlayerFeudFilterInput = {
  player1Id?: InputMaybe<Scalars['ID']>;
  player2Id?: InputMaybe<Scalars['ID']>;
};

export type Position = {
  __typename?: 'Position';
  /** Zone X position */
  x: Scalars['UnsignedShort'];
  /** Zone Y position */
  y: Scalars['UnsignedShort'];
  /** Z position */
  z: Scalars['UnsignedShort'];
  /** Zone Info */
  zone?: Maybe<Zone>;
  /** ZoneId */
  zoneId: Scalars['UnsignedShort'];
};

export type Query = {
  __typename?: 'Query';
  character?: Maybe<Character>;
  characters?: Maybe<CharactersConnection>;
  guild?: Maybe<Guild>;
  guilds?: Maybe<GuildsConnection>;
  kill?: Maybe<Kill>;
  kills?: Maybe<KillsConnection>;
  killsHeatmap: Array<KillsHeatmapPoint>;
  monthlyGuildKillLeaderboard: Array<KillGuildLeaderboardEntry>;
  monthlyKillLeaderboard: Array<KillLeaderboardEntry>;
  /** Get scenario result from instance id */
  scenario?: Maybe<ScenarioRecord>;
  scenarios?: Maybe<ScenariosConnection>;
  weeklyGuildKillLeaderboard: Array<KillGuildLeaderboardEntry>;
  weeklyKillLeaderboard: Array<KillLeaderboardEntry>;
};

export type QueryCharacterArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryCharactersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CharacterFilterInput>;
};

export type QueryGuildArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryGuildsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GuildFilterInput>;
};

export type QueryKillArgs = {
  id?: InputMaybe<Scalars['ID']>;
  includeAssists?: Scalars['Boolean'];
};

export type QueryKillsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  from?: InputMaybe<Scalars['Long']>;
  guildFeudFilter?: InputMaybe<GuildFeudFilterInput>;
  includeAssists?: Scalars['Boolean'];
  instanceId?: InputMaybe<Scalars['String']>;
  killerGuildId?: InputMaybe<Scalars['ID']>;
  killerId?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  playerFeudFilter?: InputMaybe<PlayerFeudFilterInput>;
  scenarioId?: InputMaybe<Scalars['ID']>;
  soloOnly?: Scalars['Boolean'];
  to?: InputMaybe<Scalars['Long']>;
  victimGuildId?: InputMaybe<Scalars['ID']>;
  victimId?: InputMaybe<Scalars['ID']>;
  where?: InputMaybe<KillFilterInput>;
  zoneId?: InputMaybe<Scalars['ID']>;
};

export type QueryKillsHeatmapArgs = {
  from?: InputMaybe<Scalars['Long']>;
  instanceId?: InputMaybe<Scalars['ID']>;
  killerGuildId?: InputMaybe<Scalars['ID']>;
  killerId?: InputMaybe<Scalars['ID']>;
  maxX?: Scalars['Int'];
  maxY?: Scalars['Int'];
  minX?: Scalars['Int'];
  minY?: Scalars['Int'];
  soloOnly?: Scalars['Boolean'];
  to?: InputMaybe<Scalars['Long']>;
  victimGuildId?: InputMaybe<Scalars['ID']>;
  victimId?: InputMaybe<Scalars['ID']>;
  zoneId?: InputMaybe<Scalars['ID']>;
};

export type QueryMonthlyGuildKillLeaderboardArgs = {
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type QueryMonthlyKillLeaderboardArgs = {
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type QueryScenarioArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type QueryScenariosArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  characterId?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  from?: InputMaybe<Scalars['Long']>;
  guildId?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  queueType?: InputMaybe<ScenarioQueueType>;
  scenarioId?: InputMaybe<Scalars['ID']>;
  to?: InputMaybe<Scalars['Long']>;
  where?: InputMaybe<ScenarioRecordFilterInput>;
};

export type QueryWeeklyGuildKillLeaderboardArgs = {
  week: Scalars['Int'];
  year: Scalars['Int'];
};

export type QueryWeeklyKillLeaderboardArgs = {
  week: Scalars['Int'];
  year: Scalars['Int'];
};

export enum Realm {
  Destruction = 'DESTRUCTION',
  Order = 'ORDER',
}

export type RealmOperationFilterInput = {
  eq?: InputMaybe<Realm>;
  in?: InputMaybe<Array<Realm>>;
  neq?: InputMaybe<Realm>;
  nin?: InputMaybe<Array<Realm>>;
};

export type Scenario = {
  __typename?: 'Scenario';
  /** The unique id of the scenario */
  id: Scalars['ID'];
  /** The name of the scenario */
  name: Scalars['String'];
  /** Zone information */
  zone: Zone;
};

export enum ScenarioQueueType {
  City = 'CITY',
  Duo = 'DUO',
  GroupChallenge = 'GROUP_CHALLENGE',
  Premade = 'PREMADE',
  SoloRanked = 'SOLO_RANKED',
  Standard = 'STANDARD',
  Unused = 'UNUSED',
}

export type ScenarioRecord = {
  __typename?: 'ScenarioRecord';
  /** The end time of the scenario */
  endTime: Scalars['Long'];
  /** Scenario instance Id */
  instanceId: Scalars['ID'];
  /** The kills that occurred in the scenario */
  kills: Array<Kill>;
  /** Points for each team, 0 is order, 1 is destruction */
  points: Array<Maybe<Scalars['UnsignedInt']>>;
  /** Queue type */
  queueType: Scalars['Byte'];
  /** Scenario information */
  scenario: Scenario;
  /** Scenario Id */
  scenarioId: Scalars['ID'];
  /** Scoreboard entries */
  scoreboardEntries: Array<ScenarioScoreboardEntry>;
  /** The start time of the scenario */
  startTime: Scalars['Long'];
  /** Scenario tier */
  tier: Scalars['Byte'];
  /** Winning team, 0 is order, 1 is destruction */
  winner: Scalars['Byte'];
};

export type ScenarioRecordFilterInput = {
  and?: InputMaybe<Array<ScenarioRecordFilterInput>>;
  endTime?: InputMaybe<ComparableInt64OperationFilterInput>;
  id?: InputMaybe<ComparableUInt32OperationFilterInput>;
  instanceId?: InputMaybe<ComparableGuidOperationFilterInput>;
  or?: InputMaybe<Array<ScenarioRecordFilterInput>>;
  pointsTeam0?: InputMaybe<ComparableUInt32OperationFilterInput>;
  pointsTeam1?: InputMaybe<ComparableUInt32OperationFilterInput>;
  queueType?: InputMaybe<ComparableByteOperationFilterInput>;
  scenarioId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  scoreboardEntries?: InputMaybe<ListFilterInputTypeOfScenarioScoreboardEntryFilterInput>;
  startTime?: InputMaybe<ComparableInt64OperationFilterInput>;
  tier?: InputMaybe<ComparableByteOperationFilterInput>;
  winner?: InputMaybe<ComparableByteOperationFilterInput>;
};

export type ScenarioScoreboardEntry = {
  __typename?: 'ScenarioScoreboardEntry';
  /** Character information */
  character: Character;
  /** Damage */
  damage: Scalars['UnsignedInt'];
  /** Damage Received */
  damageReceived: Scalars['UnsignedInt'];
  /** Death blows */
  deathBlows: Scalars['UnsignedInt'];
  /** Deaths */
  deaths: Scalars['UnsignedInt'];
  /** Guild at the time of the scenario */
  guild?: Maybe<Guild>;
  /** Healing */
  healing: Scalars['UnsignedInt'];
  /** Healing of others */
  healingOthers: Scalars['UnsignedInt'];
  /** Healing of self */
  healingReceived: Scalars['UnsignedInt'];
  /** Healing of self */
  healingSelf: Scalars['UnsignedInt'];
  /** Damage contributing to kills */
  killDamage: Scalars['UnsignedInt'];
  /** Kills */
  kills: Scalars['UnsignedInt'];
  /** Solo Kills */
  killsSolo: Scalars['UnsignedInt'];
  /** Level at the time of the scenario */
  level: Scalars['Byte'];
  /** Objective Score */
  objectiveScore: Scalars['UnsignedInt'];
  /** Damage Prevented */
  protection: Scalars['UnsignedInt'];
  /** Protection of others */
  protectionOthers: Scalars['UnsignedInt'];
  /** Protection Received */
  protectionReceived: Scalars['UnsignedInt'];
  /** Protection of self */
  protectionSelf: Scalars['UnsignedInt'];
  /** If true the player left the scenario before it ended */
  quitter: Scalars['Boolean'];
  /** Renown rank at the time of the scenario */
  renownRank: Scalars['Byte'];
  /** Resurrections */
  resurrectionsDone: Scalars['UnsignedInt'];
  /** The team of the player. Normally Order=0, Destruction=1. */
  team: Scalars['Byte'];
};

export type ScenarioScoreboardEntryFilterInput = {
  and?: InputMaybe<Array<ScenarioScoreboardEntryFilterInput>>;
  characterId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  damage?: InputMaybe<ComparableUInt32OperationFilterInput>;
  damageReceived?: InputMaybe<ComparableUInt32OperationFilterInput>;
  deathBlows?: InputMaybe<ComparableUInt32OperationFilterInput>;
  deaths?: InputMaybe<ComparableUInt32OperationFilterInput>;
  guildId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  healing?: InputMaybe<ComparableUInt32OperationFilterInput>;
  healingOthers?: InputMaybe<ComparableUInt32OperationFilterInput>;
  healingReceived?: InputMaybe<ComparableUInt32OperationFilterInput>;
  healingSelf?: InputMaybe<ComparableUInt32OperationFilterInput>;
  killDamage?: InputMaybe<ComparableUInt32OperationFilterInput>;
  kills?: InputMaybe<ComparableUInt32OperationFilterInput>;
  killsSolo?: InputMaybe<ComparableUInt32OperationFilterInput>;
  level?: InputMaybe<ComparableByteOperationFilterInput>;
  objectiveScore?: InputMaybe<ComparableUInt32OperationFilterInput>;
  or?: InputMaybe<Array<ScenarioScoreboardEntryFilterInput>>;
  protection?: InputMaybe<ComparableUInt32OperationFilterInput>;
  protectionOthers?: InputMaybe<ComparableUInt32OperationFilterInput>;
  protectionReceived?: InputMaybe<ComparableUInt32OperationFilterInput>;
  protectionSelf?: InputMaybe<ComparableUInt32OperationFilterInput>;
  quitter?: InputMaybe<BooleanOperationFilterInput>;
  renownRank?: InputMaybe<ComparableByteOperationFilterInput>;
  ressesDone?: InputMaybe<ComparableUInt32OperationFilterInput>;
  scenario?: InputMaybe<ScenarioRecordFilterInput>;
  scenarioId?: InputMaybe<ComparableUInt32OperationFilterInput>;
  team?: InputMaybe<ComparableByteOperationFilterInput>;
};

/** A connection to a list of items. */
export type ScenariosConnection = {
  __typename?: 'ScenariosConnection';
  /** A list of edges. */
  edges?: Maybe<Array<ScenariosEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<ScenarioRecord>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ScenariosEdge = {
  __typename?: 'ScenariosEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ScenarioRecord;
};

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ncontains?: InputMaybe<Scalars['String']>;
  nendsWith?: InputMaybe<Scalars['String']>;
  neq?: InputMaybe<Scalars['String']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  nstartsWith?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

/** Holds information about the victim of a kill */
export type Victim = {
  __typename?: 'Victim';
  /** Character information */
  character: Character;
  /** Guild at the time of the kill */
  guild?: Maybe<Guild>;
  /** Level at the time of the kill */
  level: Scalars['Byte'];
  /** Renown rank at the time of the kill */
  renownRank: Scalars['Byte'];
};

export type Zone = {
  __typename?: 'Zone';
  /** The unique id of the zone */
  id: Scalars['ID'];
  /** The name of the zone */
  name: Scalars['String'];
};

export type ItemSlot = {
  __typename?: 'CharacterItem';
  equipSlot: Scalars['String'];
  item: Item;
};

export type Item = {
  name: Scalars['String'];
  rarity: Scalars['String'];
  itemLevel: Scalars['Int'];
  iconUrl: Scalars['String'];
  renownRankRequirement: Scalars['Int'];
  levelRequirement: Scalars['Int'];
  type: Scalars['String'];
  slot: Scalars['String'];
  stats: Array<ItemStat>;
  armor: Scalars['Int'];
  careerRestriction: Array<Career>;
};

export type ItemStat = {
  stat: Scalars['String'];
  value: Scalars['Float'];
};
