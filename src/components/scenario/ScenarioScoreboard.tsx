import { Link } from 'react-router';
import Tippy from '@tippyjs/react';
import { useTranslation } from 'react-i18next';
import { Career } from '@/__generated__/graphql';
import type { ScenarioScoreboardEntryFragment } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { useSortableData } from '@/hooks/useSortableData';
import type { ReactElement } from 'react';
import './ScenarioScoreboard.scss';

export const ScenarioScoreboard = ({
  entries,
}: {
  entries: ScenarioScoreboardEntryFragment[];
}): ReactElement => {
  const { items, requestSort, sortConfig } = useSortableData(entries);
  const { t } = useTranslation(['components', 'enums', 'pages']);
  const quitterCount = entries.filter((entry) => entry.quitter).length;
  const tankCareers = new Set<Career>([
    Career.BlackGuard, Career.BlackOrc, Career.Chosen, Career.IronBreaker,
    Career.KnightOfTheBlazingSun, Career.SwordMaster,
  ]);
  const meleeDpsCareers = new Set<Career>([
    Career.Choppa, Career.Slayer, Career.Marauder, Career.WitchElf,
    Career.WitchHunter, Career.WhiteLion,
  ]);
  const rangedDpsCareers = new Set<Career>([
    Career.BrightWizard, Career.Engineer, Career.Magus, Career.ShadowWarrior,
    Career.Sorcerer, Career.SquigHerder,
  ]);
  const meleeHealerCareers = new Set<Career>([
    Career.DiscipleOfKhaine, Career.WarriorPriest,
  ]);
  const healerCareers = new Set<Career>([
    Career.Archmage, Career.DiscipleOfKhaine, Career.RunePriest,
    Career.Shaman, Career.WarriorPriest, Career.Zealot,
  ]);
  const compositionRoles = ['tank', 'healer', 'meleeDps', 'rangedDps'] as const;
  const compositionByTeam = ([0, 1] as const).map((team) => {
    const teamEntries = entries.filter((entry) => entry.team === team);
    const groups = new Map<(typeof compositionRoles)[number], Map<Career, number>>(
      compositionRoles.map((role) => [role, new Map()]),
    );
    teamEntries.forEach((entry) => {
      const career = entry.character.career;
      let role: (typeof compositionRoles)[number];
      if (tankCareers.has(career)) role = 'tank';
      else if (meleeDpsCareers.has(career)) role = 'meleeDps';
      else if (rangedDpsCareers.has(career)) role = 'rangedDps';
      else if (healerCareers.has(career)) {
        const killDamage = Number(entry.killDamage);
        const healing = Number(entry.healing);
        if (killDamage > healing) {
          role = meleeHealerCareers.has(career) ? 'meleeDps' : 'rangedDps';
        } else {
          role = 'healer';
        }
      } else {
        // Keep unknown future careers visible instead of silently dropping them.
        role = 'healer';
      }
      const careers = groups.get(role)!;
      careers.set(career, (careers.get(career) ?? 0) + 1);
    });
    return {
      team,
      playerCount: teamEntries.length,
      roles: compositionRoles.map((role) => {
        const careers = [...groups.get(role)!.entries()].sort(
          ([careerA, countA], [careerB, countB]) =>
            countB - countA ||
            t(`enums:career.${careerA}`).localeCompare(
              t(`enums:career.${careerB}`),
            ),
        );
        return {
          role,
          count: careers.reduce((total, [, count]) => total + count, 0),
          careers,
        };
      }),
    };
  });
  const highlightMetrics = [
    {
      key: 'deathBlows',
      label: t('components:scenarioScoreboard.dbs'),
      value: (entry: ScenarioScoreboardEntryFragment) => entry.deathBlows,
    },
    {
      key: 'killDamage',
      label: t('components:scenarioScoreboard.killDamage'),
      value: (entry: ScenarioScoreboardEntryFragment) =>
        Number(entry.killDamage),
    },
    {
      key: 'healing',
      label: t('components:scenarioScoreboard.healing'),
      value: (entry: ScenarioScoreboardEntryFragment) => Number(entry.healing),
    },
    {
      key: 'protection',
      label: t('components:scenarioScoreboard.protection'),
      value: (entry: ScenarioScoreboardEntryFragment) =>
        Number(entry.protection),
    },
    {
      key: 'objectiveScore',
      label: t('components:scenarioScoreboard.objectiveScore'),
      value: (entry: ScenarioScoreboardEntryFragment) =>
        Number(entry.objectiveScore),
    },
  ];
  const matchLeaders = highlightMetrics.flatMap((metric) => {
    const value = Math.max(0, ...entries.map(metric.value));
    if (value === 0) return [];
    return [{
      ...metric,
      value,
      leaders: entries.filter((entry) => metric.value(entry) === value),
    }];
  });

  const getClassName = (name: string) => {
    if (!sortConfig) {
      return '';
    }
    return sortConfig.key === name ? sortConfig.direction : '';
  };

  return (
    <>
      <p className="has-text-grey is-size-7 mb-2">
        {t('components:scenarioScoreboard.quittersSummary', {
          count: quitterCount,
        })}
      </p>
      <section
        className="scenario-team-composition mb-4"
        aria-label={t('components:scenarioScoreboard.teamComposition')}
      >
        <h2 className="title is-5 mb-2">
          {t('components:scenarioScoreboard.teamComposition')}
        </h2>
        <p className="has-text-grey is-size-7 mb-3">
          {t('components:scenarioScoreboard.teamCompositionNote')}
        </p>
        <div className="columns is-variable is-3 mb-0">
          {compositionByTeam.map(({ team, playerCount, roles }) => (
            <div className="column pt-2 pb-2" key={team}>
              <div className={`scenario-team-composition__side scenario-team-composition__side--${team}`}>
                <h3 className="has-text-weight-bold mb-2">
                  {team === 0
                    ? t('pages:scenarioPage.order')
                    : t('pages:scenarioPage.destruction')}{' '}
                  <span className="has-text-grey is-size-7">
                    ({playerCount})
                  </span>
                </h3>
                {playerCount > 0 ? (
                  <div className="scenario-team-composition__roles">
                    {roles.map(({ role, count, careers }) => (
                      <div className="scenario-team-composition__role" key={role}>
                        <h4 className="has-text-weight-semibold mb-1">
                          {t(`components:scenarioScoreboard.roles.${role}`)}{' '}
                          <span className="has-text-grey is-size-7">({count})</span>
                        </h4>
                        {careers.length > 0 ? (
                          <ul className="scenario-team-composition__careers">
                            {careers.map(([career, careerCount]) => (
                              <li key={career}>
                                <CareerIcon career={career} />
                                <span>
                                  {career === Career.KnightOfTheBlazingSun
                                    ? 'Knight'
                                    : t(`enums:career.${career}`)}
                                </span>
                                <span className="tag is-dark">{careerCount}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="has-text-grey is-size-7 mb-0">—</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="has-text-grey is-size-7">
                    {t('components:scenarioScoreboard.noRecordedPlayers')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      {matchLeaders.length > 0 && (
        <section
          className="scenario-match-leaders mb-4"
          aria-label={t('components:scenarioScoreboard.matchLeaders')}
        >
          <h2 className="title is-5 mb-2">
            {t('components:scenarioScoreboard.matchLeaders')}
          </h2>
          <p className="has-text-grey is-size-7 mb-3">
            {t('components:scenarioScoreboard.matchLeadersNote')}
          </p>
          <div className="columns is-multiline is-variable is-2">
            {matchLeaders.map((highlight) => (
              <div
                className="column is-6-tablet is-4-widescreen"
                key={highlight.key}
              >
                <div className="scenario-match-leaders__card">
                  <p className="has-text-grey is-size-7 mb-1">
                    {highlight.label}
                  </p>
                  <p className="has-text-weight-bold mb-1">
                    {highlight.value.toLocaleString()}
                  </p>
                  <p className="scenario-match-leaders__names mb-0">
                    {highlight.leaders.map((leader, index) => (
                      <span key={leader.character.id}>
                        {index > 0 && ', '}
                        <Link to={`/character/${leader.character.id}`}>
                          {leader.character.name}
                        </Link>
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
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
                {entry.quitter && (
                  <span className="tag is-warning is-light is-small ml-2">
                    {t('components:scenarioScoreboard.quitter')}
                  </span>
                )}
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
    </>
  );
};
