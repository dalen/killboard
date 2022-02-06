import { Card, Tag, Media } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import { Attacker as AttackerType } from '../types';
import { CareerIcon } from './CareerIcon';

export const Attacker = ({
  title,
  attacker,
}: {
  title: string;
  attacker: AttackerType;
}): JSX.Element => {
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
          <Tag rounded size={'medium'}>
            {attacker.damagePercent}%
          </Tag>
        </div>
      </Card.Header>
      {attacker.guild && (
        <Card.Content>
          <Media>
            <Media.Item align={'left'}>
              <figure className="image is-32x32">
                <img src="/images/icons/guild.png" alt="Guild" />
              </figure>
            </Media.Item>
            <Media.Item>
              <Link to={`/guild/${attacker.guild?.id}`}>
                {attacker.guild?.name}
              </Link>
            </Media.Item>
          </Media>
        </Card.Content>
      )}
    </Card>
  );
};
