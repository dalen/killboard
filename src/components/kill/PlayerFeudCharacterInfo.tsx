import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Character } from '@/__generated__/graphql';
import { careerIcon } from '@/utils';
import { ReactElement } from 'react';

export function PlayerFeudCharacterInfo({
  character,
  id,
}: {
  character: Character;
  id: string | number;
}): ReactElement {
  const { t } = useTranslation(['common', 'components', 'enums']);

  return (
    <div className="card mb-5">
      <div className="card-content">
        <article className="media">
          <figure className="media-left">
            <figure className="image is-128x128">
              <img
                src="/images/corner_icons/ea_icon_corner_character.png"
                alt="Character"
              />
            </figure>
          </figure>
          <div className="media-content">
            <a
              className="is-size-4"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.returnofreckoning.com/armory/character/${id}`}
            >
              <strong>{character.name}</strong>
            </a>
            <p>
              <span className="icon-text">
                <strong>{`${t('components:characterInfo.career')} `}</strong>
                <span className="icon">
                  <img
                    src={careerIcon(character.career)}
                    alt={t(`enums:career.${character.career}`) ?? ''}
                  />
                </span>
                <span>{t(`enums:career.${character.career}`)}</span>
              </span>
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
          </div>
        </article>
      </div>
    </div>
  );
}
