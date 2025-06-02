import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ReactElement } from 'react';
import clsx from 'clsx';
import { GetWarJournalStorylinesQuery } from '@/__generated__/graphql';

const WAR_JOURNAL_STORYLINES = gql`
  query GetWarJournalStorylines {
    warJournalStorylines {
      id
      name
    }
  }
`;

export function Storylines(): ReactElement {
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { loading, error, data } = useQuery<GetWarJournalStorylinesQuery>(
    WAR_JOURNAL_STORYLINES,
  );
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.warJournalStorylines == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const entries = data.warJournalStorylines;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/storylines">
              {t('pages:warJournalStorylines.title')}
            </Link>
          </li>
        </ul>
      </nav>

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
              <th>{t('pages:warJournalStorylines.name')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>
                  <Link to={`/storylines/${entry.id}`}>{entry.name}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
