import getISOWeekYear from 'date-fns/getISOWeekYear';
import getISOWeek from 'date-fns/getISOWeek';
import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Query } from '../types';
import { LeaderboardGuildTable } from './LeaderboardGuildTable';
import { Progress } from 'react-bulma-components';
import { ErrorMessage } from './global/ErrorMessage';

const WEEKLY_LEADERBOARD_GUILD = gql`
  query GetWeeklyGuildLeaderboard($year: Int!, $week: ID!) {
    weeklyGuildKillLeaderboard(year: $year, week: $week) {
      guild {
        id
        name
      }
      rank
      kills
      deaths
    }
  }
`;

export const WeeklyLeaderboardGuild = (): JSX.Element => {
  const { t } = useTranslation(['common', 'components']);

  // To make sure we get the current week, even if local timezone differs.
  const now = new Date();
  var utcDate = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  const week = getISOWeek(utcDate);
  const year = getISOWeekYear(utcDate);

  const { loading, error, data } = useQuery<Query>(WEEKLY_LEADERBOARD_GUILD, {
    variables: { year, week },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.weeklyGuildKillLeaderboard == null)
    return <p>{t('common:error')}</p>;

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        {t('components:leaderboardGuild.weeklyTitle')}
      </div>
      <LeaderboardGuildTable
        data={data.weeklyGuildKillLeaderboard.slice(0, 10)}
      />
    </div>
  );
};
