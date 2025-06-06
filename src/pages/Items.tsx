import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { SearchBox } from '@/components/global/SearchBox';
import { ItemFilterInput, ItemType } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { ItemListEntry } from '@/components/item/ItemListEntry';
import { QueryPagination } from '@/components/global/QueryPagination';
import { ReactElement } from 'react';
import clsx from 'clsx';
import { ITEM_FRAGMENT } from '@/components/item/ItemIconWithPopup';
import { SearchItemsQuery } from '@/__generated__/graphql';

const SEARCH_ITEMS = gql`
  query SearchItems(
    $query: ItemFilterInput
    $usableByCareer: Career
    $hasStats: [Stat!]
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    items(
      where: $query
      usableByCareer: $usableByCareer
      hasStats: $hasStats
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        ...ItemListEntry
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }

  ${ITEM_FRAGMENT}
`;

const getSearchFilter = (search: URLSearchParams): ItemFilterInput => {
  const query = search.get('query');

  if (!query) {
    return {};
  }

  return { name: { contains: query } };
};

const getItemTypeFilter = (search: URLSearchParams): ItemFilterInput => {
  const type = search.get('type');

  if (!type || type === 'all') {
    return {};
  }

  return { type: { eq: type as ItemType } };
};

const getItemsFilters = (search: URLSearchParams): ItemFilterInput => ({
  ...getSearchFilter(search),
  ...getItemTypeFilter(search),
});

const usableByCareerFilter = (search: URLSearchParams) => {
  const career = search.get('career');

  if (career === 'all') {
    return {};
  }

  return { usableByCareer: career };
};

const hasStatsFilter = (search: URLSearchParams) => {
  const stat = search.get('stat');

  if (stat === 'any' || !stat) {
    return {};
  }

  return { hasStats: [stat] };
};
export function Items(): ReactElement {
  const perPage = 15;
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages']);
  const { loading, error, data, refetch } = useQuery<SearchItemsQuery>(
    SEARCH_ITEMS,
    {
      variables: {
        query: getItemsFilters(search),
        ...usableByCareerFilter(search),
        ...hasStatsFilter(search),
        first: perPage,
      },
    },
  );
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.items?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const entries = data.items.nodes;
  const { pageInfo } = data.items;

  return (
    <div className="container is-max-desktop mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/items">{t('pages:items.title')}</Link>
          </li>
        </ul>
      </nav>
      <div className="card mb-5">
        <div className="card-content">
          <div className="field">
            <label className="label">{t('pages:items.search')}</label>
            <SearchBox
              initialQuery={search.get('query') || ''}
              onSubmit={(event) => {
                search.set('query', event);
                setSearch(search);
              }}
            />
          </div>
          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label" htmlFor="type">
                  {t('pages:items.itemType')}
                </label>
                <select
                  id="type"
                  value={search.get('type') ?? undefined}
                  onChange={(event) => {
                    search.set('type', event.target.value);
                    setSearch(search);
                  }}
                >
                  <option value="all">{t('pages:items.all')}</option>
                  <option value="SWORD">{t('enums:itemType.SWORD')}</option>
                  <option value="AXE">{t('enums:itemType.AXE')}</option>
                  <option value="HAMMER">{t('enums:itemType.HAMMER')}</option>
                  <option value="BASIC_SHIELD">
                    {t('enums:itemType.BASIC_SHIELD')}
                  </option>
                  <option value="SHIELD">{t('enums:itemType.SHIELD')}</option>
                  <option value="ROBE">{t('enums:itemType.ROBE')}</option>
                  <option value="BOW">{t('enums:itemType.BOW')}</option>
                  <option value="CROSSBOW">
                    {t('enums:itemType.CROSSBOW')}
                  </option>
                  <option value="GUN">{t('enums:itemType.GUN')}</option>
                  <option value="EXPERT_SHIELD">
                    {t('enums:itemType.EXPERT_SHIELD')}
                  </option>
                  <option value="STAFF">{t('enums:itemType.STAFF')}</option>
                  <option value="DAGGER">{t('enums:itemType.DAGGER')}</option>
                  <option value="SPEAR">{t('enums:itemType.SPEAR')}</option>
                  <option value="PISTOL">{t('enums:itemType.PISTOL')}</option>
                  <option value="LANCE">{t('enums:itemType.LANCE')}</option>
                  <option value="REPEATING_CROSSBOW">
                    {t('enums:itemType.REPEATING_CROSSBOW')}
                  </option>
                  <option value="LIGHT_ARMOR">
                    {t('enums:itemType.LIGHT_ARMOR')}
                  </option>
                  <option value="MEDIUM_ARMOR">
                    {t('enums:itemType.MEDIUM_ARMOR')}
                  </option>
                  <option value="HEAVY_ARMOR">
                    {t('enums:itemType.HEAVY_ARMOR')}
                  </option>
                  <option value="QUEST">{t('enums:itemType.QUEST')}</option>
                  <option value="MEDIUM_ROBE">
                    {t('enums:itemType.MEDIUM_ROBE')}
                  </option>
                  <option value="ENHANCEMENT">
                    {t('enums:itemType.ENHANCEMENT')}
                  </option>
                  <option value="TROPHY">{t('enums:itemType.TROPHY')}</option>
                  <option value="CHARM">{t('enums:itemType.CHARM')}</option>
                  <option value="DYE">{t('enums:itemType.DYE')}</option>
                  <option value="BASIC_MOUNT">
                    {t('enums:itemType.BASIC_MOUNT')}
                  </option>
                  <option value="ADVANCED_MOUNT">
                    {t('enums:itemType.ADVANCED_MOUNT')}
                  </option>
                  <option value="POTION">{t('enums:itemType.POTION')}</option>
                  <option value="SALVAGING">
                    {t('enums:itemType.SALVAGING')}
                  </option>
                  <option value="MARKETING">
                    {t('enums:itemType.MARKETING')}
                  </option>
                  <option value="CRAFTING">
                    {t('enums:itemType.CRAFTING')}
                  </option>
                  <option value="ACCESSORY">
                    {t('enums:itemType.ACCESSORY')}
                  </option>
                  <option value="CURRENCY">
                    {t('enums:itemType.CURRENCY')}
                  </option>
                  <option value="TELEPORT">
                    {t('enums:itemType.TELEPORT')}
                  </option>
                  <option value="TELEPORT_GROUP">
                    {t('enums:itemType.TELEPORT_GROUP')}
                  </option>
                  <option value="SIEGE">{t('enums:itemType.SIEGE')}</option>
                  <option value="TREASURE_CHEST">
                    {t('enums:itemType.TREASURE_CHEST')}
                  </option>
                  <option value="TREASURE_KEY">
                    {t('enums:itemType.TREASURE_KEY')}
                  </option>
                  <option value="REFINER_TOOL">
                    {t('enums:itemType.REFINER_TOOL')}
                  </option>
                </select>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label" htmlFor="stat">
                  {t('pages:items.stat')}
                </label>
                <select
                  id="stat"
                  value={search.get('stat') ?? undefined}
                  onChange={(event) => {
                    search.set('stat', event.target.value);
                    setSearch(search);
                  }}
                >
                  <option value="any">{t('pages:items.any')}</option>
                  <option value="WOUNDS">{t('enums:stat.WOUNDS')}</option>
                  <option value="WEAPON_SKILL">
                    {t('enums:stat.WEAPON_SKILL')}
                  </option>
                  <option value="WILLPOWER">{t('enums:stat.WILLPOWER')}</option>
                  <option value="BALLISTIC_SKILL">
                    {t('enums:stat.BALLISTIC_SKILL')}
                  </option>
                  <option value="TOUGHNESS">{t('enums:stat.TOUGHNESS')}</option>
                  <option value="INITIATIVE">
                    {t('enums:stat.INITIATIVE')}
                  </option>
                  <option value="STRENGTH">{t('enums:stat.STRENGTH')}</option>
                  <option value="INTELLIGENCE">
                    {t('enums:stat.INTELLIGENCE')}
                  </option>
                  <option value="BLOCK">{t('enums:stat.BLOCK')}</option>
                  <option value="PARRY">{t('enums:stat.PARRY')}</option>
                  <option value="DISRUPT">{t('enums:stat.DISRUPT')}</option>
                  <option value="EVADE">{t('enums:stat.EVADE')}</option>
                  <option value="ELEMENTAL_RESISTANCE">
                    {t('enums:stat.ELEMENTAL_RESISTANCE')}
                  </option>
                  <option value="SPIRIT_RESISTANCE">
                    {t('enums:stat.SPIRIT_RESISTANCE')}
                  </option>
                  <option value="CORPOREAL_RESISTANCE">
                    {t('enums:stat.CORPOREAL_RESISTANCE')}
                  </option>
                  <option value="HEAL_CRIT_RATE">
                    {t('enums:stat.HEAL_CRIT_RATE')}
                  </option>
                  <option value="RANGED_CRIT_RATE">
                    {t('enums:stat.RANGED_CRIT_RATE')}
                  </option>
                  <option value="MELEE_CRIT_RATE">
                    {t('enums:stat.MELEE_CRIT_RATE')}
                  </option>
                  <option value="MAGIC_CRIT_RATE">
                    {t('enums:stat.MAGIC_CRIT_RATE')}
                  </option>
                  <option value="ACTION_POINT_REGEN">
                    {t('enums:stat.ACTION_POINT_REGEN')}
                  </option>
                  <option value="MORALE_REGEN">
                    {t('enums:stat.MORALE_REGEN')}
                  </option>
                  <option value="HEALTH_REGEN">
                    {t('enums:stat.HEALTH_REGEN')}
                  </option>
                  <option value="CRITICAL_HIT_RATE_REDUCTION">
                    {t('enums:stat.CRITICAL_HIT_RATE_REDUCTION')}
                  </option>
                  <option value="BLOCK_STRIKETHROUGH">
                    {t('enums:stat.BLOCK_STRIKETHROUGH')}
                  </option>
                  <option value="PARRY_STRIKETHROUGH">
                    {t('enums:stat.PARRY_STRIKETHROUGH')}
                  </option>
                  <option value="DISRUPT_STRIKETHROUGH">
                    {t('enums:stat.DISRUPT_STRIKETHROUGH')}
                  </option>
                  <option value="EVADE_STRIKETHROUGH">
                    {t('enums:stat.EVADE_STRIKETHROUGH')}
                  </option>
                  <option value="HEALING_POWER">
                    {t('enums:stat.HEALING_POWER')}
                  </option>
                  <option value="MAGIC_POWER">
                    {t('enums:stat.MAGIC_POWER')}
                  </option>
                  <option value="RANGED_POWER">
                    {t('enums:stat.RANGED_POWER')}
                  </option>
                  <option value="MELEE_POWER">
                    {t('enums:stat.MELEE_POWER')}
                  </option>
                  <option value="FORTITUDE">{t('enums:stat.FORTITUDE')}</option>
                  <option value="AUTO_ATTACK_SPEED">
                    {t('enums:stat.AUTO_ATTACK_SPEED')}
                  </option>
                  <option value="AUTO_ATTACK_DAMAGE">
                    {t('enums:stat.AUTO_ATTACK_DAMAGE')}
                  </option>
                  <option value="ARMOR_PENETRATION">
                    {t('enums:stat.ARMOR_PENETRATION')}
                  </option>
                  <option value="ARMOR_PENETRATION_REDUCTION">
                    {t('enums:stat.ARMOR_PENETRATION_REDUCTION')}
                  </option>
                  <option value="HATE_CAUSED">
                    {t('enums:stat.HATE_CAUSED')}
                  </option>
                  <option value="HATE_RECEIVED">
                    {t('enums:stat.HATE_RECEIVED')}
                  </option>
                </select>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label" htmlFor="career">
                  {t('pages:items.usableByCareer')}
                </label>
                <select
                  id="career"
                  value={search.get('career') ?? undefined}
                  onChange={(event) => {
                    search.set('career', event.target.value);
                    setSearch(search);
                  }}
                >
                  <option value="all">{t('pages:items.all')}</option>
                  <option value="ARCHMAGE">{t('enums:career.ARCHMAGE')}</option>
                  <option value="BLACKGUARD">
                    {t('enums:career.BLACKGUARD')}
                  </option>
                  <option value="BLACK_ORC">
                    {t('enums:career.BLACK_ORC')}
                  </option>
                  <option value="BRIGHT_WIZARD">
                    {t('enums:career.BRIGHT_WIZARD')}
                  </option>
                  <option value="CHOPPA">{t('enums:career.CHOPPA')}</option>
                  <option value="CHOSEN">{t('enums:career.CHOSEN')}</option>
                  <option value="DISCIPLE_OF_KHAINE">
                    {t('enums:career.DISCIPLE_OF_KHAINE')}
                  </option>
                  <option value="ENGINEER">{t('enums:career.ENGINEER')}</option>
                  <option value="IRON_BREAKER">
                    {t('enums:career.IRON_BREAKER')}
                  </option>
                  <option value="KNIGHT_OF_THE_BLAZING_SUN">
                    {t('enums:career.KNIGHT_OF_THE_BLAZING_SUN')}
                  </option>
                  <option value="MAGUS">{t('enums:career.MAGUS')}</option>
                  <option value="MARAUDER">{t('enums:career.MARAUDER')}</option>
                  <option value="RUNE_PRIEST">
                    {t('enums:career.RUNE_PRIEST')}
                  </option>
                  <option value="SHADOW_WARRIOR">
                    {t('enums:career.SHADOW_WARRIOR')}
                  </option>
                  <option value="SHAMAN">{t('enums:career.SHAMAN')}</option>
                  <option value="SLAYER">{t('enums:career.SLAYER')}</option>
                  <option value="SORCERER">{t('enums:career.SORCERER')}</option>
                  <option value="SQUIG_HERDER">
                    {t('enums:career.SQUIG_HERDER')}
                  </option>
                  <option value="SWORD_MASTER">
                    {t('enums:career.SWORD_MASTER')}
                  </option>
                  <option value="WARRIOR_PRIEST">
                    {t('enums:career.WARRIOR_PRIEST')}
                  </option>
                  <option value="WHITE_LION">
                    {t('enums:career.WHITE_LION')}
                  </option>
                  <option value="WITCH_ELF">
                    {t('enums:career.WITCH_ELF')}
                  </option>
                  <option value="WITCH_HUNTER">
                    {t('enums:career.WITCH_HUNTER')}
                  </option>
                  <option value="ZEALOT">{t('enums:career.ZEALOT')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table
          className={clsx(
            'table',
            'is-striped',
            'is-hoverable',
            isMobile ? 'is-narrow' : 'is-fullwidth',
          )}
        >
          <thead>
            <tr>
              <th aria-label="empty header" />
              <th>{t('pages:items.name')}</th>
              <th>{t('pages:items.itemType')}</th>
              <th>{t('pages:items.slot')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <ItemListEntry key={entry.id} item={entry} />
            ))}
          </tbody>
        </table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </div>
  );
}
