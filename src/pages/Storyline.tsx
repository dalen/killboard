import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import type { ReactElement } from 'react';
import type { GetWarJournalStorylineQuery } from '@/__generated__/graphql';
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
        zone {
          id
          name
        }
        area {
          id
          name
        }
      }
    }
  }
`;

type EntryFilters = {
  query: string;
  zone: string;
  area: string;
  rvr: string;
};

const readFilters = (search: URLSearchParams): EntryFilters => ({
  query: search.get('q') ?? '',
  zone: search.get('zone') ?? '',
  area: search.get('area') ?? '',
  rvr: search.get('rvr') ?? 'all',
});

export const Storyline = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<GetWarJournalStorylineQuery>(
    WAR_JOURNAL_STORYLINE_DETAILS,
    {
      variables: { id },
    },
  );
  const [search, setSearch] = useSearchParams();
  const [draftFilters, setDraftFilters] = useState(() => readFilters(search));
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  useEffect(() => {
    setDraftFilters(readFilters(search));
  }, [search]);

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const storyline = data?.warJournalStoryline;
  if (storyline == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const zones = [
    ...new Map(
      storyline.entries
        .filter((entry) => entry.zone != null)
        .map((entry) => [entry.zone!.id, entry.zone!.name] as const),
    ),
  ].sort((a, b) => a[1].localeCompare(b[1]));
  const areas = [
    ...new Map(
      storyline.entries
        .filter((entry) => entry.area?.name)
        .map((entry) => [entry.area!.id, entry.area!.name!] as const),
    ),
  ].sort((a, b) => a[1].localeCompare(b[1]));
  const appliedFilters = readFilters(search);
  const normalizedQuery = appliedFilters.query.trim().toLocaleLowerCase();
  const filteredEntries = storyline.entries
    .map((entry, index) => ({ entry, number: index + 1 }))
    .filter(({ entry }) => {
      const matchesQuery =
        !normalizedQuery ||
        entry.name.toLocaleLowerCase().includes(normalizedQuery) ||
        entry.zone?.name.toLocaleLowerCase().includes(normalizedQuery) ||
        entry.area?.name?.toLocaleLowerCase().includes(normalizedQuery);
      const matchesZone = !appliedFilters.zone || entry.zone?.id === appliedFilters.zone;
      const matchesArea = !appliedFilters.area || entry.area?.id === appliedFilters.area;
      const matchesRvR =
        appliedFilters.rvr === 'all' ||
        (appliedFilters.rvr === 'rvr' ? entry.isRvR : !entry.isRvR);

      return matchesQuery && matchesZone && matchesArea && matchesRvR;
    });

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (draftFilters.query.trim()) next.set('q', draftFilters.query.trim());
    if (draftFilters.zone) next.set('zone', draftFilters.zone);
    if (draftFilters.area) next.set('area', draftFilters.area);
    if (draftFilters.rvr !== 'all') next.set('rvr', draftFilters.rvr);
    setSearch(next);
  };

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
            <Link to={`/storylines/${id}`}>{storyline.name}</Link>
          </li>
        </ul>
      </nav>

      <section className="card mb-5" aria-labelledby="storyline-title">
        <div className="card-content">
          <h1
            id="storyline-title"
            className="title is-3 is-family-secondary has-text-info"
          >
            {storyline.name}
          </h1>
          <p>{storyline.summary}</p>
          <p className="has-text-grey mt-3">
            {t('pages:warJournalStoryline.entryCount', {
              count: storyline.entries.length,
            })}
          </p>
        </div>
      </section>

      <form className="card mb-4" onSubmit={applyFilters}>
        <div className="card-content">
          <div className="columns is-multiline">
            <div className="column is-12-tablet is-6-desktop">
              <label className="label" htmlFor="storyline-entry-search">
                {t('pages:warJournalStoryline.search')}
              </label>
              <input
                id="storyline-entry-search"
                className="input"
                type="search"
                value={draftFilters.query}
                placeholder={t('pages:warJournalStoryline.searchPlaceholder')}
                onChange={(event) =>
                  setDraftFilters({ ...draftFilters, query: event.currentTarget.value })
                }
              />
            </div>
            <div className="column is-6-tablet is-3-desktop">
              <label className="label" htmlFor="storyline-zone-filter">
                {t('pages:warJournalStoryline.zone')}
              </label>
              <div className="select is-fullwidth">
                <select
                  id="storyline-zone-filter"
                  value={draftFilters.zone}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, zone: event.currentTarget.value })
                  }
                >
                  <option value="">{t('pages:warJournalStoryline.allZones')}</option>
                  {zones.map(([zoneId, zoneName]) => (
                    <option key={zoneId} value={zoneId}>
                      {zoneName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="column is-6-tablet is-3-desktop">
              <label className="label" htmlFor="storyline-area-filter">
                {t('pages:warJournalStoryline.area')}
              </label>
              <div className="select is-fullwidth">
                <select
                  id="storyline-area-filter"
                  value={draftFilters.area}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, area: event.currentTarget.value })
                  }
                >
                  <option value="">{t('pages:warJournalStoryline.allAreas')}</option>
                  {areas.map(([areaId, areaName]) => (
                    <option key={areaId} value={areaId}>
                      {areaName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="column is-6-tablet is-3-desktop">
              <label className="label" htmlFor="storyline-rvr-filter">
                {t('pages:warJournalStoryline.mode')}
              </label>
              <div className="select is-fullwidth">
                <select
                  id="storyline-rvr-filter"
                  value={draftFilters.rvr}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, rvr: event.currentTarget.value })
                  }
                >
                  <option value="all">{t('pages:warJournalStoryline.allEntries')}</option>
                  <option value="rvr">{t('pages:warJournalStoryline.rvrEntries')}</option>
                  <option value="pve">{t('pages:warJournalStoryline.pveEntries')}</option>
                </select>
              </div>
            </div>
            <div className="column is-flex is-align-items-flex-end is-justify-content-flex-end">
              <button className="button is-primary" type="submit">
                {t('pages:warJournalStoryline.applyFilters')}
              </button>
            </div>
          </div>
        </div>
      </form>

      <p className="has-text-grey mb-3">
        {t('pages:warJournalStoryline.filteredEntryCount', {
          count: filteredEntries.length,
          total: storyline.entries.length,
        })}
      </p>

      {filteredEntries.length > 0 ? (
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
                <th>{t('pages:warJournalStoryline.location')}</th>
                <th>{t('pages:warJournalStoryline.mode')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(({ entry, number }) => (
                <tr key={entry.id}>
                  <td>{number}</td>
                  <td>
                    <Link to={`/storylines/${storyline.id}/${entry.id}`}>
                      {entry.name}
                    </Link>
                  </td>
                  <td>
                    {[entry.area?.name, entry.zone?.name].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td>
                    {entry.isRvR ? (
                      <span className="tag is-warning is-light">{t('pages:warJournalStoryline.rvr')}</span>
                    ) : (
                      <span className="has-text-grey">{t('pages:warJournalStoryline.pve')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="notification is-dark">
          {t('pages:warJournalStoryline.noResults')}
        </div>
      )}
    </div>
  );
};
