import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import type { Query } from '@/__generated__/graphql';
import { careerIcon } from '@/utils';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { GuildLink } from '@/components/global/GuildLink';
import type { ReactElement } from 'react';

const CHARACTER_INFO = gql`
  query GetCharacterInfo($id: ID!) {
    character(id: $id) {
      name
      career
      level
      renownRank
      guildMembership {
        guild {
          id
          name
        }
      }
    }
  }
`;

export const CharacterIdentityHeader = ({
  id,
}: {
  id: number;
}): ReactElement => {
  const { t } = useTranslation(['common', 'components', 'enums', 'pages']);
  const { loading, error, data } = useQuery<Query>(CHARACTER_INFO, {
    variables: { id },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  if (data?.character == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  return (
    <section className="character-identity-card card" aria-label={t('pages:characterPage.characterIdentity')}>
      <img
        className="character-identity-emblem"
        src="/images/corner_icons/ea_icon_corner_character.png"
        alt=""
      />
      <div className="character-identity-main">
        <a className="character-identity-name" href={`https://www.returnofreckoning.com/armory/character/${id}`} target="_blank" rel="noopener noreferrer">
          {data.character.name}
        </a>
        <span className="character-identity-career">
          <img src={careerIcon(data.character.career)} alt="" />
          {t(`enums:career.${data.character.career}`)}
        </span>
      </div>
      <div className="character-identity-facts">
        <span><strong>{t('components:characterInfo.level')}</strong> {data.character.level}</span>
        <span><strong>{t('components:characterInfo.renownRank')}</strong> {data.character.renownRank}</span>
        {data.character.guildMembership?.guild && (
          <span className="character-identity-guild">
            <strong>{t('components:characterInfo.guild')}</strong>{' '}
            <GuildLink guild={data.character.guildMembership.guild} />
          </span>
        )}
      </div>
    </section>
  );
};
