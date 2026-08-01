import { Link } from 'react-router';
import { Fragment, type ReactElement } from 'react';
import type { ScenarioScoreboardEntry } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import {
  scenarioCareerName,
  scenarioCareerRoles,
  scenarioRoleOrder,
} from '@/components/scenario/scenarioRoles';
import { assetUrl } from '@/utils';

const formatNumber = (value: number): string =>
  new Intl.NumberFormat('en', { notation: 'compact' }).format(value);

const RealmRoster = ({
  entries,
  name,
  realm,
}: {
  entries: ScenarioScoreboardEntry[];
  name: string;
  realm: 'order' | 'destruction';
}): ReactElement => {
  const totals = entries.reduce(
    (result, entry) => ({
      damage: result.damage + entry.damage,
      healing: result.healing + entry.healing,
      kills: result.kills + entry.kills,
      protection: result.protection + entry.protection,
    }),
    { damage: 0, healing: 0, kills: 0, protection: 0 },
  );
  const roleGroups = scenarioRoleOrder.map((role) => ({
    entries: entries.filter(
      (entry) => scenarioCareerRoles[entry.character.career] === role,
    ),
    role,
  }));

  return (
    <details className={`scenario-roster scenario-roster-${realm}`} open>
      <summary>
        <img
          src={assetUrl(`/images/icons/scenario/${realm}.png`)}
          width={36}
          height={36}
          alt={name}
        />
        <div>
          <strong>{name}</strong>
          <span>{entries.length} players</span>
        </div>
      </summary>
      <div className="scenario-roster-content">
        <div className="scenario-role-composition">
          {roleGroups.map(({ entries: roleEntries, role }) => (
            <span key={role}>
              <strong>{roleEntries.length}</strong> {role}
            </span>
          ))}
        </div>
        <div className="scenario-roster-totals">
          <span>
            <strong>{totals.kills}</strong> Kills
          </span>
          <span>
            <strong>{formatNumber(totals.damage)}</strong> Damage
          </span>
          <span>
            <strong>{formatNumber(totals.healing)}</strong> Healing
          </span>
          <span>
            <strong>{formatNumber(totals.protection)}</strong> Protection
          </span>
        </div>
        <div className="table-container">
          <table className="table is-fullwidth is-narrow">
            <thead>
              <tr>
                <th aria-label="Career" />
                <th>Character</th>
                <th align="right">K</th>
                <th align="right">D</th>
                <th align="right">DB</th>
                <th align="right">Dmg</th>
                <th align="right">KDmg</th>
                <th align="right">Heals</th>
                <th align="right">Prot</th>
                <th align="right">Obj</th>
              </tr>
            </thead>
            {roleGroups.map(({ entries: roleEntries, role }) =>
              roleEntries.length > 0 ? (
                <Fragment key={role}>
                  <tbody className="scenario-role-heading">
                    <tr>
                      <th colSpan={10}>
                        {role} ({roleEntries.length})
                        <small>
                          {[
                            ...new Set(
                              roleEntries.map(
                                (entry) => entry.character.career,
                              ),
                            ),
                          ]
                            .map(
                              (career) =>
                                `${scenarioCareerName(career)} ×${
                                  roleEntries.filter(
                                    (entry) =>
                                      entry.character.career === career,
                                  ).length
                                }`,
                            )
                            .join(', ')}
                        </small>
                      </th>
                    </tr>
                  </tbody>
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
                          {entry.guild && (
                            <small>
                              <Link to={`/guild/${entry.guild.id}`}>
                                {entry.guild.name}
                              </Link>
                            </small>
                          )}
                        </td>
                        <td align="right">{entry.kills}</td>
                        <td align="right">{entry.deaths}</td>
                        <td align="right">{entry.deathBlows}</td>
                        <td align="right">{formatNumber(entry.damage)}</td>
                        <td align="right">{formatNumber(entry.killDamage)}</td>
                        <td align="right">{formatNumber(entry.healing)}</td>
                        <td align="right">{formatNumber(entry.protection)}</td>
                        <td align="right">
                          {formatNumber(entry.objectiveScore)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Fragment>
              ) : null,
            )}
          </table>
        </div>
      </div>
    </details>
  );
};

export const ScenarioRosterPreview = ({
  entries,
}: {
  entries: ScenarioScoreboardEntry[];
}): ReactElement => (
  <div className="scenario-roster-preview">
    <RealmRoster
      entries={entries.filter((entry) => entry.team === 0)}
      name="Order"
      realm="order"
    />
    <RealmRoster
      entries={entries.filter((entry) => entry.team === 1)}
      name="Destruction"
      realm="destruction"
    />
  </div>
);
