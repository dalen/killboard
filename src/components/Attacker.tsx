import { Card, Tag, Media, Table, Image } from 'react-bulma-components';
import { Link } from 'react-router';
import { sum } from 'lodash';
import { Attacker as AttackerType, KillDamage } from '../types';
import { CareerIcon } from './CareerIcon';
import { GuildHeraldry } from './GuildHeraldry';
import { killDamageText } from '../utils';

export function Attacker({
  title,
  attacker,
  killDamage,
  showKillDamage,
  deathblow,
}: {
  title: string;
  attacker: AttackerType;
  killDamage: KillDamage[];
  showKillDamage: boolean;
  deathblow: boolean;
}): JSX.Element {
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
  }, [] as KillDamage[]);

  const killDamageSum = sum(killDamage.map((d) => d.damageAmount));

  return (
    <Card mb={2}>
      <Card.Header backgroundColor="info-dark">
        <Card.Header.Icon>
          <CareerIcon career={attacker.character.career} />
        </Card.Header.Icon>
        <Card.Header.Title textColor="white">
          <strong className="mr-1">{title}:</strong>
          <Link to={`/character/${attacker.character.id}`}>
            {attacker.character.name}
          </Link>
        </Card.Header.Title>
        {deathblow && (
          <Card.Header.Icon>
            <img
              src="/images/icons/kills.png"
              alt="Deathblow"
              title="Deathblow"
              width={19}
              height={31}
            />
          </Card.Header.Icon>
        )}
        <div className="m-3">
          <Tag rounded size="medium" mr={2} color="info">
            {sum(killDamage.map((d) => d.damageAmount))}
          </Tag>
          <Tag rounded size="medium">
            {attacker.damagePercent}%
          </Tag>
        </div>
      </Card.Header>
      <Card.Content py={2}>
        <Media>
          <Media.Item align="left">
            <small>
              Lvl {attacker.level}
              <br />
              RR {attacker.renownRank}
            </small>
          </Media.Item>
          {attacker.guild && (
            <>
              <Media.Item align="left">
                <GuildHeraldry
                  size="48"
                  heraldry={attacker.guild.heraldry}
                  realm={attacker.guild.realm}
                />
              </Media.Item>
              <Media.Item>
                <Link to={`/guild/${attacker.guild?.id}`}>
                  {attacker.guild?.name}
                </Link>
              </Media.Item>
            </>
          )}
        </Media>
        {showKillDamage && killDamage.length > 0 && (
          <Table size="narrow" striped width="100%">
            <tbody>
              {killDamageGrouped
                .sort((e1, e2) => e2.damageAmount - e1.damageAmount)
                .map((damage) => (
                  <tr>
                    <td style={{ verticalAlign: 'middle' }}>
                      {damage.ability && (
                        <Image
                          size={24}
                          src={damage.ability.iconUrl}
                          alt="Heraldry"
                        />
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
          </Table>
        )}
      </Card.Content>
    </Card>
  );
}
