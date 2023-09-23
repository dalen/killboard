import { Card, Tag, Media } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import { Attacker as AttackerType } from '../types';
import { CareerIcon } from './CareerIcon';
import { GuildHeraldry } from './GuildHeraldry';

export function Attacker({
  title,
  attacker,
}: {
  title: string;
  attacker: AttackerType;
}): JSX.Element {
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
        <div className="m-3">
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
                <GuildHeraldry size="48" guild={attacker.guild} />
              </Media.Item>
              <Media.Item>
                <Link to={`/guild/${attacker.guild?.id}`}>
                  {attacker.guild?.name}
                </Link>
              </Media.Item>
            </>
          )}
        </Media>
      </Card.Content>
    </Card>
  );
}
