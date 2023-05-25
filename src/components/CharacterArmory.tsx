import { gql, useQuery } from '@apollo/client';
import { Query } from '../types';
import { useTranslation } from 'react-i18next';
import { Progress, Card, Icon, Media, Image } from 'react-bulma-components';
import { ErrorMessage } from './global/ErrorMessage';
import { CharacterItem } from './CharacterItem';

const CHARACTER_INFO = gql`
  query GetCharacterInfo($id: ID!) {
    character(id: $id) {
      items {
        equipSlot
        item {
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
        }
      }
    }
  }
`;

export const CharacterArmory = ({ id }: { id: number }): JSX.Element => {
  const { t } = useTranslation('components');
  const { loading, error, data } = useQuery<Query>(CHARACTER_INFO, {
    variables: {
      id,
    },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.character == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const items = data.character.items;

  const mainHand = items.find((item) => item.equipSlot == 'MAIN_HAND');
  const offHand = items.find((item) => item.equipSlot == 'OFF_HAND');
  const ranged = items.find((item) => item.equipSlot == 'RANGED_WEAPON');

  const helm = items.find((item) => item.equipSlot == 'HELM');
  const shoulder = items.find((item) => item.equipSlot == 'SHOULDER');
  const boots = items.find((item) => item.equipSlot == 'BOOTS');
  const body = items.find((item) => item.equipSlot == 'BODY');
  const back = items.find((item) => item.equipSlot == 'BACK');
  const belt = items.find((item) => item.equipSlot == 'BELT');
  const gloves = items.find((item) => item.equipSlot == 'GLOVES');

  const jewellery_1 = items.find((item) => item.equipSlot == 'JEWELLERY_1');
  const jewellery_2 = items.find((item) => item.equipSlot == 'JEWELLERY_2');
  const jewellery_3 = items.find((item) => item.equipSlot == 'JEWELLERY_3');
  const jewellery_4 = items.find((item) => item.equipSlot == 'JEWELLERY_4');

  const event = items.find((item) => item.equipSlot == 'EVENT');
  const pocket1 = items.find((item) => item.equipSlot == 'POCKET_1');
  const pocket2 = items.find((item) => item.equipSlot == 'POCKET_2');

  const NoItem = () => {
    return (
      <CharacterItem
        item={{
          name: '',
          itemLevel: 1,
          iconUrl: 'https://armory.returnofreckoning.com/icon/1',
          rarity: 'EMPTY',
          slot: '',
          type: '',
          stats: [],
          renownRankRequirement: 0,
          levelRequirement: 0,
          armor: 0,
          careerRestriction: [],
        }}
      />
    );
  };

  return (
    <div className="columns pl-3" style={{ marginBottom: '150px' }}>
      <div className="column">
        <div className="content">
          <strong className="mb-2">{`Armor`}</strong>
          {helm ? <CharacterItem item={helm.item} /> : <NoItem />}
          {shoulder ? <CharacterItem item={shoulder.item} /> : <NoItem />}
          {back ? <CharacterItem item={back.item} /> : <NoItem />}
          {body ? <CharacterItem item={body.item} /> : <NoItem />}
          {gloves ? <CharacterItem item={gloves.item} /> : <NoItem />}
          {belt ? <CharacterItem item={belt.item} /> : <NoItem />}
          {boots ? <CharacterItem item={boots.item} /> : <NoItem />}
        </div>
      </div>
      <div className="column">
        <div className="mb-5">
          <strong className="mb-2">{`Weapons`}</strong>
          {mainHand ? <CharacterItem item={mainHand.item} /> : <NoItem />}
          {offHand && <CharacterItem item={offHand.item} />}
          {ranged && <CharacterItem item={ranged.item} />}
        </div>
        <div className="mb-5">
          <strong className="mb-2">{`Event Item`}</strong>
          {event ? <CharacterItem item={event.item} /> : <NoItem />}
        </div>
        <div className="mb-5">
          <strong className="mb-2">{`Pocket`}</strong>
          {pocket1 ? <CharacterItem item={pocket1.item} /> : <NoItem />}
          {pocket2 ? <CharacterItem item={pocket2.item} /> : <NoItem />}
        </div>
      </div>
      <div className="column">
        <strong className="mb-2">{`Jewellery`}</strong>
        {jewellery_1 ? <CharacterItem item={jewellery_1.item} /> : <NoItem />}
        {jewellery_2 ? <CharacterItem item={jewellery_2.item} /> : <NoItem />}
        {jewellery_3 ? <CharacterItem item={jewellery_3.item} /> : <NoItem />}
        {jewellery_4 ? <CharacterItem item={jewellery_4.item} /> : <NoItem />}
      </div>
    </div>
  );
};
