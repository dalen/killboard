import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Progress } from 'react-bulma-components';
import { EquipSlot, ItemRarity, ItemType, Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { CharacterItem } from './CharacterItem';

const CHARACTER_ARMORY = gql`
  query GetCharacterArmory($id: ID!) {
    character(id: $id) {
      items {
        equipSlot
        talismans {
          name
          rarity
          iconUrl
          stats {
            stat
            value
          }
          buffs {
            id
            description
          }
        }
        item {
          id
          name
          careerRestriction
          description
          rarity
          itemLevel
          iconUrl
          stats {
            stat
            value
          }
          type
          levelRequirement
          renownRankRequirement
          slot
          armor
          careerRestriction
          talismanSlots
          speed
          dps
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
        }
      }
    }
  }
`;

function NoItem() {
  return (
    <CharacterItem
      item={{
        name: '',
        description: '',
        dps: 0,
        id: '0',
        raceRestriction: [],
        uniqueEquipped: false,
        speed: 0,
        talismanSlots: 0,
        itemLevel: 1,
        iconUrl: 'https://armory.returnofreckoning.com/icon/1',
        rarity: ItemRarity.Utility,
        slot: EquipSlot.None,
        type: ItemType.None,
        stats: [],
        renownRankRequirement: 0,
        levelRequirement: 0,
        armor: 0,
        careerRestriction: [],
        buffs: [],
      }}
      talismans={[]}
      itemsEquipped={[]}
    />
  );
}

export function CharacterArmory({ id }: { id: number }): JSX.Element {
  const { t } = useTranslation('components');
  const { loading, error, data } = useQuery<Query>(CHARACTER_ARMORY, {
    variables: {
      id,
    },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.character === null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const character = data && data.character;
  const items = character ? character.items : [];

  const mainHand = items.find((item) => item.equipSlot === 'MAIN_HAND');
  const offHand = items.find((item) => item.equipSlot === 'OFF_HAND');
  const ranged = items.find((item) => item.equipSlot === 'RANGED_WEAPON');

  const helm = items.find((item) => item.equipSlot === 'HELM');
  const shoulder = items.find((item) => item.equipSlot === 'SHOULDER');
  const boots = items.find((item) => item.equipSlot === 'BOOTS');
  const body = items.find((item) => item.equipSlot === 'BODY');
  const back = items.find((item) => item.equipSlot === 'BACK');
  const belt = items.find((item) => item.equipSlot === 'BELT');
  const gloves = items.find((item) => item.equipSlot === 'GLOVES');

  const jewellery1 = items.find((item) => item.equipSlot === 'JEWELLERY_1');
  const jewellery2 = items.find((item) => item.equipSlot === 'JEWELLERY_2');
  const jewellery3 = items.find((item) => item.equipSlot === 'JEWELLERY_3');
  const jewellery4 = items.find((item) => item.equipSlot === 'JEWELLERY_4');

  const event = items.find((item) => item.equipSlot === 'EVENT');
  const pocket1 = items.find((item) => item.equipSlot === 'POCKET_1');
  const pocket2 = items.find((item) => item.equipSlot === 'POCKET_2');

  return (
    <div className="columns pl-3" style={{ marginBottom: '250px' }}>
      <div className="column">
        <div className="content">
          <strong className="mb-2">Armor</strong>
          {helm ? (
            <CharacterItem
              item={helm.item}
              talismans={helm.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
          {shoulder ? (
            <CharacterItem
              item={shoulder.item}
              talismans={shoulder.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
          {back ? (
            <CharacterItem
              item={back.item}
              talismans={back.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
          {body ? (
            <CharacterItem
              item={body.item}
              talismans={body.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
          {gloves ? (
            <CharacterItem
              item={gloves.item}
              talismans={gloves.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
          {belt ? (
            <CharacterItem
              item={belt.item}
              talismans={belt.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
          {boots ? (
            <CharacterItem
              item={boots.item}
              talismans={boots.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
        </div>
      </div>
      <div className="column">
        <div className="mb-5">
          <strong className="mb-2">Weapons</strong>
          {mainHand ? (
            <CharacterItem
              item={mainHand.item}
              talismans={mainHand.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
          {offHand && (
            <CharacterItem
              item={offHand.item}
              talismans={offHand.talismans}
              itemsEquipped={items}
            />
          )}
          {ranged && (
            <CharacterItem
              item={ranged.item}
              talismans={ranged.talismans}
              itemsEquipped={items}
            />
          )}
        </div>
        <div className="mb-5">
          <strong className="mb-2">Event Item</strong>
          {event ? (
            <CharacterItem
              item={event.item}
              talismans={event.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
        </div>
        <div className="mb-5">
          <strong className="mb-2">Pocket</strong>
          {pocket1 ? (
            <CharacterItem
              item={pocket1.item}
              talismans={pocket1.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
          {pocket2 ? (
            <CharacterItem
              item={pocket2.item}
              talismans={pocket2.talismans}
              itemsEquipped={items}
            />
          ) : (
            <NoItem />
          )}
        </div>
      </div>
      <div className="column">
        <strong className="mb-2">Jewellery</strong>
        {jewellery1 ? (
          <CharacterItem
            item={jewellery1.item}
            talismans={jewellery1.talismans}
            itemsEquipped={items}
          />
        ) : (
          <NoItem />
        )}
        {jewellery2 ? (
          <CharacterItem
            item={jewellery2.item}
            talismans={jewellery2.talismans}
            itemsEquipped={items}
          />
        ) : (
          <NoItem />
        )}
        {jewellery3 ? (
          <CharacterItem
            item={jewellery3.item}
            talismans={jewellery3.talismans}
            itemsEquipped={items}
          />
        ) : (
          <NoItem />
        )}
        {jewellery4 ? (
          <CharacterItem
            item={jewellery4.item}
            talismans={jewellery4.talismans}
            itemsEquipped={items}
          />
        ) : (
          <NoItem />
        )}
      </div>
    </div>
  );
}
