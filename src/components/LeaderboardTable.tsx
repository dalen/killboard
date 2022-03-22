import { Table, Media, Content } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { KillLeaderboardEntry } from '../types';
import { CareerIcon } from './CareerIcon';
import './tableStyling.scss';

export const LeaderboardTable = ({
  data,
}: {
  data: KillLeaderboardEntry[];
}): React.ReactElement | null => {
  const { t } = useTranslation(['common', 'components']);

  return (
    <Table striped hoverable size="fullwidth" marginless>
      <thead>
        <tr>
          <th>{t('components:leaderboard.rank')}</th>
          <th>{t('components:leaderboard.player')}</th>
          <th className="has-text-right">
            {t('components:leaderboard.kills')}
          </th>
          <th className="has-text-right">
            {t('components:leaderboard.deaths')}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((leaderboardEntry) => {
          return (
            <tr key={leaderboardEntry.rank}>
              <td>{leaderboardEntry.rank}</td>
              <td>
                <Media className="leaderboard-player-data">
                  <Media.Item align="left">
                    <CareerIcon career={leaderboardEntry.character.career} />
                  </Media.Item>
                  <Media.Item>
                    <Content>
                      <Link to={`/character/${leaderboardEntry.character.id}`}>
                        <strong>{leaderboardEntry.character.name}</strong>
                      </Link>
                      <br />
                      <Link
                        to={`/guild/${leaderboardEntry.character.guildMembership?.guild?.id}`}
                      >
                        {
                          leaderboardEntry.character.guildMembership?.guild
                            ?.name
                        }
                      </Link>
                    </Content>
                  </Media.Item>
                  <Media.Item className="player-rr">
                    <span>Lvl {leaderboardEntry.character.level}</span>
                    <span>RR {leaderboardEntry.character.renownRank}</span>
                  </Media.Item>
                </Media>
              </td>
              <td className="has-text-right">{leaderboardEntry.kills}</td>
              <td className="has-text-right">{leaderboardEntry.deaths}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
