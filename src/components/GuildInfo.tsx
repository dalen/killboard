import { Card, Image, Media } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Guild } from '../types';

export const GuildInfo = ({ guild }: { guild: Guild }): JSX.Element => {
  const { t } = useTranslation(['components']);

  return (
    <Card mb={5}>
      <Card.Content>
        <Media>
          <Media.Item align={'left'}>
            <Image
              size={'128'}
              src={`/images/corner_icons/ea_icon_corner_guild.png`}
              alt="Guild"
            />
          </Media.Item>
          <Media.Item>
            <p className="is-size-4">
              <strong>{guild.name}</strong>
            </p>
            <p>
              <strong>{`${t('components:guildInfo.leader')} `}</strong>
              <Link to={`/character/${guild.leader.id}`}>
                {guild.leader.name}
              </Link>
            </p>
            <p>
              <strong>{`${t('components:guildInfo.description')} `}</strong>
              {guild.description}
            </p>
            <p>
              <strong>{`${t('components:guildInfo.members')} `}</strong>
              {guild.members?.totalCount}
            </p>
          </Media.Item>
        </Media>
      </Card.Content>
    </Card>
  );
};
