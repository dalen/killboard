import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Progress } from 'react-bulma-components';
import { Query } from '../types';
import { LeaderboardGuildTable } from './LeaderboardGuildTable';
import { ErrorMessage } from './global/ErrorMessage';

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

export function MonthlyGuildLeaderboard(): JSX.Element {
  const { t } = useTranslation(['common', 'components']);

  const month = new Date().getUTCMonth() + 1;
  const year = new Date().getUTCFullYear();

  const { loading, error, data } = useQuery<Query>(MONTHLY_GUILD_LEADERBOARD, {
    variables: { year, month },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.monthlyGuildKillLeaderboard == null)
    return <p>{t('common:error')}</p>;

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
}
