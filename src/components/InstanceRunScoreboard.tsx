import { Link } from 'react-router';
import Tippy from '@tippyjs/react';
import { useTranslation } from 'react-i18next';
import {
  InstanceEncounterRunScoreboardEntry,
  InstanceRunScoreboardEntry,
} from '../types';
import { CareerIcon } from './CareerIcon';
import { GuildHeraldry } from './GuildHeraldry';
import { useSortableData } from '../hooks/useSortableData';
import { ReactElement } from 'react';

export function InstanceRunScoreboard({
  entries,
}: {
  entries: (InstanceRunScoreboardEntry | InstanceEncounterRunScoreboardEntry)[];
}): ReactElement {
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
      <table className="table is-fullwidth">
        <thead className="is-relative">
          <tr>
            <th
              id="th-career"
              align="left"
              onClick={() => requestSort('career')}
              className={`${getClassName('career')} is-clickable has-text-link`}
            >
              {t('components:scoreboard.career')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('name')}
              className={`${getClassName('name')} is-clickable has-text-link`}
            >
              {t('components:scoreboard.name')}
            </th>
            <th
              colSpan={2}
              align="left"
              onClick={() => requestSort('guild')}
              className={`${getClassName('guild')} is-clickable has-text-link`}
            >
              {t('components:scoreboard.guild')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('level')}
              className={`${getClassName('level')} is-clickable has-text-link`}
            >
              {t('components:scoreboard.rank')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('itemRating')}
              className={`${getClassName('itemRating')} is-clickable has-text-link`}
            >
              {t('components:scoreboard.itemRating')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('deaths')}
              className={`${getClassName('deaths')} is-clickable has-text-link`}
            >
              {t('components:scoreboard.deaths')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('damage')}
              className={`${getClassName('damage')} is-clickable has-text-link`}
            >
              {t('components:scoreboard.damage')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('healing')}
              className={`${getClassName(
                'healing',
              )} is-clickable has-text-link`}
            >
              {t('components:scoreboard.healing')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('protection')}
              className={`${getClassName(
                'protection',
              )} is-clickable has-text-link`}
            >
              {t('components:scoreboard.protection')}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((entry) => (
            <tr
              key={entry.character.id}
              className={`instance-scoreboard-row-team-${entry.team}`}
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

              <td align="left">{entry.itemRating}</td>
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
              <td align="left">
                <Tippy
                  duration={0}
                  placement="top"
                  content={
                    <div className="scoreboard-tooltip">
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
    </div>
  );
}
