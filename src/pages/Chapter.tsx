import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { Query } from '@/types';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { MapPositions } from '@/components/MapPositions';
import { ReactElement } from 'react';
import { ItemIconWithPopup } from '@/components/item/ItemIconWithPopup';

const CHAPTER_DETAILS = gql`
  query GetChapter($id: ID!) {
    chapter(id: $id) {
      id
      name
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
      influenceRewards {
        count
        item {
          id
          name
          description
          rarity
          itemLevel
          iconUrl
          stats {
            stat
            value
          }
          type
          levelRequirement
          renownRankRequirement
          slot
          armor
          careerRestriction
          talismanSlots
          speed
          dps
          itemSet {
            id
          }
          buffs {
            id
            description
          }
        }
        realm
        tier
      }
    }
  }
`;

export function Chapter(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();
  const { loading, error, data } = useQuery<Query>(CHAPTER_DETAILS, {
    variables: { id },
  });

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const entry = data?.chapter;
  if (entry == null) return <ErrorMessage customText={t('common:notFound')} />;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/chapters">{t('common:chapters')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/chapter/${id}`}>
              {t('pages:chapter.chapterId', { chapterId: id })}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <p className="is-size-4 is-family-secondary has-text-info">
            {entry.name}
          </p>
        </div>
      </div>

      {entry.position.mapSetup != null && (
        <div className="card mb-5">
          <div className="card-content">
            <p className="is-size-4 is-family-secondary has-text-info">
              {entry.position.zone?.name}
            </p>
            <div
              style={{
                width: '400px',
                height: '400px',
              }}
            >
              <MapPositions
                positions={[entry.position]}
                zoneId={Number(entry.position.zone?.id)}
                nwCornerX={entry.position.mapSetup.nwCornerX}
                nwCornerY={entry.position.mapSetup.nwCornerY}
                seCornerX={entry.position.mapSetup.seCornerX}
                seCornerY={entry.position.mapSetup.seCornerY}
              />
            </div>
          </div>
        </div>
      )}

      <div className="card mb-5">
        <div className="card-content">
          <p className="is-size-4 is-family-secondary has-text-info">
            {t('pages:chapter.influenceRewards')}
          </p>

          <p className="is-size-6 is-family-secondary has-text-info">
            {t('pages:chapter.tier1')}
          </p>
          <div className="is-flex is-flex-wrap-wrap is-flex-direction-row">
            {entry.influenceRewards
              .filter((reward) => reward.tier === 1)
              .map((reward) => (
                <ItemIconWithPopup key={reward.item.id} item={reward.item} />
              ))}
          </div>

          <p className="is-size-6 is-family-secondary has-text-info">
            {t('pages:chapter.tier2')}
          </p>
          <div className="is-flex is-flex-wrap-wrap is-flex-direction-row">
            {entry.influenceRewards
              .filter((reward) => reward.tier === 2)
              .map((reward) => (
                <ItemIconWithPopup key={reward.item.id} item={reward.item} />
              ))}
          </div>

          <p className="is-size-6 is-family-secondary has-text-info">
            {t('pages:chapter.tier3')}
          </p>
          <div className="is-flex is-flex-wrap-wrap is-flex-direction-row">
            {entry.influenceRewards
              .filter((reward) => reward.tier === 3)
              .map((reward) => (
                <ItemIconWithPopup key={reward.item.id} item={reward.item} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
