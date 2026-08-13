import { Link } from 'react-router';
import Tippy from '@tippyjs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ScenarioScoreboardEntryFragment } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import {
  scenarioCareerRoles,
  scenarioRoleOrder,
} from '@/components/scenario/scenarioRoles';
import { assetUrl } from '@/utils';
import type { ReactElement } from 'react';

type StatKey =
  | 'kills'
  | 'deaths'
  | 'deathBlows'
  | 'damage'
  | 'killDamage'
  | 'healing'
  | 'protection'
  | 'objectiveScore';

const STAT_KEYS: StatKey[] = [
  'kills',
  'deaths',
  'deathBlows',
  'damage',
  'killDamage',
  'healing',
  'protection',
  'objectiveScore',
];

// Percentage of the entry's own team total for this stat. Showing this next
// to the raw number lets you compare a healer's contribution to a DPS's
// contribution without inventing a combined score across different roles.
const shareOfTeam = (value: number, total: number): string =>
  total > 0 ? `${Math.round((value / total) * 100)}%` : '—';

const StatCell = ({
  total,
  tooltip,
  value,
}: {
  total: number;
  tooltip?: ReactElement;
  value: number;
}): ReactElement => {
  const inner = (
    <span>
      {value.toLocaleString()}{' '}
      <small className="scoreboard-stat-share">
        ({shareOfTeam(value, total)})
      </small>
    </span>
  );
  return (
    <td align="right">
      {tooltip ? (
        <Tippy duration={0} placement="top" content={tooltip}>
          {inner}
        </Tippy>
      ) : (
        inner
      )}
    </td>
  );
};

const TeamSection = ({
  entries,
  realm,
  sortDirection,
  sortKey,
  onSort,
}: {
  entries: ScenarioScoreboardEntryFragment[];
  realm: 'order' | 'destruction';
  sortDirection: 'asc' | 'desc';
  sortKey: StatKey;
  onSort: (key: StatKey) => void;
}): ReactElement => {
  const { t } = useTranslation(['components']);

  const statLabels: Record<StatKey, string> = {
    damage: t('components:scenarioScoreboard.damage'),
    deathBlows: t('components:scenarioScoreboard.dbs'),
    deaths: t('components:scenarioScoreboard.deaths'),
    healing: t('components:scenarioScoreboard.healing'),
    killDamage: t('components:scenarioScoreboard.killDamage'),
    kills: t('components:scenarioScoreboard.kills'),
    objectiveScore: t('components:scenarioScoreboard.objectiveScore'),
    protection: t('components:scenarioScoreboard.protection'),
  };

  const totals = STAT_KEYS.reduce(
    (acc, key) => {
      acc[key] = entries.reduce((sum, entry) => sum + Number(entry[key]), 0);
      return acc;
    },
    {} as Record<StatKey, number>,
  );

  const roleGroups = scenarioRoleOrder
    .map((role) => ({
      role,
      roleEntries: entries
        .filter((entry) => scenarioCareerRoles[entry.character.career] === role)
        .toSorted((left, right) => {
          const comparison = Number(left[sortKey]) - Number(right[sortKey]);
          return sortDirection === 'asc' ? comparison : -comparison;
        }),
    }))
    .filter((group) => group.roleEntries.length > 0);

  return (
    <section
      className={`scenario-scoreboard-team scenario-scoreboard-team-${realm}`}
    >
      <header className="scenario-scoreboard-team-header">
        <img
          src={assetUrl(`/images/icons/scenario/${realm}.png`)}
          width={32}
          height={32}
          alt={realm}
        />
        <strong>{realm === 'order' ? 'Order' : 'Destruction'}</strong>
        <span>{entries.length} players</span>
      </header>
      <div className="scenario-roster-totals">
        {STAT_KEYS.map((key) => (
          <span key={key}>
            <strong>{totals[key].toLocaleString()}</strong>
            {statLabels[key]}
          </span>
        ))}
      </div>
      {roleGroups.map(({ role, roleEntries }) => (
        <div className="table-container mb-4" key={role}>
          <table className="table is-fullwidth scenario-scoreboard-table">
            <thead>
              <tr className="scenario-role-heading">
                <th colSpan={4 + STAT_KEYS.length}>
                  {role} ({roleEntries.length})
                </th>
              </tr>
              <tr>
                <th aria-label={t('components:scenarioScoreboard.career')} />
                <th>{t('components:scenarioScoreboard.name')}</th>
                <th colSpan={2}>{t('components:scenarioScoreboard.guild')}</th>
                {STAT_KEYS.map((key) => (
                  <th
                    key={key}
                    align="right"
                    className="is-clickable has-text-link"
                    onClick={() => {
                      onSort(key);
                    }}
                  >
                    {statLabels[key]}
                    {sortKey === key && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roleEntries.map((entry) => (
                <tr key={entry.character.id}>
                  <td>
                    <CareerIcon career={entry.character.career} />
                  </td>
                  <td>
                    <Link to={`/character/${entry.character.id}`}>
                      {entry.character.name}
                    </Link>
                    <small>
                      CR {entry.level} · RR {entry.renownRank}
                    </small>
                  </td>
                  <td>
                    {entry.guild && (
                      <Link to={`/guild/${entry.guild.id}`}>
                        <GuildHeraldry
                          size="24"
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
                  <StatCell
                    total={totals.kills}
                    value={entry.kills}
                    tooltip={
                      <div className="scoreboard-tooltip">
                        Solo Kills: {entry.killsSolo}
                      </div>
                    }
                  />
                  <StatCell
                    total={totals.deaths}
                    value={entry.deaths}
                    tooltip={
                      <div className="scoreboard-tooltip">
                        Damage Receive: {entry.damageReceived}
                        <br />
                        Healing Received: {entry.healingReceived}
                        <br />
                        Protection Received: {entry.protectionReceived}
                      </div>
                    }
                  />
                  <StatCell
                    total={totals.deathBlows}
                    value={entry.deathBlows}
                  />
                  <StatCell
                    total={totals.damage}
                    value={Number(entry.damage)}
                  />
                  <StatCell
                    total={totals.killDamage}
                    value={Number(entry.killDamage)}
                  />
                  <StatCell
                    total={totals.healing}
                    value={Number(entry.healing)}
                    tooltip={
                      <div className="scoreboard-tooltip">
                        Healing of Self: {entry.healingSelf}
                        <br />
                        Healing of Others: {entry.healingOthers}
                        <br />
                        Resurrections Done: {entry.resurrectionsDone}
                      </div>
                    }
                  />
                  <StatCell
                    total={totals.protection}
                    value={Number(entry.protection)}
                    tooltip={
                      <div className="scoreboard-tooltip">
                        Protection of Self: {entry.protectionSelf}
                        <br />
                        Protection of Others: {entry.protectionOthers}
                      </div>
                    }
                  />
                  <StatCell
                    total={totals.objectiveScore}
                    value={Number(entry.objectiveScore)}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
};

export const ScenarioScoreboard = ({
  entries,
}: {
  entries: ScenarioScoreboardEntryFragment[];
}): ReactElement => {
  const [sortKey, setSortKey] = useState<StatKey>('killDamage');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: StatKey): void => {
    if (key === sortKey) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const orderEntries = entries.filter((entry) => entry.team === 0);
  const destructionEntries = entries.filter((entry) => entry.team === 1);

  return (
    <div className="scenario-scoreboard-teams">
      <TeamSection
        entries={orderEntries}
        realm="order"
        sortDirection={sortDirection}
        sortKey={sortKey}
        onSort={handleSort}
      />
      <TeamSection
        entries={destructionEntries}
        realm="destruction"
        sortDirection={sortDirection}
        sortKey={sortKey}
        onSort={handleSort}
      />
    </div>
  );
};
