import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { GUILD_INFO_FRAGMENT, GuildInfo } from '@/components/guild/GuildInfo';
import { GuildFeud } from '@/components/guild/GuildFeud';
import {
  GetGuildFeudInfoQuery,
  GetGuildFeudInfoQueryVariables,
} from '../__generated__/graphql';
import { ReactElement } from 'react';

const GUILD_FEUD_INFO = gql`
  query GetGuildFeudInfo(
    $guildId1: ID!
    $guildInt1: UnsignedInt!
    $guildId2: ID!
    $guildInt2: UnsignedInt!
  ) {
    guild1: guild(id: $guildId1) {
      ...GuildInfo
    }

    guild2: guild(id: $guildId2) {
      ...GuildInfo
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

  ${GUILD_INFO_FRAGMENT}
`;

export function GuildFeudPage(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);

  const { guildId1, guildId2 } = useParams();

  const { loading, error, data } = useQuery<
    GetGuildFeudInfoQuery,
    GetGuildFeudInfoQueryVariables
  >(GUILD_FEUD_INFO, {
    variables: {
      guildId1: guildId1 ?? '',
      guildInt1: Number(guildId1),
      guildId2: guildId2 ?? '',
      guildInt2: Number(guildId2),
    },
  });

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.guild1 == null || data?.guild2 == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/guild/${guildId1}/feud/${guildId2}`}>
              {t('pages:guildFeud.guildFeudId', {
                guildId1,
                guildId2,
                guildInt1: Number(guildId1),
                guildInt2: Number(guildId2),
              })}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="columns is-desktop">
        <div className="column is-5">
          <GuildInfo guild={data.guild1} />
        </div>
        <div className="column">
          <div className="container is-flex is-justify-content-center">
            <figure className="image is-128x128 mt-2">
              <img
                src="/images/corner_icons/swordhammer.png"
                alt="Guild Feud"
              />
            </figure>
          </div>
          <div className="container is-flex is-justify-content-center">
            <span className="has-text-weight-bold has-text-info">
              {data.guild1kills?.totalCount}
            </span>
            <span className="mx-3">vs</span>{' '}
            <span className="has-text-weight-bold has-text-info">
              {data.guild2kills?.totalCount}
            </span>
          </div>
        </div>
        <div className="column is-5">
          <GuildInfo guild={data.guild2} />
        </div>
      </div>
      <GuildFeud guild1={guildId1 || ''} guild2={guildId2 || ''} />
    </div>
  );
}
