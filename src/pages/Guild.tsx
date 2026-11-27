import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { GuildRecentDeaths } from '@/components/guild/GuildRecentDeaths';
import { GuildRecentKills } from '@/components/guild/GuildRecentKills';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { GuildMemberList } from '@/components/guild/GuildMemberList';
import { GUILD_INFO_FRAGMENT, GuildInfo } from '@/components/guild/GuildInfo';
import { KillsFilters } from '@/components/kill/KillsFilters';
import { ScenarioList } from '@/components/scenario/ScenarioList';
import { ScenarioFilters } from '@/components/scenario/ScenarioFilters';
import { ScenarioCount } from '@/components/scenario/ScenarioCount';
import { GuildLatestSkirmishes } from '@/components/guild/GuildLatestSkirmishes';
import { GuildOverview } from '@/components/guild/GuildOverview';
import type { ReactElement } from 'react';
import type { GetGuildInfoQuery } from '@/__generated__/graphql';

const GUILD_INFO = gql`
  query GetGuildInfo($id: ID!) {
    guild(id: $id) {
      ...GuildInfo
      name
      description
      briefDescription
      level
      realm
      heraldry {
        emblem
        pattern
        color1
        color2
        shape
      }
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

  ${GUILD_INFO_FRAGMENT}
`;

export const Guild = ({
  tab,
}: {
  tab: 'overview' | 'kills' | 'members' | 'scenarios' | 'skirmishes';
}): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<GetGuildInfoQuery>(GUILD_INFO, {
    variables: { id: Number(id) },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.guild == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  return (
    <div className="container is-max-widescreen guild-profile-page">
      <nav className="breadcrumb character-breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/guild/${id}`}>
              {t('pages:guildPage.guildId', { guildId: id })}
            </Link>
          </li>
        </ul>
      </nav>
      <GuildInfo guild={data.guild} />
      <div className="tabs guild-tabs warhammer-profile-tabs">
        <ul>
          <li className={tab === 'overview' ? 'is-active' : ''}>
            <Link to={`/guild/${id}`}><span className="warhammer-tab-label">{t('pages:guildPage.overview')}</span></Link>
          </li>
          <li className={tab === 'kills' ? 'is-active' : ''}>
            <Link to={`/guild/${id}/kills`}><span className="warhammer-tab-label">{t('pages:guildPage.kills')}</span></Link>
          </li>
          <li className={tab === 'members' ? 'is-active' : ''}>
            <Link to={`/guild/${id}/members`}>
              <span className="warhammer-tab-label">
              {t('pages:guildPage.members')}
              </span>
            </Link>
          </li>
          <li className={tab === 'scenarios' ? 'is-active' : ''}>
            <Link to={`/guild/${id}/scenarios`}>
              <span className="warhammer-tab-label">
              {t('pages:guildPage.scenarios')}
              </span>
            </Link>
          </li>
          <li className={tab === 'skirmishes' ? 'is-active' : ''}>
            <Link to={`/guild/${id}/skirmishes`}>
              <span className="warhammer-tab-label">
              {t('pages:guildPage.skirmishes')}
              </span>
            </Link>
          </li>
        </ul>
      </div>
      {tab === 'overview' && (
        <GuildOverview id={Number(id)} realm={data.guild.realm} />
      )}
      {tab === 'kills' && (
        <div>
          <KillsFilters />
          <GuildRecentKills id={Number(id)} />
          <GuildRecentDeaths id={Number(id)} />
        </div>
      )}
      {tab === 'members' && <GuildMemberList id={id} />}
      {tab === 'scenarios' && (
        <div>
          <ScenarioFilters showPremadeOnly />
          <div className="columns is-desktop">
            <div className="column">
              <ScenarioCount guildId={id} wins title="Wins" />
            </div>
            <div className="column">
              <ScenarioCount guildId={id} wins={false} title="Losses" />
            </div>
          </div>
          <ScenarioList guildId={id} />
        </div>
      )}
      {tab === 'skirmishes' && <GuildLatestSkirmishes guildId={id} />}
    </div>
  );
};
