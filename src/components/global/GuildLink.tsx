import { Link } from 'react-router';
import type { ReactElement } from 'react';

type GuildLinkData = {
  id?: string | number | null;
  name?: string | null;
};

export const GuildLink = ({
  guild,
}: {
  guild?: GuildLinkData | null;
}): ReactElement | null => {
  if (guild?.id == null || !guild.name) return null;

  return <Link to={`/guild/${guild.id}`}>{guild.name}</Link>;
};
