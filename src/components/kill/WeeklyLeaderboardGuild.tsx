import { getISOWeek, getISOWeekYear } from 'date-fns';
import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Query } from '@/__generated__/graphql';
import { LeaderboardGuildTable } from '@/components/kill/LeaderboardGuildTable';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ReactElement } from 'react';

const WEEKLY_LEADERBOARD_GUILD = gql`
  query GetWeeklyGuildLeaderboard($year: Int!, $week: Int!) {
    weeklyGuildKillLeaderboard(year: $year, week: $week) {
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

export function WeeklyLeaderboardGuild(): ReactElement {
  const { t } = useTranslation(['common', 'components']);

  // To make sure we get the current week, even if local timezone differs.
  const now = new Date();
  const utcDate = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  const week = getISOWeek(utcDate);
  const year = getISOWeekYear(utcDate);

  const { loading, error, data } = useQuery<Query>(WEEKLY_LEADERBOARD_GUILD, {
    variables: { year, week },
  });

  if (loading) return <progress className="progress" />;
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
}
