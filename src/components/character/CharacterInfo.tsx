import { gql, useQuery } from '@apollo/client';
import { getUnixTime, startOfWeek } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Query } from '@/__generated__/graphql';
import { careerIcon } from '@/utils';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ReactElement } from 'react';

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

export function CharacterInfo({ id }: { id: number }): ReactElement {
  const { t } = useTranslation(['common', 'components', 'enums']);
  const { loading, error, data } = useQuery<Query>(CHARACTER_INFO, {
    variables: {
      id,
      startOfWeek: getUnixTime(startOfWeek(new Date(), { weekStartsOn: 1 })),
    },
  });

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.character == null)
    return <ErrorMessage customText={t('common:notFound')} />;

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
              <strong>{data.character.name}</strong>
            </a>
            <p>
              <span className="icon-text">
                <strong>{`${t('components:characterInfo.career')} `}</strong>
                <span className="icon">
                  <img
                    src={careerIcon(data.character.career)}
                    alt={t(`enums:career.${data.character.career}`) ?? ''}
                  />
                </span>
                <span>{t(`enums:career.${data.character.career}`)}</span>
              </span>
            </p>
            <p>
              <strong>{`${t('components:characterInfo.level')} `}</strong>
              {data.character.level}
            </p>
            <p>
              <strong>{`${t('components:characterInfo.renownRank')} `}</strong>
              {data.character.renownRank}
            </p>

            {data.character.guildMembership?.guild != null && (
              <p>
                <strong>{`${t('components:characterInfo.guild')} `}</strong>
                <Link to={`/guild/${data.character.guildMembership.guild.id}`}>
                  {data.character.guildMembership.guild.name}
                </Link>
              </p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
