import { Link, useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import type { ReactElement } from 'react';
import type { GetWarJournalEntryQuery } from '@/__generated__/graphql';
import { Career } from '@/__generated__/graphql';
import {
  INFLUENCE_REWARDS_FRAGMENT,
  InfluenceRewards,
} from '@/components/storylineEntry/InfluenceRewards';
import { MapFallback } from '@/components/MapFallback';

const WAR_JOURNAL_ENTRY_DETAILS = gql`
  query GetWarJournalEntry($id: ID!) {
    warJournalEntry(id: $id) {
      storyline {
        name
      }
      id
      name
      locationText
      npcName
      text
      title
      shortTitle
      isRvR
      area {
        id
        name
      }
      zone {
        id
        name
      }
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
      influenceRewards {
        ...ChapterInfluenceReward
      }
    }
  }
  ${INFLUENCE_REWARDS_FRAGMENT}
`;

export const StorylineEntry = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages', 'enums']);
  const { id, storylineId } = useParams();
  const { loading, error, data } = useQuery<GetWarJournalEntryQuery>(
    WAR_JOURNAL_ENTRY_DETAILS,
    {
      variables: { id },
    },
  );
  const [search, setSearch] = useSearchParams();

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const entry = data?.warJournalEntry;
  if (entry == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const activities = entry.activities.filter((activity) => activity.name);

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
              {t('pages:warJournalStoryline.storylineName', {
                storylineName: entry.storyline.name,
              })}
            </Link>
          </li>
          <li className="is-active">
            <Link to={`/storylines/${storylineId}/${id}`}>{entry.name}</Link>
          </li>
        </ul>
      </nav>

      <section className="card mb-5" aria-labelledby="storyline-entry-title">
        <div className="card-content">
          <div className="is-flex is-justify-content-space-between is-align-items-flex-start is-flex-wrap-wrap">
            <div>
              <h1
                id="storyline-entry-title"
                className="title is-3 is-family-secondary has-text-info"
              >
                {entry.name}
              </h1>
              {entry.title && entry.title !== entry.name && (
                <p className="is-size-5 is-family-secondary has-text-primary">
                  {entry.title}
                </p>
              )}
              {entry.shortTitle && entry.shortTitle !== entry.title && (
                <p className="has-text-grey">{entry.shortTitle}</p>
              )}
            </div>
            {entry.isRvR && (
              <span className="tag is-warning is-light">
                {t('pages:warJournalStoryline.rvr')}
              </span>
            )}
          </div>
          {entry.text && (
            <div
              className="content mt-4"
              dangerouslySetInnerHTML={{ __html: entry.text }}
            />
          )}
        </div>
      </section>

      {(entry.npcName || entry.locationText || entry.zone || entry.area) && (
        <div className="columns is-variable is-4 mb-2">
          <div className="column is-5">
            <section className="card mb-5" aria-labelledby="quest-location-title">
              <div className="card-content">
                <h2
                  id="quest-location-title"
                  className="title is-4 is-family-secondary has-text-info"
                >
                  {t('pages:warJournalStoryline.questLocation')}
                </h2>
                {entry.npcName && (
                  <p className="is-size-5 has-text-primary">{entry.npcName}</p>
                )}
                {entry.area?.name && <p>{entry.area.name}</p>}
                {entry.zone?.name && (
                  <p className="has-text-grey">{entry.zone.name}</p>
                )}
                {entry.locationText && (
                  <p className="mt-3">{entry.locationText}</p>
                )}
              </div>
            </section>
          </div>
          {entry.zone && (
            <div className="column">
              <section className="card mb-5" aria-labelledby="quest-zone-map-title">
                <div className="card-content">
                  <h2
                    id="quest-zone-map-title"
                    className="title is-4 is-family-secondary has-text-info"
                  >
                    {t('pages:warJournalStoryline.zoneMap', {
                      zone: entry.zone.name,
                    })}
                  </h2>
                  <MapFallback
                    zoneId={entry.zone.id}
                    zoneName={entry.zone.name}
                    mapUnavailableText={t('pages:warJournalStoryline.mapUnavailable')}
                    markersUnavailableText={t(
                      'pages:warJournalStoryline.mapHasNoQuestGiverPin',
                    )}
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      {activities.length > 0 && (
        <section className="card mb-5" aria-labelledby="storyline-activities-title">
          <div className="card-content">
            <div className="is-flex is-justify-content-space-between is-align-items-baseline is-flex-wrap-wrap mb-3">
              <h2
                id="storyline-activities-title"
                className="title is-4 is-family-secondary has-text-info mb-2"
              >
                {t('pages:warJournalStoryline.objectives')}
              </h2>
              <span className="has-text-grey">
                {t('pages:warJournalStoryline.activityCount', {
                  count: activities.length,
                })}
              </span>
            </div>

            {activities.map((activity, index) => (
              <details className="storyline-activity mb-3" key={activity.id}>
                <summary
                  className="is-clickable p-3"
                  style={{ backgroundColor: 'rgba(12, 14, 17, 0.85)' }}
                >
                  <span className="has-text-weight-semibold">
                    {index + 1}. {activity.name}
                  </span>
                  <span className="tag is-dark ml-2">{activity.activityType}</span>
                  {activity.tasks.length > 0 && (
                    <span className="has-text-grey ml-2">
                      {t('pages:warJournalStoryline.taskCount', {
                        count: activity.tasks.length,
                      })}
                    </span>
                  )}
                  {activity.zone?.name && (
                    <span className="has-text-grey ml-2">{activity.zone.name}</span>
                  )}
                </summary>
                <div className="content p-4">
                  {activity.text && (
                    <div dangerouslySetInnerHTML={{ __html: activity.text }} />
                  )}
                  {activity.tasks.length > 0 && (
                    <ol>
                      {activity.tasks.map((task, taskIndex) => (
                        <li key={`${activity.id}-${taskIndex}`}>
                          <span className="has-text-weight-semibold">{task.name}</span>
                          {task.text && (
                            <div dangerouslySetInnerHTML={{ __html: task.text }} />
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                  <Link
                    className="button is-small is-primary mt-2"
                    to={`/storylines/${storylineId}/${entry.id}/${activity.id}`}
                  >
                    {t('pages:warJournalStoryline.openActivity')}
                  </Link>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {entry.influenceRewards.length > 0 && (
        <section className="card mb-5" aria-labelledby="influence-rewards-title">
          <div className="card-content">
            <div className="columns is-vcentered">
              <div className="column">
                <h2
                  id="influence-rewards-title"
                  className="title is-4 is-family-secondary has-text-info"
                >
                  {t('pages:warJournalStoryline.influenceRewards')}
                </h2>
              </div>
              <div className="column is-5">
                <label className="label" htmlFor="storyline-career-filter">
                  {t('pages:warJournalStoryline.careerFilter')}
                </label>
                <div className="select is-fullwidth">
                  <select
                    id="storyline-career-filter"
                    value={search.get('career') || 'all'}
                    onChange={(event) => {
                      const next = new URLSearchParams(search);
                      if (event.currentTarget.value === 'all') {
                        next.delete('career');
                      } else {
                        next.set('career', event.currentTarget.value);
                      }
                      setSearch(next);
                    }}
                  >
                    <option value="all">
                      {t('pages:warJournalStoryline.allCareers')}
                    </option>
                    {Object.entries(Career).map(([label, value]) => (
                      <option key={value} value={value}>
                        {t(`enums:career.${value}`, { defaultValue: label })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {[1, 2, 3].map((tier) => (
              <section className="mb-4" key={tier}>
                <h3 className="title is-5 is-family-secondary has-text-primary">
                  {t(
                    tier === 1
                      ? 'pages:warJournalStoryline.basicRewards'
                      : tier === 2
                        ? 'pages:warJournalStoryline.advancedRewards'
                        : 'pages:warJournalStoryline.eliteRewards',
                  )}
                </h3>
                <InfluenceRewards
                  rewards={entry.influenceRewards}
                  tier={tier}
                  career={search.get('career') as Career | null}
                />
              </section>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
