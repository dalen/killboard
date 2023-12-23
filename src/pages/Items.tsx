import { gql, useQuery } from '@apollo/client';
import {
  Container,
  Progress,
  Table,
  Breadcrumb,
  Button,
  Card,
  Columns,
  Form,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchBox } from '../components/SearchBox';
import { ItemFilterInput, ItemType, Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { ItemListEntry } from '../components/ItemListEntry';

const SEARCH_ITEMS = gql`
  query SearchItems(
    $query: ItemFilterInput
    $usableByCareer: Career
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    items(
      where: $query
      usableByCareer: $usableByCareer
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        id
        iconUrl
        name
        careerRestriction
        description
        type
        slot
        rarity
        armor
        dps
        speed
        levelRequirement
        renownRankRequirement
        itemLevel
        talismanSlots
        itemSet {
          id
          name
          items {
            id
          }
          bonuses {
            itemsRequired
            bonus {
              ... on Ability {
                description
                __typename
              }
              ... on ItemStat {
                stat
                value
                percentage
                __typename
              }
            }
          }
        }
        buffs {
          id
          description
        }
        stats {
          stat
          value
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
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

export function Items(): JSX.Element {
  const perPage = 15;
  const [search, setSearch] = useSearchParams();
  const { t } = useTranslation(['common', 'pages']);
  const { loading, error, data, refetch } = useQuery<Query>(SEARCH_ITEMS, {
    variables: {
      query: getItemsFilters(search),
      ...usableByCareerFilter(search),
      first: perPage,
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.items?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const entries = data.items.nodes;
  const { pageInfo } = data.items;

  return (
    <Container max breakpoint="desktop" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/items">{t('pages:items.title')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Card mb={5}>
        <Card.Content>
          <Columns>
            <Columns.Column>
              <Form.Field>
                <Form.Label>{t('pages:items.search')}</Form.Label>
                <SearchBox
                  initialQuery={search.get('query') || ''}
                  onSubmit={(event) => {
                    search.set('query', event);
                    setSearch(search);
                  }}
                />
              </Form.Field>
            </Columns.Column>
            <Columns.Column>
              <Form.Field>
                <Form.Label>{t('pages:items.itemType')}</Form.Label>
                <Form.Select
                  value={search.get('type')}
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
                </Form.Select>
              </Form.Field>
            </Columns.Column>
            <Columns.Column>
              <Form.Field>
                <Form.Label>{t('pages:items.usableByCareer')}</Form.Label>
                <Form.Select
                  value={search.get('career')}
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
                </Form.Select>
              </Form.Field>
            </Columns.Column>
          </Columns>
        </Card.Content>
      </Card>
      <div className="table-container">
        <Table striped hoverable size={isMobile ? 'narrow' : 'fullwidth'}>
          <thead>
            <tr>
              <th aria-label="empty header" />
              <th>{t('pages:items.name')}</th>
              <th>{t('pages:items.slot')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <ItemListEntry key={entry.id} item={entry} />
            ))}
          </tbody>
        </Table>
      </div>
      {pageInfo && (
        <div className="field is-grouped is-pulled-right">
          {pageInfo.hasPreviousPage && (
            <Button
              color="info"
              size="small"
              onClick={() => {
                refetch({
                  first: undefined,
                  after: undefined,
                  last: perPage,
                  before: pageInfo.startCursor,
                });
              }}
            >
              {t('common:prevPage')}
              <i className="fas fa-circle-chevron-left ml-1" />
            </Button>
          )}
          {pageInfo.hasNextPage && (
            <Button
              color="info"
              size="small"
              onClick={() => {
                refetch({
                  first: perPage,
                  after: pageInfo.endCursor,
                  last: undefined,
                  before: undefined,
                });
              }}
            >
              {t('common:nextPage')}
              <i className="fas fa-circle-chevron-right ml-1" />
            </Button>
          )}
        </div>
      )}
    </Container>
  );
}
