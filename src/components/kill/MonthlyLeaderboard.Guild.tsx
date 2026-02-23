import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import type { Query } from '@/__generated__/graphql';
import { LeaderboardGuildTable } from '@/components/kill/LeaderboardGuildTable';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import type { ReactElement } from 'react';

const MONTHLY_GUILD_LEADERBOARD = gql`
  query GetMonthlyGuildLeaderboard($year: Int!, $month: Int!) {
    monthlyGuildKillLeaderboard(year: $year, month: $month) {
      guild {
        id
        name
        realm
        heraldry {
          emblem
          pattern
          color1
          color2
          shape
        }
      }
      rank
      kills
    }
  }
`;

export const MonthlyGuildLeaderboard = (): ReactElement => {
  const { t } = useTranslation(['common', 'components']);

  const month = new Date().getUTCMonth() + 1;
  const year = new Date().getUTCFullYear();

  const { loading, error, data } = useQuery<Query>(MONTHLY_GUILD_LEADERBOARD, {
    variables: { month, year },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.monthlyGuildKillLeaderboard == null) {
    return <p>{t('common:error')}</p>;
  }

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        {t('components:leaderboardGuild.monthlyTitle')}
      </div>
      <LeaderboardGuildTable
        data={data.monthlyGuildKillLeaderboard.slice(0, 10)}
      />
    </div>
  );
};
