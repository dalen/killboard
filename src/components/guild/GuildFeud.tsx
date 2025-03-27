import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

const GUILD_FEUD = gql`
  query GetGuildFeud(
    $guild1Id: ID!
    $guild2Id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    kills(
      guildFeudFilter: { guild1Id: $guild1Id, guild2Id: $guild2Id }
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        id
        time
        position {
          zoneId
        }
        scenario {
          id
        }
        victim {
          level
          renownRank
          character {
            id
            career
            name
          }
          guild {
            id
            name
          }
        }
        attackers {
          level
          renownRank
          damagePercent
          character {
            id
            career
            name
          }
          guild {
            id
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export function GuildFeud({
  guild1,
  guild2,
}: {
  guild1: string;
  guild2: string;
}): ReactElement {
  const { t } = useTranslation('components');

  return (
    <div className="mt-3">
      <div className="is-size-4 is-family-secondary is-uppercase">
        <Link to={`/guild/${guild1}/feud/${guild2}`}>
          {t('guildFeud.title')}
        </Link>
      </div>
      <KillsList
        query={GUILD_FEUD}
        queryOptions={{
          variables: { guild1Id: guild1, guild2Id: guild2 },
        }}
        perPage={10}
      />
    </div>
  );
}
