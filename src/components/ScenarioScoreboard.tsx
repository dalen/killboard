import { Table } from 'react-bulma-components';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import { useTranslation } from 'react-i18next';
import { ScenarioScoreboardEntry } from '../types';
import { CareerIcon } from './CareerIcon';
import { GuildHeraldry } from './GuildHeraldry';
import { useSortableData } from '../hooks/useSortableData';

export function ScenarioScoreboard({
  entries,
}: {
  entries: ScenarioScoreboardEntry[];
}): JSX.Element {
  const { items, requestSort, sortConfig } = useSortableData(entries);
  const { t } = useTranslation(['components']);

  const getClassName = (name: string) => {
    if (!sortConfig) {
      return '';
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
              className={`${getClassName('career')} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.career')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('name')}
              className={`${getClassName('name')} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.name')}
            </th>
            <th
              colSpan={2}
              align="left"
              onClick={() => requestSort('guild')}
              className={`${getClassName('guild')} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.guild')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('level')}
              className={`${getClassName('level')} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.rank')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('kills')}
              className={`${getClassName('kills')} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.kills')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('deaths')}
              className={`${getClassName('deaths')} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.deaths')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('deathBlows')}
              className={`${getClassName(
                'deathBlows',
              )} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.dbs')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('damage')}
              className={`${getClassName('damage')} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.damage')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('healing')}
              className={`${getClassName(
                'healing',
              )} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.healing')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('protection')}
              className={`${getClassName(
                'protection',
              )} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.protection')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('objectiveScore')}
              className={`${getClassName(
                'objectiveScore',
              )} is-clickable has-text-link`}
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
                <Tippy
                  placement="top"
                  content={
                    <div className="scenario-scoreboard-tooltip">
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
                    <div className="scenario-scoreboard-tooltip">
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
                <Tippy
                  duration={0}
                  placement="top"
                  content={
                    <div className="scenario-scoreboard-tooltip">
                      Kill Damage: {entry.killDamage}
                    </div>
                  }
                >
                  <span>{Number(entry.damage).toLocaleString()}</span>
                </Tippy>
              </td>
              <td align="left">
                <Tippy
                  duration={0}
                  placement="top"
                  content={
                    <div className="scenario-scoreboard-tooltip">
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
                    <div className="scenario-scoreboard-tooltip">
                      Protection of Self: {entry.protectionSelf}
                      <br />
                      Protection of Others: {entry.protectionOthers}
                    </div>
                  }
                >
                  <span>{Number(entry.protection).toLocaleString()}</span>
                </Tippy>
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
}
