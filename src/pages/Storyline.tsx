import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ReactElement } from 'react';
import { GetWarJournalStorylineQuery } from '@/__generated__/graphql';
import clsx from 'clsx';
import useWindowDimensions from '@/hooks/useWindowDimensions';

const WAR_JOURNAL_STORYLINE_DETAILS = gql`
  query GetWarJournalStoryline($id: ID!) {
    warJournalStoryline(id: $id) {
      id
      name
      summary
      entries {
        id
        name
        isRvR
      }
    }
  }
`;

export function Storyline(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<GetWarJournalStorylineQuery>(
    WAR_JOURNAL_STORYLINE_DETAILS,
    {
      variables: { id },
    },
  );
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const entry = data?.warJournalStoryline;
  if (entry == null) return <ErrorMessage customText={t('common:notFound')} />;

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
          <li className="is-active">
            <Link to={`/storylines/${id}`}>
              {t('pages:warJournalStoryline.storylineName', {
                storylineName: entry.name,
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
          <p>{entry.summary}</p>
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
              <th>{t('pages:warJournalStoryline.entryNumber')}</th>
              <th>{t('pages:warJournalStoryline.entryName')}</th>
            </tr>
          </thead>
          <tbody>
            {entry.entries.map((storylineEntry, index) => (
              <tr key={storylineEntry.id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/storylines/${entry.id}/${storylineEntry.id}`}>
                    {storylineEntry.name}
                  </Link>
                </td>
                <td>
                  {storylineEntry.isRvR && (
                    <img src="/images/icons/rvr.png" alt="RvR" title="RvR" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
