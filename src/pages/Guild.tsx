import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { GuildRecentDeaths } from '../components/GuildRecentDeaths';
import { GuildRecentKills } from '../components/GuildRecentKills';
import { Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { GuildMemberList } from '../components/GuildMemberList';
import { GuildInfo } from '../components/GuildInfo';
import { KillsFilters } from '../components/KillsFilters';
import { ScenarioList } from '../components/ScenarioList';
import { ScenarioFilters } from '../components/ScenarioFilters';
import { ScenarioCount } from '../components/ScenarioCount';
import { GuildLatestSkirmishes } from '../components/GuildLatestSkirmishes';
import { ReactElement } from 'react';

const GUILD_INFO = gql`
  query GetGuildInfo($id: ID!) {
    guild(id: $id) {
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
`;

export function Guild({
  tab,
}: {
  tab: 'kills' | 'members' | 'scenarios' | 'skirmishes';
}): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<Query>(GUILD_INFO, {
    variables: { id: Number(id) },
  });

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.guild == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
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
      <div className="tabs">
        <li className={tab === 'kills' ? 'is-active' : ''}>
          <Link to={`/guild/${id}`}>{t('pages:guildPage.kills')}</Link>
        </li>
        <li className={tab === 'members' ? 'is-active' : ''}>
          <Link to={`/guild/${id}/members`}>
            {t('pages:guildPage.members')}
          </Link>
        </li>
        <li className={tab === 'scenarios' ? 'is-active' : ''}>
          <Link to={`/guild/${id}/scenarios`}>
            {t('pages:guildPage.scenarios')}
          </Link>
        </li>
        <li className={tab === 'skirmishes' ? 'is-active' : ''}>
          <Link to={`/guild/${id}/skirmishes`}>
            {t('pages:guildPage.skirmishes')}
          </Link>
        </li>
      </div>
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
}
