import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import type { ReactElement } from 'react';
import type { GetWarJournalActivityQuery } from '@/__generated__/graphql';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import clsx from 'clsx';

const WAR_JOURNAL_ENTRY_DETAILS = gql`
  query GetWarJournalActivity($id: ID!) {
    warJournalEntry(id: $id) {
      id
      storyline {
        name
      }
      name
      activities {
        id
        name
        text
        activityType
        zone {
          id
          name
        }
        tasks {
          name
          text
        }
      }
    }
  }
`;

export const StorylineActivity = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { id, storylineId, storylineEntryId } = useParams();
  const { loading, error, data } = useQuery<GetWarJournalActivityQuery>(
    WAR_JOURNAL_ENTRY_DETAILS,
    {
      variables: { id: storylineEntryId },
    },
  );
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const storylineEntry = data?.warJournalEntry;
  if (storylineEntry == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const entry = storylineEntry.activities.find(
    (activity) => activity.id === id,
  );
  if (entry == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/storylines">{t('common:storylines')}</Link>
          </li>
          <li>
            <Link to={`/storylines/${storylineId}`}>
              {t('pages:warJournalStorylineActivity.storylineName', {
                storylineName: storylineEntry.storyline.name,
              })}
            </Link>
          </li>
          <li>
            <Link to={`/storylines/${storylineId}/${storylineEntryId}`}>
              {t('pages:warJournalStorylineActivity.storylineEntryName', {
                storylineEntryName: storylineEntry.name,
              })}
            </Link>
          </li>
          <li className="is-active">
            <Link to={`/storylines/${storylineId}/${storylineEntryId}/${id}`}>
              {t('pages:warJournalStorylineActivity.storylineActivityName', {
                storylineActivityName: entry.name,
              })}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <h1 className="title is-3 is-family-secondary has-text-info">
            {entry.name}
          </h1>
          <div className="tags mb-3">
            <span className="tag is-warning is-light">{entry.activityType}</span>
            {entry.zone?.name && <span className="tag is-dark">{entry.zone.name}</span>}
          </div>
          {entry.text && (
            <div className="content" dangerouslySetInnerHTML={{ __html: entry.text }} />
          )}
        </div>
      </div>

      {entry.tasks.length > 0 ? (
        <div className="table-container">
          <table
            className={clsx(
              'table',
              'is-striped',
              'is-hoverable',
              isMobile ? 'is-narrow' : 'is-fullwidth',
            )}
          >
            <thead>
              <tr>
                <th>{t('pages:warJournalStorylineActivity.taskNumber')}</th>
                <th>{t('pages:warJournalStorylineActivity.taskName')}</th>
              </tr>
            </thead>
            <tbody>
              {entry.tasks.map((task, index) => (
                <tr key={`${entry.id}-${index}`}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{task.name}</strong>
                    {task.text && (
                      <div
                        className="content is-small mt-1 mb-0"
                        dangerouslySetInnerHTML={{ __html: task.text }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="notification is-dark">
          {t('pages:warJournalStorylineActivity.noTasks')}
        </div>
      )}
    </div>
  );
};
