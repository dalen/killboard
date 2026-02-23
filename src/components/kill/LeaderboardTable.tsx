import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { KillLeaderboardEntry } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import '@/components/styles/table.scss';

export const LeaderboardTable = ({
  data,
}: {
  data: KillLeaderboardEntry[];
}): React.ReactElement | null => {
  const { t } = useTranslation(['common', 'components']);

  return (
    <table className="table is-striped is-hoverable is-fullwidth is-marginless">
      <thead>
        <tr>
          <th>{t('components:leaderboard.rank')}</th>
          <th>{t('components:leaderboard.player')}</th>
          <th className="has-text-right">
            {t('components:leaderboard.kills')}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((leaderboardEntry) => (
          <tr key={leaderboardEntry.rank}>
            <td>{leaderboardEntry.rank}</td>
            <td>
              <div className="media leaderboard-player-data">
                <div className="media-left">
                  <CareerIcon career={leaderboardEntry.character.career} />
                </div>
                <div className="media-content">
                  <div className="content">
                    <Link to={`/character/${leaderboardEntry.character.id}`}>
                      <strong>{leaderboardEntry.character.name}</strong>
                    </Link>
                    <br />
                    <Link
                      to={`/guild/${leaderboardEntry.character.guildMembership?.guild?.id}`}
                    >
                      {leaderboardEntry.character.guildMembership?.guild?.name}
                    </Link>
                  </div>
                </div>
                <div className="media-content player-rr-lvl-container">
                  <span>Lvl {leaderboardEntry.character.level}</span>
                  <span>RR {leaderboardEntry.character.renownRank}</span>
                </div>
              </div>
            </td>
            <td className="has-text-right">{leaderboardEntry.kills}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
