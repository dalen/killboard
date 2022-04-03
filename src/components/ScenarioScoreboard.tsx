import { t } from 'i18next';
import { Table } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import { ScenarioScoreboardEntry } from '../types';
import { CareerIcon } from './CareerIcon';
import { GuildHeraldry } from './GuildHeraldry';
import { useSortableData } from '../hooks/useSortableData';

export const ScenarioScoreboard = ({
  entries,
}: {
  entries: ScenarioScoreboardEntry[];
}): JSX.Element => {
  const { items, requestSort, sortConfig } = useSortableData(entries);

  const getClassName = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : '';
  };

  return (
    <div className="table-container">
      <Table className="is-fullwidth">
        <thead className="is-relative">
          <tr>
            <th
              align="left"
              onClick={() => requestSort('career')}
              className={getClassName('career') + ' is-clickable has-text-link'}
            >
              {t('components:scenarioScoreboard.career')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('name')}
              className={getClassName('name') + ' is-clickable has-text-link'}
            >
              {t('components:scenarioScoreboard.name')}
            </th>
            <th
              colSpan={2}
              align="left"
              onClick={() => requestSort('guild')}
              className={getClassName('guild') + ' is-clickable has-text-link'}
            >
              {t('components:scenarioScoreboard.guild')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('level')}
              className={getClassName('level') + ' is-clickable has-text-link'}
            >
              {t('components:scenarioScoreboard.rank')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('kills')}
              className={getClassName('kills') + ' is-clickable has-text-link'}
            >
              {t('components:scenarioScoreboard.kills')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('deaths')}
              className={getClassName('deaths') + ' is-clickable has-text-link'}
            >
              {t('components:scenarioScoreboard.deaths')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('deathBlows')}
              className={
                getClassName('deathBlows') + ' is-clickable has-text-link'
              }
            >
              {t('components:scenarioScoreboard.dbs')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('damage')}
              className={getClassName('damage') + ' is-clickable has-text-link'}
            >
              {t('components:scenarioScoreboard.damage')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('healing')}
              className={
                getClassName('healing') + ' is-clickable has-text-link'
              }
            >
              {t('components:scenarioScoreboard.healing')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('protection')}
              className={
                getClassName('protection') + ' is-clickable has-text-link'
              }
            >
              {t('components:scenarioScoreboard.protection')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('objectiveScore')}
              className={
                getClassName('objectiveScore') + ' is-clickable has-text-link'
              }
            >
              {t('components:scenarioScoreboard.objectiveScore')}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((entry) => (
            <tr
              key={entry.character.id}
              className={`scenario-scoreboard-row-team-${entry.team}`}
            >
              <td>
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
                    <GuildHeraldry size="32" guild={entry.guild} />
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
                <span
                  className="tooltip"
                  title={'solo kills: ' + entry.killsSolo}
                >
                  {entry.kills}
                </span>
              </td>
              <td align="left">{entry.deaths}</td>
              <td align="left">{entry.deathBlows}</td>
              <td align="left">
                <span
                  className="tooltip"
                  title={
                    'kill damage: ' +
                    entry.killDamage +
                    '\ndamage received: ' +
                    entry.damageReceived
                  }
                >
                  {Number(entry.damage).toLocaleString()}
                </span>
              </td>
              <td align="left">
                <span
                  className="tooltip"
                  title={
                    'self: ' +
                    entry.healingSelf +
                    '\nothers: ' +
                    entry.healingOthers +
                    '\nreceived: ' +
                    entry.healingReceived +
                    '\nresurrections done: ' +
                    entry.resurrectionsDone
                  }
                >
                  {Number(entry.healing).toLocaleString()}
                </span>
              </td>
              <td align="left">
                <span
                  className="tooltip"
                  title={
                    'self: ' +
                    entry.protectionSelf +
                    '\nothers: ' +
                    entry.protectionOthers +
                    '\nreceived: ' +
                    entry.protectionReceived
                  }
                >
                  {Number(entry.protection).toLocaleString()}
                </span>
              </td>
              <td align="left">
                {Number(entry.objectiveScore).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
