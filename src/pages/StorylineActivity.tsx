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
          <p className="is-size-4 is-family-secondary has-text-info">
            {entry.name}
          </p>
          <p className="is-size-5 is-family-secondary has-text-primary">
            {entry.activityType}
          </p>
          {entry.text && <p dangerouslySetInnerHTML={{ __html: entry.text }} />}
        </div>
      </div>

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
              <tr key={task.name}>
                <td>{index + 1}</td>
                <td>{task.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
