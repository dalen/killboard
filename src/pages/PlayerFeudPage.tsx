import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { PlayerFeud } from '@/components/kill/PlayerFeud';
import { Character, KillsConnection } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { PlayerFeudCharacterInfo } from '@/components/kill/PlayerFeudCharacterInfo';
import { ReactElement } from 'react';

const PLAYER_FEUD_INFO = gql`
  query GetPlayerFeudInfo(
    $playerId1: ID!
    $playerIntId1: UnsignedInt!
    $playerId2: ID!
    $playerIntId2: UnsignedInt!
  ) {
    player1: character(id: $playerId1) {
      name
      career
      level
      renownRank
      guildMembership {
        guild {
          id
          name
        }
      }
    }

    player2: character(id: $playerId2) {
      name
      career
      level
      renownRank
      guildMembership {
        guild {
          id
          name
        }
      }
    }

    player1kills: kills(
      first: 0
      where: {
        killerCharacterId: { eq: $playerIntId1 }
        victimCharacterId: { eq: $playerIntId2 }
      }
    ) {
      totalCount
    }

    player2kills: kills(
      first: 0
      where: {
        killerCharacterId: { eq: $playerIntId2 }
        victimCharacterId: { eq: $playerIntId1 }
      }
    ) {
      totalCount
    }
  }
`;

export function PlayerFeudPage(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);

  const { playerId1, playerId2 } = useParams();

  const { loading, error, data } = useQuery<{
    player1: Character;
    player1kills: KillsConnection;
    player2: Character;
    player2kills: KillsConnection;
  }>(PLAYER_FEUD_INFO, {
    variables: {
      playerId1,
      playerId2,
      playerIntId1: Number(playerId1),
      playerIntId2: Number(playerId2),
    },
  });

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.player1 == null || data?.player2 == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/character/${playerId1}/feud/${playerId2}`}>
              {t('pages:playerFeud.playerFeudId', {
                playerId1,
                playerId2,
                playerIntId1: Number(playerId1),
                playerIntId2: Number(playerId2),
              })}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="columns is-desktop">
        <div className="column is-5">
          <PlayerFeudCharacterInfo
            id={playerId1 || ''}
            character={data.player1}
          />
        </div>
        <div className="column">
          <div className="container is-flex is-justify-content-center">
            <figure className="image is-128x128 mt-2">
              <img
                src="/images/corner_icons/swordhammer.png"
                alt="Player Feud"
              />
            </figure>
          </div>
          <div className="container is-flex is-justify-content-center is-size-5">
            <span className="has-text-weight-bold has-text-info">
              {data.player1kills.totalCount}
            </span>
            <span className="mx-3">vs</span>{' '}
            <span className="has-text-weight-bold has-text-info">
              {data.player2kills.totalCount}
            </span>
          </div>
        </div>
        <div className="column is-5">
          <PlayerFeudCharacterInfo
            id={playerId2 || ''}
            character={data.player2}
          />
        </div>
      </div>
      <PlayerFeud player1={playerId1 || ''} player2={playerId2 || ''} />
    </div>
  );
}
