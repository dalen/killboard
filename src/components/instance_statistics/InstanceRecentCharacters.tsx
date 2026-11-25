import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { format } from 'date-fns';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';

const INSTANCE_RECENT_CHARACTERS = gql`
  query InstanceRecentCharacters($instanceId: ID!) {
    instanceRuns(
      first: 50
      where: { instanceId: { eq: $instanceId } }
      order: { start: DESC }
    ) {
      nodes {
        id
        start
        scoreboardEntries {
          character {
            id
            name
          }
        }
      }
    }
  }
`;

export const InstanceRecentCharacters = ({
  instanceId,
}: {
  instanceId: string;
}) => {
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<Query>(
    INSTANCE_RECENT_CHARACTERS,
    { variables: { instanceId } },
  );

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const runs = data?.instanceRuns?.nodes ?? [];
  const characters = new Map<
    string,
    { id: string; name: string; runs: number; lastSeen: string }
  >();

  for (const run of runs) {
    const { start } = run;
    for (const { character } of run.scoreboardEntries) {
      const existing = characters.get(character.id);
      if (existing) {
        existing.runs += 1;
      } else {
        characters.set(character.id, {
          id: character.id,
          name: character.name,
          runs: 1,
          lastSeen: start,
        });
      }
    }
  }

  const entries = [...characters.values()].toSorted(
    (left, right) => right.runs - left.runs || left.name.localeCompare(right.name),
  );

  if (entries.length === 0) {
    return <p>{t('common:noResults')}</p>;
  }

  return (
    <>
      <p className="mb-3">
        {t('pages:instanceHub.recentCharactersNote', { count: entries.length })}
      </p>
      <div className="table-container">
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>{t('pages:instanceHub.character')}</th>
              <th>{t('pages:instanceHub.recentRuns')}</th>
              <th>{t('pages:instanceHub.lastSeen')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.slice(0, 25).map((character) => (
              <tr key={character.id}>
                <td>
                  <Link to={`/character/${character.id}`}>{character.name}</Link>
                </td>
                <td>{character.runs}</td>
                <td>{format(new Date(character.lastSeen), 'yyyy-MM-dd HH:mm')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
