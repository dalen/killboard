import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { KillGuildLeaderboardEntry } from '@/__generated__/graphql';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import '@/components/styles/table.scss';

export function LeaderboardGuildTable({
  data,
}: {
  data: KillGuildLeaderboardEntry[];
}): React.ReactElement | null {
  const { t } = useTranslation(['common', 'components']);

  return (
    <div className="table-container">
      <table className="table is-striped is-hoverable is-fullwidth is-marginless">
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
                <article className="media">
                  <figure className="media-left">
                    <GuildHeraldry
                      size="48"
                      heraldry={leaderboardEntry.guild.heraldry}
                      realm={leaderboardEntry.guild.realm}
                    />
                  </figure>
                  <div className="media-content">
                    <div className="content">
                      <Link to={`/guild/${leaderboardEntry.guild.id}`}>
                        <strong>{leaderboardEntry.guild.name}</strong>
                      </Link>
                      <br />
                    </div>
                  </div>
                </article>
              </td>
              <td className="has-text-right">{leaderboardEntry.kills}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
