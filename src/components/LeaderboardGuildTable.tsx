import { Table, Media, Content } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { KillGuildLeaderboardEntry } from '../types';
import './styles/table.scss';

export const LeaderboardGuildTable = ({
  data,
}: {
  data: KillGuildLeaderboardEntry[];
}): React.ReactElement | null => {
  const { t } = useTranslation(['common', 'components']);

  return (
    <div className="table-container">
      <Table striped hoverable marginless size={'fullwidth'}>
        <thead>
          <tr>
            <th>{t('components:leaderboardGuild.rank')}</th>
            <th>{t('components:leaderboardGuild.guildName')}</th>
            <th className="has-text-right">
              {t('components:leaderboardGuild.kills')}
            </th>
            <th className="has-text-right">
              {t('components:leaderboardGuild.deaths')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((leaderboardEntry) => {
            return (
              <tr key={leaderboardEntry.rank}>
                <td>{leaderboardEntry.rank}</td>
                <td>
                  <Media.Item>
                    <Content>
                      <Link to={`/guild/${leaderboardEntry.guild.id}`}>
                        <strong>{leaderboardEntry.guild.name}</strong>
                      </Link>
                      <br />
                    </Content>
                  </Media.Item>
                </td>
                <td className="has-text-right">{leaderboardEntry.kills}</td>
                <td className="has-text-right">{leaderboardEntry.deaths}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
