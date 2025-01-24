import { Table, Media, Content } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { KillGuildLeaderboardEntry } from '../types';
import { GuildHeraldry } from './GuildHeraldry';
import './styles/table.scss';

export function LeaderboardGuildTable({
  data,
}: {
  data: KillGuildLeaderboardEntry[];
}): React.ReactElement | null {
  const { t } = useTranslation(['common', 'components']);

  return (
    <div className="table-container">
      <Table striped hoverable marginless size="fullwidth">
        <thead>
          <tr>
            <th>{t('components:leaderboardGuild.rank')}</th>
            <th id="th-guildname">
              {t('components:leaderboardGuild.guildName')}
            </th>
            <th className="has-text-right">
              {t('components:leaderboardGuild.kills')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((leaderboardEntry) => (
            <tr key={leaderboardEntry.rank}>
              <td>{leaderboardEntry.rank}</td>
              <td aria-labelledby="th-guildname">
                <Media>
                  <Media.Item align="left">
                    <GuildHeraldry
                      size="48"
                      heraldry={leaderboardEntry.guild.heraldry}
                      realm={leaderboardEntry.guild.realm}
                    />
                  </Media.Item>
                  <Media.Item>
                    <Content>
                      <Link to={`/guild/${leaderboardEntry.guild.id}`}>
                        <strong>{leaderboardEntry.guild.name}</strong>
                      </Link>
                      <br />
                    </Content>
                  </Media.Item>
                </Media>
              </td>
              <td className="has-text-right">{leaderboardEntry.kills}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
