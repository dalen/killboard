import { Image } from 'react-bulma-components';
import {
  GuildHeraldry as GuildHeraldryType,
  Realm,
} from '../__generated__/graphql';

export function GuildHeraldry({
  size,
  heraldry,
  realm,
}: {
  size: '24' | '32' | '48' | '64' | '128';
  heraldry: GuildHeraldryType;
  realm: Realm;
}): JSX.Element {
  const realmNum = realm === 'ORDER' ? 1 : 2;

  return (
    <Image
      size={Number(size)}
      src={`https://armory.returnofreckoning.com/heraldry/frame/${size}/${size}/${realmNum}/${heraldry.emblem}/${heraldry.pattern}/${heraldry.color1}/${heraldry.color2}/${heraldry.shape}`}
      alt="Heraldry"
    />
  );
}
