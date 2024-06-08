import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Progress } from 'react-bulma-components';
import { Query } from '../types';
import { LeaderboardTable } from './LeaderboardTable';
import { ErrorMessage } from './global/ErrorMessage';

const MONTHLY_LEADERBOARD = gql`
  query GetMonthlyLeaderboard($year: Int!, $month: Int!) {
    monthlyKillLeaderboard(year: $year, month: $month) {
      rank
      kills
      character {
        id
        name
        career
        level
        renownRank
        guildMembership {
          guild {
            id
            name
          }
        }
      }
    }
  }
`;

export function MonthlyLeaderboard(): JSX.Element {
  const { t } = useTranslation(['common', 'components']);

  const month = new Date().getUTCMonth() + 1;
  const year = new Date().getUTCFullYear();

  const { loading, error, data } = useQuery<Query>(MONTHLY_LEADERBOARD, {
    variables: { year, month },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.monthlyKillLeaderboard == null) return <p>{t('common:error')}</p>;

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        {t('components:leaderboard.monthlyTitle')}
      </div>
      <LeaderboardTable data={data.monthlyKillLeaderboard.slice(0, 10)} />
    </div>
  );
}
