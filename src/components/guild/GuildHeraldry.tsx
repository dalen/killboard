import type { GuildHeraldry as GuildHeraldryType } from '../../__generated__/graphql';
import { Realm } from '../../__generated__/graphql';
import type { ReactElement } from 'react';
import clsx from 'clsx';

export const GuildHeraldry = ({
  size,
  heraldry,
  realm,
}: {
  size: '24' | '32' | '48' | '64' | '128';
  heraldry: GuildHeraldryType;
  realm: Realm;
}): ReactElement => {
  const realmNum = realm === Realm.Order ? 1 : 2;

  return (
    <figure className={clsx('image', `is-${size}x${size}`)}>
      <img
        src={`https://armory.returnofreckoning.com/heraldry/frame/${size}/${size}/${realmNum}/${heraldry.emblem}/${heraldry.pattern}/${heraldry.color1}/${heraldry.color2}/${heraldry.shape}`}
        alt="Heraldry"
      />
    </figure>
  );
};
