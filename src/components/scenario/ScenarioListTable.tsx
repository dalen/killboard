import { format, formatDuration, intervalToDuration } from 'date-fns';
import { Link } from 'react-router';
import { type ReactElement, useState } from 'react';
import type { ScenarioRecord } from '@/__generated__/graphql';
import { ScenarioRosterPreview } from '@/components/scenario/ScenarioRosterPreview';
import { assetUrl } from '@/utils';

const RealmScore = ({
  isWinner,
  name,
  points,
  realm,
  surrendered,
}: {
  isWinner: boolean;
  name: string;
  points: number | null;
  realm: 'order' | 'destruction';
  surrendered: boolean;
}): ReactElement => (
  <div
    className={`scenario-card-score scenario-card-score-${realm} ${
      isWinner ? 'is-winner' : ''
    }`}
  >
    <img
      src={assetUrl(`/images/icons/scenario/${realm}.png`)}
      width={42}
      height={42}
      alt={name}
    />
    <div>
      <span>{name}</span>
      <strong>{points ?? 0}</strong>
    </div>
    {surrendered && (
      <img
        src={assetUrl('/images/icons/scenario/surrender.png')}
        width={28}
        height={28}
        title="Surrender"
        alt="Surrender"
      />
    )}
  </div>
);

export const ScenarioListTable = ({
  data,
}: {
  data: ScenarioRecord[];
}): ReactElement => {
  const [expandedScenarioId, setExpandedScenarioId] = useState<string>();

  return (
    <div className="scenario-card-list">
      {data.map((scenario) => {
        const startDate = new Date(scenario.startTime);
        const endDate = new Date(scenario.endTime);
        const isExpanded = expandedScenarioId === scenario.id;
        const duration = formatDuration(
          intervalToDuration({ end: endDate, start: startDate }),
          { format: ['hours', 'minutes', 'seconds'] },
        );
        const orderWon = scenario.points[0] > scenario.points[1];

        return (
          <article className="scenario-match-card" key={scenario.id}>
            <header className="scenario-match-header">
              <div className="scenario-match-title">
                <strong>{scenario.scenario.name}</strong>
                <span>
                  {format(startDate, 'MMM d, yyyy · h:mm a')} · {duration}
                </span>
              </div>
              <div className="scenario-match-tags">
                <span>{scenario.numPlayers} players</span>
                <span>{Number(scenario.numDeaths)} deaths</span>
              </div>
              <div className="scenario-match-score">
                <RealmScore
                  isWinner={orderWon}
                  name="Order"
                  points={scenario.points[0]}
                  realm="order"
                  surrendered={scenario.wasSurrender && !orderWon}
                />
                <RealmScore
                  isWinner={!orderWon}
                  name="Destruction"
                  points={scenario.points[1]}
                  realm="destruction"
                  surrendered={scenario.wasSurrender && orderWon}
                />
              </div>
              <div className="scenario-match-actions">
                <button
                  type="button"
                  className="button is-small"
                  aria-expanded={isExpanded}
                  onClick={() => {
                    setExpandedScenarioId(isExpanded ? undefined : scenario.id);
                  }}
                >
                  {isExpanded ? 'Hide players' : 'Show players'}
                </button>
                <Link
                  to={`/scenario/${scenario.id}`}
                  className="button is-primary is-small"
                >
                  Full details
                </Link>
              </div>
            </header>
            {isExpanded && (
              <div className="scenario-match-rosters">
                <ScenarioRosterPreview entries={scenario.scoreboardEntries} />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};
