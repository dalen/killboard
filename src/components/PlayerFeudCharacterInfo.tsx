import { Card, Icon, Media, Image } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Character } from '../types';
import { careerIcon } from '../utils';

export const PlayerFeudCharacterInfo = ({
  character,
  id,
}: {
  character: Character;
  id: string | number;
}): JSX.Element => {
  const { t } = useTranslation(['common', 'components', 'enums']);

  return (
    <Card mb={5}>
      <Card.Content>
        <Media>
          <Media.Item align={'left'}>
            <Image
              size={'128'}
              src={`/images/corner_icons/ea_icon_corner_character.png`}
              alt="Character"
            />
          </Media.Item>
          <Media.Item>
            <a
              className="is-size-4"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.returnofreckoning.com/armory/character/${id}`}
            >
              <strong>{character.name}</strong>
            </a>
            <p>
              <Icon.Text>
                <strong>{`${t('components:characterInfo.career')} `}</strong>
                <Icon>
                  <img
                    src={careerIcon(character.career)}
                    alt={t(`enums:career.${character.career}`) ?? ''}
                  />
                </Icon>
                <span>{t(`enums:career.${character.career}`)}</span>
              </Icon.Text>
            </p>
            <p>
              <strong>{`${t('components:characterInfo.level')} `}</strong>
              {character.level}
            </p>
            <p>
              <strong>{`${t('components:characterInfo.renownRank')} `}</strong>
              {character.renownRank}
            </p>
            {character.guildMembership?.guild != null && (
              <p>
                <strong>{`${t('components:characterInfo.guild')} `}</strong>
                <Link to={`/guild/${character.guildMembership.guild.id}`}>
                  {character.guildMembership.guild.name}
                </Link>
              </p>
            )}
          </Media.Item>
        </Media>
      </Card.Content>
    </Card>
  );
};
