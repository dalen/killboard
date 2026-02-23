import { getISOWeek, getISOWeekYear } from 'date-fns';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import type { Query } from '@/__generated__/graphql';
import { LeaderboardTable } from '@/components/kill/LeaderboardTable';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import type { ReactElement } from 'react';

const WEEKLY_LEADERBOARD = gql`
  query GetWeeklyLeaderboard($year: Int!, $week: Int!) {
    weeklyKillLeaderboard(year: $year, week: $week) {
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

export function WeeklyLeaderboard(): ReactElement {
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

  const { loading, error, data } = useQuery<Query>(WEEKLY_LEADERBOARD, {
    variables: { week, year },
  });

  if (loading) {return <progress className="progress" />;}
  if (error) {return <ErrorMessage name={error.name} message={error.message} />;}
  if (data?.weeklyKillLeaderboard == null) {return <p>{t('common:error')}</p>;}

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase">
        {t('components:leaderboard.weeklyTitle')}
      </div>
      <LeaderboardTable data={data.weeklyKillLeaderboard.slice(0, 10)} />
    </div>
  );
}
