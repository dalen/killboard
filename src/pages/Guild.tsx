import { gql, useQuery } from '@apollo/client';
import { Breadcrumb, Container, Progress, Tabs } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { GuildRecentDeaths } from '../components/GuildRecentDeaths';
import { GuildRecentKills } from '../components/GuildRecentKills';
import { Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { GuildMemberList } from '../components/GuildMemberList';
import { GuildInfo } from '../components/GuildInfo';
import { KillsFilters } from '../components/KillsFilters';

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
        totalCount
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
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

export const Guild = ({ tab }: { tab: 'kills' | 'members' }): JSX.Element => {
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
      <GuildInfo guild={data.guild} />
      <Tabs>
        <li className={tab === 'kills' ? 'is-active' : ''}>
          <Link to={`/guild/${id}`}>{t('pages:guildPage.kills')}</Link>
        </li>
        <li className={tab === 'members' ? 'is-active' : ''}>
          <Link to={`/guild/${id}/members`}>
            {t('pages:guildPage.members')}
          </Link>
        </li>
      </Tabs>
      {tab === 'kills' && (
        <div>
          <KillsFilters />
          <GuildRecentKills id={Number(id)} />
          <GuildRecentDeaths id={Number(id)} />
        </div>
      )}
      {tab === 'members' && <GuildMemberList id={id} />}
    </Container>
  );
};
