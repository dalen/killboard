import { Link } from 'react-router';
import { sum } from 'lodash';
import { CareerIcon } from '@/components/CareerIcon';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { killDamageText } from '@/utils';
import { ReactElement } from 'react';
import { AttackerFragment, KillDamageFragment } from '@/__generated__/graphql';
import { gql } from '@apollo/client';

export const KILL_ATTACKER_FRAGMENT = gql`
  fragment Attacker on Attacker {
    damagePercent
    level
    renownRank
    character {
      id
      name
      career
    }
    guild {
      id
      name
      realm
      heraldry {
        emblem
        pattern
        color1
        color2
        shape
      }
    }
  }
`;

export const KILL_DAMAGE_FRAGMENT = gql`
  fragment KillDamage on KillDamage {
    attackerType
    damageType
    attacker {
      id
    }
    ability {
      id
      name
      iconUrl
    }
    damageAmount
  }
`;

export function Attacker({
  title,
  attacker,
  killDamage,
  showKillDamage,
  deathblow,
}: {
  title: string;
  attacker: AttackerFragment;
  killDamage: KillDamageFragment[];
  showKillDamage: boolean;
  deathblow: boolean;
}): ReactElement {
  // Group killdamage by ability.name and ability.iconUrl
  const killDamageGrouped = killDamage.reduce((acc, curr) => {
    const existing = acc.find(
      (e) =>
        killDamageText(e) === killDamageText(curr) &&
        e.ability?.iconUrl === curr.ability?.iconUrl,
    );
    if (existing) {
      existing.damageAmount += curr.damageAmount;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as KillDamageFragment[]);

  const killDamageSum = sum(killDamage.map((d) => d.damageAmount));

  return (
    <div className="card mb-2">
      <header className="card-header has-background-info-dark">
        <div className="card-header-icon">
          <CareerIcon career={attacker.character.career} />
        </div>
        <p className="card-header-title has-text-white">
          <strong className="mr-1">{title}:</strong>
          <Link to={`/character/${attacker.character.id}`}>
            {attacker.character.name}
          </Link>
        </p>
        {deathblow && (
          <div className="card-header-icon">
            <img
              src="/images/icons/kills.png"
              alt="Deathblow"
              title="Deathblow"
              width={19}
              height={31}
            />
          </div>
        )}
        <div className="m-3">
          <span className="tag  is-medium is-rounded is-info mr-2">
            {sum(killDamage.map((d) => d.damageAmount))}
          </span>
          <span className="tag  is-medium is-rounded">
            {attacker.damagePercent}%
          </span>
        </div>
      </header>
      <div className="card-content py-2">
        <article className="media">
          <figure className="media-left">
            <small>
              Lvl {attacker.level}
              <br />
              RR {attacker.renownRank}
            </small>
          </figure>
          {attacker.guild && (
            <>
              <figure className="media-left">
                <GuildHeraldry
                  size="48"
                  heraldry={attacker.guild.heraldry}
                  realm={attacker.guild.realm}
                />
              </figure>
              <div className="media-content">
                <Link to={`/guild/${attacker.guild?.id}`}>
                  {attacker.guild?.name}
                </Link>
              </div>
            </>
          )}
        </article>
        {showKillDamage && killDamage.length > 0 && (
          <table className="table is-striped is-narrow" width="100%">
            <tbody>
              {killDamageGrouped
                .sort((e1, e2) => e2.damageAmount - e1.damageAmount)
                .map((damage) => (
                  <tr>
                    <td style={{ verticalAlign: 'middle' }}>
                      {damage.ability && (
                        <figure className="image is-24x24">
                          <img src={damage.ability.iconUrl} alt="Heraldry" />
                        </figure>
                      )}
                    </td>
                    <td>{killDamageText(damage)}</td>
                    <td align="right">{damage.damageAmount}</td>
                    <td align="right">
                      {((damage.damageAmount / killDamageSum) * 100).toFixed(1)}
                      %
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
