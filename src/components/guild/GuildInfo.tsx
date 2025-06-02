import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { GuildInfoFragment } from '../../__generated__/graphql';
import { ReactElement } from 'react';
import { gql } from '@apollo/client';

export const GUILD_INFO_FRAGMENT = gql`
  fragment GuildInfo on Guild {
    name
    description
    briefDescription
    level
    realm
    heraldry {
      emblem
      pattern
      color1
      color2
      shape
    }
    leader {
      id
      name
      career
    }
    members {
      totalCount
    }
  }
`;

export function GuildInfo({
  guild,
}: {
  guild: GuildInfoFragment;
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
