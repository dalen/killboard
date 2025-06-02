import { Link } from 'react-router';
import Tippy from '@tippyjs/react';
import { useTranslation } from 'react-i18next';
import { ScenarioScoreboardEntryFragment } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { useSortableData } from '@/hooks/useSortableData';
import { ReactElement } from 'react';

export function ScenarioScoreboard({
  entries,
}: {
  entries: ScenarioScoreboardEntryFragment[];
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
              onClick={() => requestSort('character.career')}
              className={`${getClassName('career')} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.career')}
            </th>
            <th
              align="left"
              onClick={() => requestSort('character.name')}
              className={`${getClassName('name')} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.name')}
            </th>
            <th
              colSpan={2}
              align="left"
              onClick={() => requestSort('guild.name')}
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
              onClick={() => requestSort('killDamage')}
              className={`${getClassName('killDamage')} is-clickable has-text-link`}
            >
              {t('components:scenarioScoreboard.killDamage')}
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
          {items.map((entry: ScenarioScoreboardEntryFragment) => (
            <tr
              key={entry.character.id}
              className={`scenario-scoreboard-row-team-${entry.team}`}
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
                <span>{Number(entry.killDamage).toLocaleString()}</span>
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
              <td align="left">
                {Number(entry.objectiveScore).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
