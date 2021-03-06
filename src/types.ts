export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Byte` scalar type represents non-fractional whole numeric values. Byte can represent values between 0 and 255. */
  Byte: any;
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any;
  UUID: any;
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

/** Player Career/Class */
export enum Career {
  /** Archmage */
  Archmage = 'ARCHMAGE',
  /** Blackguard */
  Blackguard = 'BLACKGUARD',
  /** Black Orc */
  BlackOrc = 'BLACK_ORC',
  /** Bright Wizard */
  BrightWizard = 'BRIGHT_WIZARD',
  /** Choppa */
  Choppa = 'CHOPPA',
  /** Chosen */
  Chosen = 'CHOSEN',
  /** Disciple of Khaine */
  Disciple = 'DISCIPLE',
  /** Engineer */
  Engineer = 'ENGINEER',
  /** Ironbreaker */
  Ironbreaker = 'IRONBREAKER',
  /** Knight of the Blazing Sun */
  Knight = 'KNIGHT',
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
  Swordmaster = 'SWORDMASTER',
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
  leader: Character;
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

/** Holds information about a kill */
export type Kill = {
  __typename?: 'Kill';
  /** List of all enemy players contributing to the kill */
  attackers: Array<Attacker>;
  /** Kill Id */
  id?: Maybe<Scalars['ID']>;
  /** InstanceId, specifies the instance of a scenario this kill happened in */
  instanceId?: Maybe<Scalars['ID']>;
  /** Position information */
  position: Position;
  /** Scenario information */
  scenario?: Maybe<Scenario>;
  /** ScenarioId, 0 if not in a scenario */
  scenarioId: Scalars['Int'];
  /** UTC Timestamp */
  time: Scalars['Int'];
  /** The total renown generated from the kill, including AAO modifiers */
  totalRenown: Scalars['Int'];
  /** The victim */
  victim: Victim;
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
  count: Scalars['Int'];
  x: Scalars['Int'];
  y: Scalars['Int'];
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
  /** Zone X position of Victim at the time of the kill */
  x: Scalars['Int'];
  /** Zone Y position of Victim at the time of the kill */
  y: Scalars['Int'];
  /** Z position of Victim at the time of the kill */
  z: Scalars['Int'];
  /** ZoneId of Victim at the time of the kill */
  zoneId: Scalars['Int'];
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
  scenario?: Maybe<Scenario>;
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
  Order = 'ORDER'
}

export type RealmOperationFilterInput = {
  eq?: InputMaybe<Realm>;
  in?: InputMaybe<Array<Realm>>;
  neq?: InputMaybe<Realm>;
  nin?: InputMaybe<Array<Realm>>;
};

export type Scenario = {
  __typename?: 'Scenario';
  /** End time as Unix timestamp */
  endTime: Scalars['Long'];
  /** Scenario instance Id */
  instanceId: Scalars['UUID'];
  /** Points for each team, 0 is order, 1 is destruction */
  points: Array<Scalars['Int']>;
  /** Queue type */
  queueType: ScenarioQueueType;
  /** Scenario Id */
  scenarioId: Scalars['Int'];
  /** Scoreboard entries */
  scoreboardEntries: Array<ScenarioScoreboardEntry>;
  /** Start time as Unix timestamp */
  startTime: Scalars['Long'];
  /** Scenario tier */
  tier: Scalars['Byte'];
  /** Winning team, 0 is order, 1 is destruction */
  winner: Scalars['Byte'];
};

export enum ScenarioQueueType {
  City = 'CITY',
  Duo = 'DUO',
  GroupChallenge = 'GROUP_CHALLENGE',
  GroupRanked = 'GROUP_RANKED',
  SoloRanked = 'SOLO_RANKED',
  Standard = 'STANDARD'
}

export type ScenarioScoreboardEntry = {
  __typename?: 'ScenarioScoreboardEntry';
  /** Character information */
  character: Character;
  /** Damage */
  damage: Scalars['Int'];
  /** Damage Received */
  damageReceived: Scalars['Int'];
  /** Death blows */
  deathBlows: Scalars['Int'];
  /** Deaths */
  deaths: Scalars['Int'];
  /** Guild at the time of the scenario */
  guild?: Maybe<Guild>;
  /** Healing */
  healing: Scalars['Int'];
  /** Healing of others */
  healingOthers: Scalars['Int'];
  /** Healing Received */
  healingReceived: Scalars['Int'];
  /** Healing of self */
  healingSelf: Scalars['Int'];
  /** Damage contributing to kills */
  killDamage: Scalars['Int'];
  /** Kills */
  kills: Scalars['Int'];
  /** Solo Kills */
  killsSolo: Scalars['Int'];
  /** Level at the time of the scenario */
  level: Scalars['Byte'];
  /** Objective Score */
  objectiveScore: Scalars['Int'];
  /** Damage Prevented */
  protection: Scalars['Int'];
  /** Protection of others */
  protectionOthers: Scalars['Int'];
  /** Protection Received */
  protectionReceived: Scalars['Int'];
  /** Protection of self */
  protectionSelf: Scalars['Int'];
  /** If true the player left the scenario before it ended */
  quitter: Scalars['Boolean'];
  /** Renown rank at the time of the scenario */
  renownRank: Scalars['Byte'];
  /** Resurrections */
  resurrectionsDone: Scalars['Int'];
  /** The team of the player. Normally Order=0, Destruction=1. */
  team: Scalars['Byte'];
};

/** A connection to a list of items. */
export type ScenariosConnection = {
  __typename?: 'ScenariosConnection';
  /** A list of edges. */
  edges?: Maybe<Array<ScenariosEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Scenario>>;
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
  node: Scenario;
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
