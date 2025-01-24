import {
  Breadcrumb,
  Columns,
  Container,
  Image,
  Progress,
} from 'react-bulma-components';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { GuildInfo } from '../components/GuildInfo';
import { GuildFeud } from '../components/GuildFeud';
import {
  GetGuildFeudInfoQuery,
  GetGuildFeudInfoQueryVariables,
} from '../__generated__/graphql';

const GUILD_FEUD_INFO = gql`
  query GetGuildFeudInfo(
    $guildId1: ID!
    $guildInt1: UnsignedInt!
    $guildId2: ID!
    $guildInt2: UnsignedInt!
  ) {
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
        killerGuildId: { eq: $guildInt1 }
        victimGuildId: { eq: $guildInt2 }
      }
    ) {
      totalCount
    }

    guild2kills: kills(
      first: 0
      where: {
        killerGuildId: { eq: $guildInt2 }
        victimGuildId: { eq: $guildInt1 }
      }
    ) {
      totalCount
    }
  }
`;

export function GuildFeudPage(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);

  const { guildId1, guildId2 } = useParams();

  const { loading, error, data } = useQuery<
    GetGuildFeudInfoQuery,
    GetGuildFeudInfoQueryVariables
  >(GUILD_FEUD_INFO, {
    variables: {
      guildId1: guildId1 ?? '',
      guildInt1: guildId1,
      guildId2: guildId2 ?? '',
      guildInt2: guildId2,
    },
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
              {data.guild1kills?.totalCount}
            </span>
            <span className="mx-3">vs</span>{' '}
            <span className="has-text-weight-bold has-text-info">
              {data.guild2kills?.totalCount}
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
