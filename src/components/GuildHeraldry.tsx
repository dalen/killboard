import { Image } from 'react-bulma-components';
import { Guild } from '../types';

export function GuildHeraldry({
  size,
  guild,
}: {
  size: '24' | '32' | '48' | '64' | '128';
  guild: Pick<Guild, 'heraldry' | 'realm'>;
}): JSX.Element {
  const realmNum = guild.realm === 'ORDER' ? 1 : 2;

  return (
    <Image
      size={Number(size)}
      src={`https://armory.returnofreckoning.com/heraldry/frame/${size}/${size}/${realmNum}/${guild.heraldry.emblem}/${guild.heraldry.pattern}/${guild.heraldry.color1}/${guild.heraldry.color2}/${guild.heraldry.shape}`}
      alt="Heraldry"
    />
  );
}
