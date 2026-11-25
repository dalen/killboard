import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';

const INSTANCE_RECENT_LEADERBOARD = gql`
  query InstanceRecentLeaderboard($instanceId: ID!) {
    instanceRuns(
      first: 50
      where: { instanceId: { eq: $instanceId } }
      order: { start: DESC }
    ) {
      nodes {
        id
        encounters {
          id
          encounterId
          start
          end
          completed
          encounter {
            name
          }
          scoreboardEntries {
            character {
              id
              name
            }
          }
        }
      }
    }
  }
`;

interface EncounterRecord {
  id: string;
  encounterId: string;
  name: string;
  durationMs: number;
  endedAt: string;
  runId: string;
  participants: { id: string; name: string }[];
}

export const InstanceRecentLeaderboard = ({
  instanceId,
}: {
  instanceId: string;
}) => {
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<Query>(
    INSTANCE_RECENT_LEADERBOARD,
    { variables: { instanceId } },
  );

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const records = new Map<string, EncounterRecord>();
  for (const run of data?.instanceRuns?.nodes ?? []) {
    const { id: runId, encounters } = run;
    for (const encounterRun of encounters) {
      const {
        id,
        encounterId,
        start,
        end,
        completed,
        encounter,
        scoreboardEntries,
      } = encounterRun;
      const durationMs =
        new Date(end).getTime() - new Date(start).getTime();
      if (completed && encounter && durationMs > 0) {
        const previous = records.get(encounterId);
        if (!previous || durationMs < previous.durationMs) {
          records.set(encounterId, {
            id,
            encounterId,
            name: encounter.name,
            durationMs,
            endedAt: end,
            runId,
            participants: scoreboardEntries.map(({ character }) => ({
              id: character.id,
              name: character.name,
            })),
          });
        }
      }
    }
  }

  const entries = [...records.values()].toSorted(
    (left, right) => left.durationMs - right.durationMs,
  );
  if (entries.length === 0) {
    return <p>{t('common:noResults')}</p>;
  }

  return (
    <>
      <p className="mb-3">{t('pages:instanceHub.recentLeaderboardNote')}</p>
      <div className="table-container">
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>{t('pages:instanceHub.encounter')}</th>
              <th>{t('pages:instanceHub.fastestDuration')}</th>
              <th>{t('pages:instanceHub.recordDate')}</th>
              <th>{t('pages:instanceHub.recordGroup')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {entries.map((record) => (
              <tr key={record.encounterId}>
                <td>{record.name}</td>
                <td>
                  {formatDuration(
                    intervalToDuration({
                      start: 0,
                      end: record.durationMs,
                    }),
                  )}
                </td>
                <td>{format(new Date(record.endedAt), 'yyyy-MM-dd HH:mm')}</td>
                <td>
                  {record.participants.map((character, index) => (
                    <span key={character.id}>
                      {index > 0 && ', '}
                      <Link to={`/character/${character.id}`}>
                        {character.name}
                      </Link>
                    </span>
                  ))}
                </td>
                <td>
                  <Link
                    className="button is-small"
                    to={`/instance-run/${record.runId}/${record.id}`}
                  >
                    {t('pages:instanceHub.viewRun')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
