import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import type { ReactElement } from 'react';
import './Storylines.scss';
import type { GetWarJournalStorylinesQuery } from '@/__generated__/graphql';

const WAR_JOURNAL_STORYLINES = gql`
  query GetWarJournalStorylines {
    warJournalStorylines {
      id
      name
      summary
      entries {
        id
        name
      }
    }
  }
`;

export const Storylines = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { loading, error, data } = useQuery<GetWarJournalStorylinesQuery>(
    WAR_JOURNAL_STORYLINES,
  );
  const [search, setSearch] = useState('');

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.warJournalStorylines == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const storylines = data.warJournalStorylines;
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredStorylines = storylines.filter((storyline) =>
    [storyline.name, storyline.summary, ...storyline.entries.map(({ name }) => name)]
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalizedSearch),
  );

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/storylines">{t('pages:warJournalStorylines.title')}</Link>
          </li>
        </ul>
      </nav>

      <section className="card mb-5" aria-labelledby="storylines-title">
        <div className="card-content">
          <div className="columns is-vcentered">
            <div className="column is-two-fifths">
              <h1 id="storylines-title" className="title is-3 is-family-secondary has-text-info">
                {t('pages:warJournalStorylines.title')}
              </h1>
              <p>{t('pages:warJournalStorylines.intro')}</p>
            </div>
            <div className="column">
              <label className="label" htmlFor="storyline-search">
                {t('pages:warJournalStorylines.search')}
              </label>
              <input
                id="storyline-search"
                className="input"
                type="search"
                value={search}
                placeholder={t('pages:warJournalStorylines.searchPlaceholder')}
                onChange={(event) => setSearch(event.currentTarget.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <p className="has-text-grey mb-3">
        {t('pages:warJournalStorylines.resultCount', {
          count: filteredStorylines.length,
          total: storylines.length,
        })}
      </p>

      {filteredStorylines.length > 0 ? (
        <div className="columns is-multiline storyline-cards">
          {filteredStorylines.map((storyline) => {
            const sameName = storylines.filter(
              (candidate) => candidate.name === storyline.name,
            );
            const distinguishingEntries =
              sameName.length > 1
                ? storyline.entries.filter(
                    (storylineEntry) =>
                      !sameName.some(
                        (candidate) =>
                          candidate.id !== storyline.id &&
                          candidate.entries.some(
                            (candidateEntry) =>
                              candidateEntry.name === storylineEntry.name,
                          ),
                      ),
                  )
                : [];

            return (
              <div className="column is-12-tablet is-6-desktop" key={storyline.id}>
                <article className="card is-flex is-flex-direction-column" style={{ height: '100%' }}>
                  <div className="card-content is-flex-grow-1">
                    <h2 className="title is-4 is-family-secondary">
                      <Link to={`/storylines/${storyline.id}`}>{storyline.name}</Link>
                    </h2>
                    <p>{storyline.summary}</p>
                    {distinguishingEntries.length > 0 && (
                      <p className="is-size-7 has-text-grey mt-3">
                        {t('pages:warJournalStorylines.distinguishingEntries', {
                          entries: distinguishingEntries
                            .map(({ name }) => name)
                            .join(', '),
                        })}
                      </p>
                    )}
                  </div>
                  <footer className="card-footer">
                    <Link
                      className="card-footer-item"
                      to={`/storylines/${storyline.id}`}
                    >
                      {t('pages:warJournalStorylines.viewEntries', {
                        count: storyline.entries.length,
                      })}
                    </Link>
                  </footer>
                </article>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="notification is-dark">
          {t('pages:warJournalStorylines.noResults')}
        </div>
      )}
    </div>
  );
};
