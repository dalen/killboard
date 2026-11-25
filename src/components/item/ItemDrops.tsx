import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Realm, type Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { HoverPopupTrigger } from '@/components/global/HoverPopupTrigger';
import { QueryPagination } from '@/components/global/QueryPagination';

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

  return (
    <>
      <div className="item-relation-scroll">
        <table className="table is-striped is-fullwidth">
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
            {chapters?.nodes?.map((chapter) => (
              <tr key={chapter.id}>
                <td>{chapter.name}</td>
                <td>{chapter.id}</td>
              </tr>
            ))}
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
