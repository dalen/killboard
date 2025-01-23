import { Card, Media } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GuildHeraldry } from './GuildHeraldry';
import {
  GuildHeraldry as GuildHeraldryType,
  MembersConnection,
  Realm,
} from '../__generated__/graphql';

export function GuildInfo({
  guild,
}: {
  guild: {
    heraldry: GuildHeraldryType;
    name: string;
    leader?: { id: string; name: string } | null | undefined;
    members?: Partial<MembersConnection> | null | undefined;
    description: string;
    realm: Realm;
  };
}): JSX.Element {
  const { t } = useTranslation(['components']);

  return (
    <Card mb={5}>
      <Card.Content>
        <Media>
          {guild.heraldry && guild.realm && (
            <Media.Item align="left">
              <GuildHeraldry
                size="128"
                heraldry={guild.heraldry}
                realm={guild.realm}
              />
            </Media.Item>
          )}

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
