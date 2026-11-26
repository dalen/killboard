import { Link, useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { GUILD_INFO_FRAGMENT, GuildInfo } from '@/components/guild/GuildInfo';
import { GuildFeud } from '@/components/guild/GuildFeud';
import './GuildFeudPage.scss';
import type {
  DateTimeOperationFilterInput,
  GetGuildFeudInfoQuery,
} from '../__generated__/graphql';
import type { ReactElement } from 'react';
import { useMemo } from 'react';

type GuildFeudInfoData = Pick<
  GetGuildFeudInfoQuery,
  'guild1' | 'guild2' | 'guild1kills' | 'guild2kills'
>;

interface GuildFeudInfoVariables {
  guildId1: string;
  guildId2: string;
  time?: DateTimeOperationFilterInput;
}

const PERIODS = ['7', '30', '90', 'all'] as const;

const GUILD_FEUD_INFO = gql`
  query GetGuildFeudInfo(
    $guildId1: ID!
    $guildId2: ID!
    $time: DateTimeOperationFilterInput
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
        killerGuildId: { eq: $guildId1 }
        victimGuildId: { eq: $guildId2 }
        time: $time
      }
    ) {
      totalCount
    }

    guild2kills: kills(
      first: 0
      where: {
        killerGuildId: { eq: $guildId2 }
        victimGuildId: { eq: $guildId1 }
        time: $time
      }
    ) {
      totalCount
    }
  }

  ${GUILD_INFO_FRAGMENT}
`;

export const GuildFeudPage = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);

  const { guildId1, guildId2 } = useParams();
  const [search, setSearch] = useSearchParams();
  const requestedPeriod = search.get('period') ?? '30';
  const period = PERIODS.includes(requestedPeriod as (typeof PERIODS)[number])
    ? requestedPeriod
    : '30';
  const time = useMemo(() => {
    if (period === 'all') {
      return undefined;
    }
    return {
      gte: new Date(
        Date.now() - Number(period) * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
  }, [period]);

  const { loading, error, data } = useQuery<
    GuildFeudInfoData,
    GuildFeudInfoVariables
  >(GUILD_FEUD_INFO, {
    variables: {
      guildId1: guildId1 ?? '',
      guildId2: guildId2 ?? '',
      time,
    },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  if (data?.guild1 == null || data?.guild2 == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

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
              })}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="columns is-desktop guild-feud-comparison">
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
          <div className="field mt-4">
            <label className="label" htmlFor="guild-feud-period">
              {t('pages:guildFeud.periodLabel')}
            </label>
            <div className="select is-fullwidth">
              <select
                id="guild-feud-period"
                value={period}
                onChange={(event) => {
                  const next = new URLSearchParams(search);
                  next.set('period', event.target.value);
                  setSearch(next);
                }}
              >
                <option value="7">
                  {t('pages:guildFeud.lastDays', { count: 7 })}
                </option>
                <option value="30">
                  {t('pages:guildFeud.lastDays', { count: 30 })}
                </option>
                <option value="90">
                  {t('pages:guildFeud.lastDays', { count: 90 })}
                </option>
                <option value="all">{t('pages:guildFeud.allTime')}</option>
              </select>
            </div>
          </div>
          <div className="container is-flex is-justify-content-center">
            <span className="has-text-weight-bold has-text-info">
              {data.guild1kills?.totalCount ?? 0}
            </span>
            <span className="mx-3">vs</span>{' '}
            <span className="has-text-weight-bold has-text-info">
              {data.guild2kills?.totalCount ?? 0}
            </span>
          </div>
        </div>
        <div className="column is-5">
          <GuildInfo guild={data.guild2} />
        </div>
      </div>
      <GuildFeud guild1={guildId1 || ''} guild2={guildId2 || ''} time={time} />
    </div>
  );
};
