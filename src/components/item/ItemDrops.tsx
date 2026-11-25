import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Career, type Query, Realm } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { HoverPopupTrigger } from '@/components/global/HoverPopupTrigger';
import { QueryPagination } from '@/components/global/QueryPagination';
import { ItemPopupTrigger } from '@/components/item/ItemPopupTrigger';
import { canUseItem } from '@/itemUtils';

const ITEM_DROPS = gql`
  query GetItemDropSources(
    $itemId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $includeCreatures: Boolean!
    $includeGameObjects: Boolean!
    $includeChapters: Boolean!
  ) {
    item(id: $itemId) {
      id
      dropsFromCreatures(
        first: $first
        last: $last
        before: $before
        after: $after
      ) @include(if: $includeCreatures) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
        nodes {
          id
          name
          title
          modelName
          realm
          spawns {
            zone {
              id
              name
            }
          }
        }
      }
      dropsFromGameObjects(
        first: $first
        last: $last
        before: $before
        after: $after
      ) @include(if: $includeGameObjects) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
        nodes {
          id
          name
          modelName
          spawns {
            position {
              zone {
                id
                name
              }
            }
          }
        }
      }
      rewardedFromChapters(
        first: $first
        last: $last
        before: $before
        after: $after
      ) @include(if: $includeChapters) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
        nodes {
          id
          name
          rewards {
            tier
            count
            item {
              id
              name
              iconUrl
              careerRestriction
              raceRestriction
              type
            }
          }
        }
      }
    }
  }
`;

export type ItemDropSource = 'creatures' | 'gameObjects' | 'chapters';

export const ItemDrops = ({
  itemId,
  source,
}: {
  itemId: string | undefined;
  source: ItemDropSource;
}) => {
  const [perPage, setPerPage] = useState(25);
  const [career, setCareer] = useState<Career | 'all'>('all');
  const { t } = useTranslation(['common', 'components', 'pages']);
  const { loading, error, data, refetch } = useQuery<Query>(ITEM_DROPS, {
    variables: {
      first: perPage,
      itemId,
      includeCreatures: source === 'creatures',
      includeGameObjects: source === 'gameObjects',
      includeChapters: source === 'chapters',
    },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const item = data?.item;
  const creatures = source === 'creatures' ? item?.dropsFromCreatures : null;
  const gameObjects =
    source === 'gameObjects' ? item?.dropsFromGameObjects : null;
  const chapters = source === 'chapters' ? item?.rewardedFromChapters : null;
  const connection = creatures ?? gameObjects ?? chapters;

  if (connection == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const showChapterCareerFilter =
    chapters?.nodes?.some((chapter) =>
      chapter.rewards.some(
        (reward) => reward.item.careerRestriction.length > 0,
      ),
    ) ?? false;

  return (
    <>
      {source === 'chapters' && showChapterCareerFilter && (
        <div className="field mb-3">
          <label className="label" htmlFor="chapter-rewards-career-select">
            {t('pages:warJournalStoryline.careerFilter')}
          </label>
          <div className="control">
            <div className="select">
              <select
                id="chapter-rewards-career-select"
                value={career}
                onChange={(event) =>
                  setCareer(event.target.value as Career | 'all')
                }
              >
                <option value="all">
                  {t('pages:warJournalStoryline.allCareers')}
                </option>
                {Object.values(Career).map((careerOption) => (
                  <option key={careerOption} value={careerOption}>
                    {t(`enums:career.${careerOption}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      <div className="item-relation-scroll">
        <table
          className={`table is-striped is-fullwidth${source === 'chapters' ? ' item-chapter-rewards' : ''}`}
        >
          <thead>
            {source === 'creatures' && (
              <tr>
                <th>{t('components:itemVendors.creatureName')}</th>
                <th>{t('components:itemVendors.realm')}</th>
                <th>{t('components:itemVendors.zone')}</th>
              </tr>
            )}
            {source === 'gameObjects' && (
              <tr>
                <th>{t('pages:gameObject.name')}</th>
                <th>{t('pages:gameObject.modelName')}</th>
                <th>{t('components:itemVendors.zone')}</th>
              </tr>
            )}
            {source === 'chapters' && (
              <tr>
                <th>{t('pages:itemSources.chapter')}</th>
                <th>{t('pages:itemSources.chapterId')}</th>
                <th>{t('pages:itemSources.chapterInfluenceRewards')}</th>
              </tr>
            )}
          </thead>
          <tbody>
            {creatures?.nodes?.map((creature) => {
              const zones = creature.spawns
                .map((spawn) => spawn.zone?.name)
                .filter((zone): zone is string => zone != null);
              const realm =
                creature.realm === Realm.Order
                  ? t('components:itemVendors.order')
                  : t('components:itemVendors.destruction');

              return (
                <tr key={creature.id}>
                  <td>
                    <HoverPopupTrigger
                      content={
                        <div className="item-relation-tooltip">
                          <strong>{creature.name}</strong>
                          {creature.title && (
                            <div>{creature.title.replaceAll('_', ' ')}</div>
                          )}
                          <div>{realm}</div>
                          {creature.modelName && (
                            <div>{creature.modelName}</div>
                          )}
                          {zones.length > 0 && <div>{zones.join(', ')}</div>}
                        </div>
                      }
                    >
                      <Link to={`/creature/${creature.id}`}>
                        {creature.name}
                      </Link>
                    </HoverPopupTrigger>
                  </td>
                  <td>{realm}</td>
                  <td>{[...new Set(zones)].join(', ') || '—'}</td>
                </tr>
              );
            })}
            {gameObjects?.nodes?.map((gameObject) => {
              const zones = gameObject.spawns
                .map((spawn) => spawn.position.zone?.name)
                .filter((zone): zone is string => zone != null);

              return (
                <tr key={gameObject.id}>
                  <td>
                    <HoverPopupTrigger
                      content={
                        <div className="item-relation-tooltip">
                          <strong>{gameObject.name}</strong>
                          {gameObject.modelName && (
                            <div>{gameObject.modelName}</div>
                          )}
                          {zones.length > 0 && (
                            <div>{[...new Set(zones)].join(', ')}</div>
                          )}
                        </div>
                      }
                    >
                      <Link to={`/gameobject/${gameObject.id}`}>
                        {gameObject.name}
                      </Link>
                    </HoverPopupTrigger>
                  </td>
                  <td>{gameObject.modelName || '—'}</td>
                  <td>{[...new Set(zones)].join(', ') || '—'}</td>
                </tr>
              );
            })}
            {chapters?.nodes?.map((chapter) => {
              const rewards = chapter.rewards
                .filter((reward) => reward.item.id !== itemId)
                .filter(
                  (reward) =>
                    career === 'all' || canUseItem(reward.item, career),
                );

              return (
                <tr id={`chapter-${chapter.id}`} key={chapter.id}>
                  <td>{chapter.name}</td>
                  <td>{chapter.id}</td>
                  <td>
                    {rewards.length === 0 ? (
                      '—'
                    ) : (
                      <details>
                        <summary>
                          {t('pages:itemSources.showOtherChapterRewards', {
                            count: rewards.length,
                          })}
                        </summary>
                        <div className="is-flex is-flex-wrap-wrap mt-2">
                          {rewards.map((reward) => (
                            <div
                              className="icon-text mr-3 mb-2"
                              key={`${chapter.id}-${reward.tier}-${reward.item.id}`}
                            >
                              <ItemPopupTrigger
                                itemId={reward.item.id}
                                placement="top"
                              >
                                <Link to={`/item/${reward.item.id}`}>
                                  <figure className="image is-24x24">
                                    <img
                                      src={reward.item.iconUrl}
                                      alt={reward.item.name}
                                    />
                                  </figure>
                                </Link>
                              </ItemPopupTrigger>
                              <span>
                                <span className="has-text-grey-light">
                                  {t(`pages:chapter.tier${reward.tier}`)}:{' '}
                                </span>
                                <Link to={`/item/${reward.item.id}`}>
                                  {reward.item.name}
                                </Link>
                                {reward.count > 1 && ` ×${reward.count}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <QueryPagination
        pageInfo={connection.pageInfo}
        perPage={perPage}
        onPerPageChange={setPerPage}
        refetch={refetch}
      />
    </>
  );
};
