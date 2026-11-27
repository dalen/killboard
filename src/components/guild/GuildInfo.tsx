import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import './GuildInfo.scss';
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
    <section className={`guild-profile-card warhammer-identity-frame is-${guild.realm === Realm.Order ? 'order' : 'destruction'}`}>
      <GuildHeraldry size="64" heraldry={guild.heraldry} realm={guild.realm} />
      <div className="guild-profile-main">
        <h1 className="guild-profile-name">{guild.name}</h1>
        {guild.briefDescription && (
          <p className="guild-profile-motto">{guild.briefDescription}</p>
        )}
        <div className="guild-profile-facts">
          <span className="guild-profile-fact guild-profile-realm">
            {guild.realm === Realm.Order ? 'Order' : 'Destruction'}
          </span>
          <span className="guild-profile-fact">
            {t('components:guildInfo.guildLevel', { level: guild.level })}
          </span>
          <span className="guild-profile-fact">
            {t('components:guildInfo.memberCount', { count: guild.members?.totalCount ?? 0 })}
          </span>
        </div>
      </div>
      {guild.leader && (
        <p className="guild-profile-leader">
          <span>{t('components:guildInfo.leader')}</span>
          <Link to={`/character/${guild.leader.id}`}>{guild.leader.name}</Link>
        </p>
      )}
      {guild.description && (
        <details className="guild-profile-description">
          <summary>{t('components:guildInfo.aboutGuild')}</summary>
          <div>{guild.description}</div>
        </details>
      )}
    </section>
  );
};
