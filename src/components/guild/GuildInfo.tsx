import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { GuildHeraldry } from './GuildHeraldry';
import {
  GuildHeraldry as GuildHeraldryType,
  MembersConnection,
  Realm,
} from '../../__generated__/graphql';
import { ReactElement } from 'react';

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
}): ReactElement {
  const { t } = useTranslation(['components']);

  return (
    <div className="card mb-5">
      <div className="card-content">
        <article className="media">
          {guild.heraldry && guild.realm && (
            <figure className="media-left">
              <GuildHeraldry
                size="128"
                heraldry={guild.heraldry}
                realm={guild.realm}
              />
            </figure>
          )}

          <div className="media-content">
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
          </div>
        </article>
      </div>
    </div>
  );
}
