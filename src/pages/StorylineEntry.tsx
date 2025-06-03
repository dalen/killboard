import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { ReactElement } from 'react';
import { GetWarJournalEntryQuery } from '@/__generated__/graphql';
import clsx from 'clsx';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import {
  INFLUENCE_REWARDS_FRAGMENT,
  InfluenceRewards,
} from '@/components/storylineEntry/InfluenceRewards';
import { MapPositions } from '@/components/MapPositions';

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
      position {
        x
        y
        zone {
          id
          name
        }
        mapSetup {
          nwCornerX
          nwCornerY
          seCornerX
          seCornerY
        }
      }
      zone {
        id
        name
      }
      activities {
        id
        name
      }
      position {
        x
        y
      }
      influenceRewards {
        ...ChapterInfluenceReward
      }
    }
  }
  ${INFLUENCE_REWARDS_FRAGMENT}
`;

export function StorylineEntry(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id, storylineId } = useParams();
  const { loading, error, data } = useQuery<GetWarJournalEntryQuery>(
    WAR_JOURNAL_ENTRY_DETAILS,
    {
      variables: { id },
    },
  );
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const entry = data?.warJournalEntry;
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
          <li>
            <Link to={`/storylines/${storylineId}`}>
              {t('pages:warJournalStoryline.storylineName', {
                storylineName: entry.storyline.name,
              })}
            </Link>
          </li>
          <li className="is-active">
            <Link to={`/storylines/${storylineId}/${id}`}>
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
          {entry.npcName && (
            <p className="is-size-5 is-family-secondary has-text-primary">
              {entry.npcName}
            </p>
          )}
          {entry.text && <p dangerouslySetInnerHTML={{ __html: entry.text }} />}
        </div>
      </div>

      {entry.activities.filter((activity) => activity.name).length > 0 && (
        <div className="card mb-5">
          <div className="card-content">
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
                  {entry.activities
                    .filter((activity) => activity.name)
                    .map((activity, index) => (
                      <tr key={activity.id}>
                        <td>{index + 1}</td>
                        <td>
                          <Link
                            to={`/storylines/${storylineId}/${entry.id}/${activity.id}`}
                          >
                            {activity.name}
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {entry.influenceRewards.length > 0 && (
        <div className="card mb-5">
          <div className="card-content">
            <div className="is-size-4 is-family-secondary has-text-info">
              {t('pages:warJournalStoryline.influenceRewards')}
            </div>

            <div className="is-size-5 is-family-secondary has-text-primary">
              {t('pages:warJournalStoryline.basicRewards')}
            </div>
            <InfluenceRewards rewards={entry.influenceRewards} tier={1} />

            <div className="is-size-5 is-family-secondary has-text-primary">
              {t('pages:warJournalStoryline.advancedRewards')}
            </div>
            <InfluenceRewards rewards={entry.influenceRewards} tier={2} />

            <div className="is-size-5 is-family-secondary has-text-primary">
              {t('pages:warJournalStoryline.eliteRewards')}
            </div>
            <InfluenceRewards rewards={entry.influenceRewards} tier={3} />
          </div>
        </div>
      )}

      {entry.zone &&
      entry.position &&
      entry.position.mapSetup &&
      entry.position.zone?.id === entry.zone.id ? (
        <div className="card mb-5">
          <div className="card-content">
            <p className="is-size-4 is-family-secondary has-text-info">
              {entry.locationText}
            </p>
            <MapPositions
              positions={[entry.position]}
              zoneId={Number(entry.position.zone?.id)}
              nwCornerX={entry.position.mapSetup.nwCornerX}
              nwCornerY={entry.position.mapSetup.nwCornerY}
              seCornerX={entry.position.mapSetup.seCornerX}
              seCornerY={entry.position.mapSetup.seCornerY}
            />{' '}
          </div>
        </div>
      ) : null}
    </div>
  );
}
