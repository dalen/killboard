import {
  Breadcrumb,
  Columns,
  Container,
  Image,
  Progress,
} from 'react-bulma-components';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { Guild, KillsConnection } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { GuildInfo } from '../components/GuildInfo';
import { GuildFeud } from '../components/GuildFeud';

const GUILD_FEUD_INFO = gql`
  query GetGuildFeudInfo($guildId1: ID!, $guildId2: ID!) {
    guild1: guild(id: $guildId1) {
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
      }
    }

    guild2: guild(id: $guildId2) {
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
      }
    }

    guild1kills: kills(
      first: 0
      where: {
        killerGuildId: { eq: $guildId1 }
        victimGuildId: { eq: $guildId2 }
      }
    ) {
      totalCount
    }

    guild2kills: kills(
      first: 0
      where: {
        killerGuildId: { eq: $guildId2 }
        victimGuildId: { eq: $guildId1 }
      }
    ) {
      totalCount
    }
  }
`;

export function GuildFeudPage(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);

  const { guildId1, guildId2 } = useParams();

  const { loading, error, data } = useQuery<{
    guild1: Guild;
    guild1kills: KillsConnection;
    guild2: Guild;
    guild2kills: KillsConnection;
  }>(GUILD_FEUD_INFO, {
    variables: { guildId1, guildId2 },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.guild1 == null || data?.guild2 == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/guild/${guildId1}/feud/${guildId2}`}>
            {t('pages:guildFeud.guildFeudId', { guildId1, guildId2 })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Columns breakpoint="desktop">
        <Columns.Column size={5}>
          <GuildInfo guild={data.guild1} />
        </Columns.Column>
        <Columns.Column>
          <Container justifyContent="center" className="is-flex">
            <Image
              src="/images/corner_icons/swordhammer.png"
              size={128}
              mt={2}
            />
          </Container>
          <Container justifyContent="center" className="is-flex" textSize={5}>
            <span className="has-text-weight-bold has-text-info">
              {data.guild1kills.totalCount}
            </span>
            <span className="mx-3">vs</span>{' '}
            <span className="has-text-weight-bold has-text-info">
              {data.guild2kills.totalCount}
            </span>
          </Container>
        </Columns.Column>
        <Columns.Column size={5}>
          <GuildInfo guild={data.guild2} />
        </Columns.Column>
      </Columns>
      <GuildFeud guild1={guildId1 || ''} guild2={guildId2 || ''} />
    </Container>
  );
}
