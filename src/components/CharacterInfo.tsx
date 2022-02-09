import { gql, useQuery } from '@apollo/client';
import {
  Progress,
  Notification,
  Card,
  Icon,
  Media,
  Image,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Query } from '../types';
import { careerIcon } from '../utils';
import { ErrorMessage } from './global/ErrorMessage';

// Temporary way of fetching this until new API version is deployed
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

export const CharacterInfo = ({ id }: { id: number }): JSX.Element => {
  const { t } = useTranslation(['common', 'components']);
  const { loading, error, data } = useQuery<Query>(CHARACTER_INFO, {
    variables: { id },
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
            <p className="is-size-4">
              <strong>{data.character.name}</strong>
            </p>
            <p>
              <Icon.Text>
                <strong>{`${t('components:characterInfo.career')} `}</strong>
                <Icon>
                  <img
                    src={careerIcon(data.character.career)}
                    alt={data.character.career}
                  />
                </Icon>
                <span>{data.character.career}</span>
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
