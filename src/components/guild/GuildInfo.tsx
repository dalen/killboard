import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import type { GuildInfoFragment } from '../../__generated__/graphql';
import type { ReactElement } from 'react';
import { gql } from '@apollo/client';
import { Realm } from '@/__generated__/graphql';

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

export const GuildInfo = ({
  guild,
}: {
  guild: GuildInfoFragment;
}): ReactElement => {
  const { t } = useTranslation(['components']);

  return (
    <section className="card guild-profile-card mb-5">
      <div className="card-content">
        <div className="columns is-mobile is-vcentered">
          <div className="column is-narrow">
            <GuildHeraldry
              size="64"
              heraldry={guild.heraldry}
              realm={guild.realm}
            />
          </div>
          <div className="column">
            <div className="guild-profile-heading">
              <div>
                <h1 className="title is-3 mb-2">{guild.name}</h1>
                <div className="tags mb-2">
                  <span
                    className={`tag ${guild.realm === Realm.Order ? 'is-info' : 'is-danger'}`}
                  >
                    {guild.realm === Realm.Order ? 'Order' : 'Destruction'}
                  </span>
                  <span className="tag is-dark">
                    {t('components:guildInfo.guildLevel', {
                      level: guild.level,
                    })}
                  </span>
                  <span className="tag is-dark">
                    {t('components:guildInfo.memberCount', {
                      count: guild.members?.totalCount ?? 0,
                    })}
                  </span>
                </div>
              </div>
              {guild.leader && (
                <p className="guild-profile-leader">
                  <span className="heading mb-1">
                    {t('components:guildInfo.leader')}
                  </span>
                  <Link to={`/character/${guild.leader.id}`}>
                    {guild.leader.name}
                  </Link>
                </p>
              )}
            </div>
            {guild.briefDescription && (
              <p className="guild-profile-summary">{guild.briefDescription}</p>
            )}
            {guild.description && (
              <details className="guild-profile-description">
                <summary>{t('components:guildInfo.aboutGuild')}</summary>
                <div>{guild.description}</div>
              </details>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
