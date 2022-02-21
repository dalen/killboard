import { gql, useQuery } from '@apollo/client';
import { getUnixTime, startOfWeek } from 'date-fns/esm';
import { Progress, Card, Icon, Media, Image } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { KillsConnection, Query } from '../types';
import { careerIcon } from '../utils';
import { ErrorMessage } from './global/ErrorMessage';

const CHARACTER_INFO = gql`
  query GetCharacterInfo($id: ID!, $startOfWeek: Long!) {
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

    killsThisWeek: kills(killerId: $id, from: $startOfWeek, first: 0) {
      totalCount
    }

    deathsThisWeek: kills(victimId: $id, from: $startOfWeek, first: 0) {
      totalCount
    }
  }
`;

export const CharacterInfo = ({ id }: { id: number }): JSX.Element => {
  const { t } = useTranslation(['common', 'components', 'enums']);
  const { loading, error, data } = useQuery<
    Query & { killsThisWeek: KillsConnection; deathsThisWeek: KillsConnection }
  >(CHARACTER_INFO, {
    variables: {
      id,
      startOfWeek: getUnixTime(startOfWeek(new Date(), { weekStartsOn: 1 })),
    },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.character == null)
    return <ErrorMessage customText={t('common:notFound')} />;

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
              <strong>{data.character.name}</strong>
            </a>
            <p>
              <Icon.Text>
                <strong>{`${t('components:characterInfo.career')} `}</strong>
                <Icon>
                  <img
                    src={careerIcon(data.character.career)}
                    alt={t(`enums:career.${data.character.career}`)}
                  />
                </Icon>
                <span>{t(`enums:career.${data.character.career}`)}</span>
              </Icon.Text>
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
          </Media.Item>
        </Media>
      </Card.Content>
    </Card>
  );
};
