import { Card, Media } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Guild } from '../types';
import { GuildHeraldry } from './GuildHeraldry';

export function GuildInfo({ guild }: { guild: Guild }): JSX.Element {
  const { t } = useTranslation(['components']);

  return (
    <Card mb={5}>
      <Card.Content>
        <Media>
          <Media.Item align="left">
            <GuildHeraldry size="128" guild={guild} />
          </Media.Item>
          <Media.Item>
            <p className="is-size-4">
              <strong>{guild.name}</strong>
            </p>
            {guild.leader && (
              <p>
                <strong>{`${t('components:guildInfo.leader')} `}</strong>
                <Link to={`/character/${guild.leader.id}`}>
                  {guild.leader.name}
                </Link>
              </p>
            )}
            <p>
              <strong>{`${t('components:guildInfo.members')} `}</strong>
              {guild.members?.totalCount}
            </p>
            <p>
              <strong>{`${t('components:guildInfo.description')} `}</strong>
              <br />
              <div style={{ whiteSpace: 'pre-wrap' }}>{guild.description}</div>
            </p>
          </Media.Item>
        </Media>
      </Card.Content>
    </Card>
  );
}
