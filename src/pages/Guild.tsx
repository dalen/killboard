import { gql, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  Card,
  Container,
  Image,
  Progress,
  Media,
  Tabs,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { GuildRecentDeaths } from '../components/GuildRecentDeaths';
import { GuildRecentKills } from '../components/GuildRecentKills';
import { Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';

const GUILD_INFO = gql`
  query GetGuildInfo($id: ID!) {
    guild(id: $id) {
      name
      description
      briefDescription
      level
      realm
      leader {
        id
        name
        career
      }
      members {
        nodes {
          rank {
            name
          }
          character {
            id
            name
            career
          }
        }
      }
    }
  }
`;

export const Guild = (): JSX.Element => {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<Query>(GUILD_INFO, {
    variables: { id: Number(id) },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.guild == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <Container max breakpoint={'widescreen'} mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/guild/${id}`}>
            {t('pages:guildPage.guildId', { guildId: id })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Card mb={5}>
        <Card.Content>
          <Media>
            <Media.Item align={'left'}>
              <Image
                size={'128'}
                src={`/images/corner_icons/ea_icon_corner_guild.png`}
                alt="Guild"
              />
            </Media.Item>
            <Media.Item>
              <p className="is-size-4">
                <strong>{data.guild.name}</strong>
              </p>
              <p>
                <strong>{`${t('pages:guildPage.leader')} `}</strong>
                <Link to={`/character/${data.guild.leader.id}`}>
                  {data.guild.leader.name}
                </Link>
              </p>
              <p>
                <strong>{`${t('pages:guildPage.description')} `}</strong>
                {data.guild.description}
              </p>
            </Media.Item>
          </Media>
        </Card.Content>
      </Card>
      <Tabs>
        <Tabs.Tab active>{t('pages:guildPage.kills')}</Tabs.Tab>
        <Tabs.Tab>{t('pages:guildPage.members')}</Tabs.Tab>
      </Tabs>
      <GuildRecentKills id={Number(id)} />
      <GuildRecentDeaths id={Number(id)} />
    </Container>
  );
};
