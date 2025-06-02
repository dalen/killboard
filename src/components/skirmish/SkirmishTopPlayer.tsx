import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Query, SkirmishScoreboardEntry } from '@/__generated__/graphql';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { careerIcon } from '@/utils';
import { ReactElement } from 'react';
import clsx from 'clsx';

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
}): ReactElement {
  const { t } = useTranslation(['pages']);
  const { loading, error, data } = useQuery<Query>(SKIRMISH_TOP_PLAYER, {
    variables: { id, order: [{ [attribute]: 'DESC' }] },
  });

  if (loading)
    return (
      <div className="card">
        <div className={clsx('card-content', className)}>
          <progress className="progress" />
        </div>
      </div>
    );

  if (
    error ||
    data?.skirmish?.scoreboardEntries?.nodes == null ||
    data?.skirmish.scoreboardEntries.nodes.length === 0 ||
    data?.skirmish.scoreboardEntries.nodes[0][attribute] === 0
  )
    return (
      <div className={clsx('card-content', className)}>
        <header className="card-header">
          <p className="card-header-title">{t(title)}</p>
          <p className="card-header-title is-justify-content-right has-text-grey">
            -
          </p>
        </header>
        <div className="card-content">
          <article className="media">
            <figure className="media-left">
              <div />
              <small>
                Lvl -
                <br />
                RR -
              </small>
            </figure>
          </article>
        </div>
      </div>
    );

  const player = data.skirmish.scoreboardEntries.nodes[0];

  return (
    <div className={clsx('card-content', 'mb-1', className)}>
      <header className="card-header">
        <p className="card-header-title">{t(title)}</p>
        <p className="card-header-title is-justify-content-right has-text-grey">
          {Number(player[attribute]).toLocaleString()}
        </p>
      </header>
      <div className="card-content p-1">
        <div>
          <span className="icon-text">
            <span className="icon">
              <img
                src={careerIcon(player.character.career)}
                alt={t(`enums:career.${player.character.career}`) ?? ''}
              />
            </span>
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
          </span>
        </div>

        {player.guild && (
          <span className="icon-text">
            <span className="icon">
              <GuildHeraldry
                size="24"
                heraldry={player.guild.heraldry}
                realm={player.guild.realm}
              />
            </span>
            <Link to={`/guild/${player.guild?.id}`}>{player.guild?.name}</Link>
          </span>
        )}
      </div>
    </div>
  );
}
