import React, { ReactElement } from 'react';
import { Link } from 'react-router';
import Tippy from '@tippyjs/react';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { Query } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { SortConfig, SortConfigDirection } from '@/hooks/useSortableData';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { QueryPagination } from '@/components/global/QueryPagination';

const SKIRMISH_SCOREBOARD = gql`
  query GetSkirmishScoreboard(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $order: [SkirmishScoreboardEntrySortInput!]
  ) {
    skirmish(id: $id) {
      id
      scoreboardEntries(
        first: $first
        last: $last
        before: $before
        after: $after
        order: $order
      ) {
        nodes {
          realm
          kills
          killsSolo
          deaths
          deathBlows
          damage
          damageReceived
          healing
          healingReceived
          protection
          protectionReceived
          killDamage
          healingSelf
          healingOthers
          protectionSelf
          protectionOthers
          resurrectionsDone
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
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

export function SkirmishScoreboard({ id }: { id: string }): ReactElement {
  const perPage = 25;

  const { t } = useTranslation(['components']);
  const { loading, error, data, refetch } = useQuery<Query>(
    SKIRMISH_SCOREBOARD,
    {
      variables: { id, first: perPage, order: [{ deathBlows: 'DESC' }] },
    },
  );
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: 'deathBlows',
    direction: SortConfigDirection.descending,
  });

  const requestSort = (key: string) => {
    let direction = SortConfigDirection.descending;
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === SortConfigDirection.descending
    ) {
      direction = SortConfigDirection.ascending;
    }
    setSortConfig({ key, direction });
    refetch({
      order: {
        [key]: direction === SortConfigDirection.ascending ? 'ASC' : 'DESC',
      },
    });
  };

  const getClassName = (name: string) => {
    if (!sortConfig) {
      return '';
    }
    return sortConfig.key === name ? sortConfig.direction : '';
  };

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.skirmish?.scoreboardEntries?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const scoreboardEntries = data.skirmish.scoreboardEntries.nodes;
  const { pageInfo } = data.skirmish.scoreboardEntries;

  return (
    <div className="table-container">
      <table className="table is-fullwidth">
        <thead className="is-relative">
          <tr>
            <th align="left" id="th-career">
              {t('components:skirmishScoreboard.career')}
            </th>
            <th align="left">{t('components:skirmishScoreboard.name')}</th>
            <th colSpan={2} align="left">
              {t('components:skirmishScoreboard.guild')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('level')}
              className={`${getClassName('level')} is-clickable has-text-link`}
            >
              {t('components:skirmishScoreboard.rank')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('kills')}
              className={`${getClassName('kills')} is-clickable has-text-link`}
            >
              {t('components:skirmishScoreboard.kills')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('deaths')}
              className={`${getClassName('deaths')} is-clickable has-text-link`}
            >
              {t('components:skirmishScoreboard.deaths')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('deathBlows')}
              className={`${getClassName(
                'deathBlows',
              )} is-clickable has-text-link`}
            >
              {t('components:skirmishScoreboard.dbs')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('damage')}
              className={`${getClassName('damage')} is-clickable has-text-link`}
            >
              {t('components:skirmishScoreboard.damage')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('killDamage')}
              className={`${getClassName('killDamage')} is-clickable has-text-link`}
            >
              {t('components:skirmishScoreboard.killDamage')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('healing')}
              className={`${getClassName(
                'healing',
              )} is-clickable has-text-link`}
            >
              {t('components:skirmishScoreboard.healing')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('protection')}
              className={`${getClassName(
                'protection',
              )} is-clickable has-text-link`}
            >
              {t('components:skirmishScoreboard.protection')}
            </th>
          </tr>
        </thead>
        <tbody>
          {scoreboardEntries.map((entry) => (
            <tr
              key={entry.character.id}
              className={`skirmish-scoreboard-row-realm-${entry.realm}`.toLowerCase()}
            >
              <td aria-labelledby="th-career">
                <CareerIcon career={entry.character.career} />
              </td>
              <td>
                <Link to={`/character/${entry.character.id}`}>
                  {entry.character.name}
                </Link>
              </td>
              <td>
                {entry.guild && (
                  <Link to={`/guild/${entry.guild.id}`}>
                    <GuildHeraldry
                      size="32"
                      heraldry={entry.guild.heraldry}
                      realm={entry.guild.realm}
                    />
                  </Link>
                )}
              </td>
              <td>
                {entry.guild && (
                  <Link to={`/guild/${entry.guild.id}`}>
                    {entry.guild.name}
                  </Link>
                )}
              </td>
              <td align="left">{entry.level}</td>

              <td align="left">
                <Tippy
                  placement="top"
                  content={
                    <div className="scoreboard-tooltip">
                      Solo Kills: {entry.killsSolo}
                    </div>
                  }
                >
                  <span>{entry.kills}</span>
                </Tippy>
              </td>
              <td align="left">
                <Tippy
                  duration={0}
                  placement="top"
                  content={
                    <div className="scoreboard-tooltip">
                      Damage Receive: {entry.damageReceived}
                      <br />
                      Healing Received: {entry.healingReceived}
                      <br />
                      Protection Received: {entry.protectionReceived}
                    </div>
                  }
                >
                  <span>{entry.deaths}</span>
                </Tippy>
              </td>
              <td align="left">{entry.deathBlows}</td>
              <td align="left">
                <span>{Number(entry.damage).toLocaleString()}</span>
              </td>
              <td align="left">
                <Link to={`/skirmish/${id}/damage/${entry.character.id}`}>
                  <span>{Number(entry.killDamage).toLocaleString()}</span>
                </Link>
              </td>
              <td align="left">
                <Tippy
                  duration={0}
                  placement="top"
                  content={
                    <div className="scoreboard-tooltip">
                      Healing of Self: {entry.healingSelf}
                      <br />
                      Healing of Others: {entry.healingOthers}
                      <br />
                      Resurrections Done: {entry.resurrectionsDone}
                    </div>
                  }
                >
                  <span>{Number(entry.healing).toLocaleString()}</span>
                </Tippy>
              </td>
              <td align="left">
                <Tippy
                  duration={0}
                  placement="top"
                  content={
                    <div className="scoreboard-tooltip">
                      Protection of Self: {entry.protectionSelf}
                      <br />
                      Protection of Others: {entry.protectionOthers}
                    </div>
                  }
                >
                  <span>{Number(entry.protection).toLocaleString()}</span>
                </Tippy>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </div>
  );
}
