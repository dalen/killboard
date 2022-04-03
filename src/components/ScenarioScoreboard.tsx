import { t } from 'i18next';
import { Table } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import { ScenarioScoreboardEntry } from '../types';
import { CareerIcon } from './CareerIcon';
import { useSortableData } from '../hooks/useSortableData';
import { GuildHeraldry } from './GuildHeraldry';

export const ScenarioScoreboard = ({
  entries,
}: {
  entries: ScenarioScoreboardEntry[];
}): JSX.Element => {
  //@todo use sortConfig to display up/down arrow on active thead or get rid of it
  const { items, requestSort, sortConfig } = useSortableData(entries);

  return (
    <Table className="is-fullwidth">
      <thead>
        <tr>
          <th
            align="left"
            onClick={() => requestSort('career')}
            className="is-clickable has-text-link"
          >
            {t('components:scenarioScoreboard.career')}
          </th>
          <th
            align="left"
            onClick={() => requestSort('name')}
            className="is-clickable has-text-link"
          >
            {t('components:scenarioScoreboard.name')}
          </th>
          <th
            colSpan={2}
            align="left"
            onClick={() => requestSort('guild')}
            className="is-clickable has-text-link"
          >
            {t('components:scenarioScoreboard.guild')}
          </th>
          <th
            align="right"
            onClick={() => requestSort('level')}
            className="is-clickable has-text-link"
          >
            {t('components:scenarioScoreboard.rank')}
          </th>
          <th
            align="right"
            onClick={() => requestSort('kills')}
            className="is-clickable has-text-link"
          >
            {t('components:scenarioScoreboard.kills')}
          </th>
          <th
            align="right"
            onClick={() => requestSort('deaths')}
            className="is-clickable has-text-link"
          >
            {t('components:scenarioScoreboard.deaths')}
          </th>
          <th
            align="right"
            onClick={() => requestSort('deathBlows')}
            className="is-clickable has-text-link"
          >
            {t('components:scenarioScoreboard.dbs')}
          </th>
          <th
            align="right"
            onClick={() => requestSort('damage')}
            className="is-clickable has-text-link"
          >
            {t('components:scenarioScoreboard.damage')}
          </th>
          <th
            align="right"
            onClick={() => requestSort('healing')}
            className="is-clickable has-text-link"
          >
            {t('components:scenarioScoreboard.healing')}
          </th>
          <th
            align="right"
            onClick={() => requestSort('protection')}
            className="is-clickable has-text-link"
          >
            {t('components:scenarioScoreboard.protection')}
          </th>
          <th
            align="right"
            onClick={() => requestSort('objectiveScore')}
            className="is-clickable has-text-link"
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
                <Link to={`/guild/${entry.guild.id}`}>{entry.guild.name}</Link>
              )}
            </td>
            <td align="right">{entry.level}</td>
            <td align="right">{entry.kills}</td>
            <td align="right">{entry.deaths}</td>
            <td align="right">{entry.deathBlows}</td>
            <td align="right">{Number(entry.damage).toLocaleString()}</td>
            <td align="right">{Number(entry.healing).toLocaleString()}</td>
            <td align="right">{Number(entry.protection).toLocaleString()}</td>
            <td align="right">
              {Number(entry.objectiveScore).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
