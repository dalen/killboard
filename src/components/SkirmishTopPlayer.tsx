import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Card, Icon, Media, Progress } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import { Query, SkirmishScoreboardEntry } from '../types';
import { GuildHeraldry } from './GuildHeraldry';
import { careerIcon } from '../utils';

const SKIRMISH_TOP_PLAYER = gql`
  query GetSkirmishTopPlayer(
    $id: ID!
    $order: [SkirmishScoreboardEntrySortInput!]
  ) {
    skirmish(id: $id) {
      id
      scoreboardEntries(first: 1, order: $order) {
        nodes {
          realm
          damage
          healing
          protection
          deathBlows
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
      }
    }
  }
`;

export function SkirmishTopPlayer({
  id,
  attribute,
  title,
  className,
}: {
  id: string;
  attribute: keyof SkirmishScoreboardEntry;
  title: string;
  className: string;
}): JSX.Element {
  const { t } = useTranslation(['pages']);
  const { loading, error, data } = useQuery<Query>(SKIRMISH_TOP_PLAYER, {
    variables: { id, order: [{ [attribute]: 'DESC' }] },
  });

  if (loading)
    return (
      <Card>
        <Card.Content className={className}>
          <Progress />
        </Card.Content>
      </Card>
    );

  if (
    error ||
    data?.skirmish?.scoreboardEntries?.nodes == null ||
    data?.skirmish.scoreboardEntries.nodes.length === 0 ||
    data?.skirmish.scoreboardEntries.nodes[0][attribute] === 0
  )
    return (
      <Card className={className}>
        <Card.Header>
          <Card.Header.Title>{t(title)}</Card.Header.Title>
          <Card.Header.Title className="is-justify-content-right has-text-grey">
            -
          </Card.Header.Title>
        </Card.Header>
        <Card.Content>
          <Media>
            <Media.Item align="left">
              <div />
              <small>
                Lvl -
                <br />
                RR -
              </small>
            </Media.Item>
          </Media>
        </Card.Content>
      </Card>
    );

  const player = data.skirmish.scoreboardEntries.nodes[0];

  return (
    <Card className={`mb-1 ${className}`}>
      <Card.Header>
        <Card.Header.Title>{t(title)}</Card.Header.Title>
        <Card.Header.Title className="is-justify-content-right has-text-grey">
          {Number(player[attribute]).toLocaleString()}
        </Card.Header.Title>
      </Card.Header>
      <Card.Content style={{ padding: '1rem' }}>
        <div>
          <Icon.Text>
            <Icon>
              <img
                src={careerIcon(player.character.career)}
                alt={t(`enums:career.${player.character.career}`) ?? ''}
              />
            </Icon>
            <div>
              <div>
                <Link to={`/character/${player.character.id}`}>
                  {player.character.name}
                </Link>
              </div>
              <small>
                Lvl <strong>{player.level}</strong> / RR{' '}
                <strong>{player.renownRank}</strong>
              </small>
            </div>
          </Icon.Text>
        </div>

        {player.guild && (
          <Icon.Text>
            <Icon>
              <GuildHeraldry
                size="24"
                heraldry={player.guild.heraldry}
                realm={player.guild.realm}
              />
            </Icon>
            <Link to={`/guild/${player.guild?.id}`}>{player.guild?.name}</Link>
          </Icon.Text>
        )}
      </Card.Content>
    </Card>
  );
}
