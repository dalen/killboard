import { gql } from '@apollo/client';
import { KillsList } from './KillsList';

const GUILD_FEUD = gql`
  query GetGuildFeud($guild1Id: ID!, $guild2Id: ID!) {
    guildFeudKills(guild1Id: $guild1Id, guild2Id: $guild2Id, first: 10) {
      nodes {
        id
        time
        position {
          zoneId
        }
        scenarioId
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
    }
  }
`;

export const GuildFeud = ({
  guild1,
  guild2,
}: {
  guild1: string;
  guild2: string;
}): JSX.Element => {
  return (
    <div className="mt-3">
      <div className="is-size-4 is-family-secondary is-uppercase">
        Guild Feud
      </div>
      <KillsList
        query={GUILD_FEUD}
        queryOptions={{
          variables: { guild1Id: guild1, guild2Id: guild2 },
        }}
      />
    </div>
  );
};
