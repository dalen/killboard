import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import type { GetCharacterArmoryQuery } from '@/__generated__/graphql';
import { EquipSlot, ItemRarity, ItemType } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import {
  CharacterItem,
  EQUIPPED_ITEM_FRAGMENT,
} from '@/components/character/CharacterItem';
import type { ReactElement } from 'react';

const CHARACTER_ARMORY = gql`
  query GetCharacterArmory($id: ID!) {
    character(id: $id) {
      items {
        ...EquippedCharacterItem
      }
    }
  }

  ${EQUIPPED_ITEM_FRAGMENT}
`;

const NoItem = () => (
  <CharacterItem
    item={{
      abilities: [],
      armor: 0,
      buffs: [],
      careerRestriction: [],
      description: '',
      dps: 0,
      iconUrl: 'https://armory.returnofreckoning.com/icon/1',
      id: '0',
      itemLevel: 1,
      levelRequirement: 0,
      name: '',
      raceRestriction: [],
      rarity: ItemRarity.Utility,
      renownRankRequirement: 0,
      slot: EquipSlot.None,
      speed: 0,
      stats: [],
      talismanSlots: 0,
      type: ItemType.None,
      uniqueEquipped: false,
    }}
    talismans={[]}
    itemsEquipped={[]}
  />
);

export const CharacterArmory = ({ id }: { id: number }): ReactElement => {
  const { t } = useTranslation('components');
  const { loading, error, data } = useQuery<GetCharacterArmoryQuery>(
    CHARACTER_ARMORY,
    {
      variables: {
        id,
      },
    },
  );

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  if (data?.character === null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const character = data && data.character;
  const items = character ? character.items : [];

  const mainHand = items.find((item) => item.equipSlot === EquipSlot.MainHand);
  const offHand = items.find((item) => item.equipSlot === EquipSlot.OffHand);
  const ranged = items.find(
    (item) => item.equipSlot === EquipSlot.RangedWeapon,
  );

  const helm = items.find((item) => item.equipSlot === EquipSlot.Helm);
  const shoulder = items.find((item) => item.equipSlot === EquipSlot.Shoulder);
  const boots = items.find((item) => item.equipSlot === EquipSlot.Boots);
  const body = items.find((item) => item.equipSlot === EquipSlot.Body);
  const back = items.find((item) => item.equipSlot === EquipSlot.Back);
  const belt = items.find((item) => item.equipSlot === EquipSlot.Belt);
  const gloves = items.find((item) => item.equipSlot === EquipSlot.Gloves);

  const jewellery1 = items.find(
    (item) => item.equipSlot === EquipSlot.Jewellery1,
  );
  const jewellery2 = items.find(
    (item) => item.equipSlot === EquipSlot.Jewellery2,
  );
  const jewellery3 = items.find(
    (item) => item.equipSlot === EquipSlot.Jewellery3,
  );
  const jewellery4 = items.find(
    (item) => item.equipSlot === EquipSlot.Jewellery4,
  );

  const event = items.find((item) => item.equipSlot === EquipSlot.Event);
  const pocket1 = items.find((item) => item.equipSlot === EquipSlot.Pocket1);
  const pocket2 = items.find((item) => item.equipSlot === EquipSlot.Pocket2);

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
};
