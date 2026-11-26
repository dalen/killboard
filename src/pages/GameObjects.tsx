import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { type FormEvent, type ReactElement, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import {
  type GameObjectProtoFilterInput,
  type GameObjectProtoSortInput,
  type Query,
  SortEnumType,
} from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { QueryPagination } from '@/components/global/QueryPagination';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { isPlayerFacingZone } from '@/utils';

const GAME_OBJECTS = gql`
  query GetGameObjects(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: GameObjectProtoFilterInput
    $order: [GameObjectProtoSortInput!]
  ) {
    gameObjects(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
      order: $order
    ) {
      nodes {
        id
        name
        modelName
        spawns {
          zone {
            id
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

const getGameObjectFilter = (search: URLSearchParams): GameObjectProtoFilterInput => {
  const name = search.get('query')?.trim();
  return name ? { name: { contains: name } } : {};
};

const getGameObjectOrder = (search: URLSearchParams): GameObjectProtoSortInput[] => {
  const descending = search.get('direction') === 'desc';
  return [
    { name: descending ? SortEnumType.Desc : SortEnumType.Asc },
    { id: SortEnumType.Asc },
  ];
};

export const GameObjects = (): ReactElement => {
  const [perPage, setPerPage] = useState(25);
  const [search, setSearch] = useSearchParams();
  const [draftSearch, setDraftSearch] = useState(
    () => new URLSearchParams(search),
  );
  const { t } = useTranslation(['common', 'pages', 'components']);
  const { loading, error, data, refetch } = useQuery<Query>(GAME_OBJECTS, {
    variables: {
      first: perPage,
      where: getGameObjectFilter(search),
      order: getGameObjectOrder(search),
    },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  useEffect(() => {
    setDraftSearch(new URLSearchParams(search));
  }, [search]);

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.gameObjects?.nodes == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { nodes, pageInfo } = data.gameObjects;
  const currentDirection = search.get('direction') === 'desc' ? 'desc' : 'asc';
  const toggleNameSort = () => {
    const next = new URLSearchParams(search);
    next.delete('after');
    next.delete('before');
    next.set('direction', currentDirection === 'asc' ? 'desc' : 'asc');
    setSearch(next);
  };

  return (
    <div className="container is-max-desktop mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/gameobjects">{t('pages:gameObjects.title')}</Link>
          </li>
        </ul>
      </nav>

      <form
        className="card mb-5"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const next = new URLSearchParams(draftSearch);
          next.delete('after');
          next.delete('before');
          setSearch(next);
        }}
      >
        <div className="card-content">
          <div className="field mb-0">
            <label className="label" htmlFor="game-object-search">
              {t('pages:gameObjects.search')}
            </label>
            <p className="control has-icons-left">
              <input
                id="game-object-search"
                className="input"
                type="search"
                placeholder={t('components:searchBox.placeholder')}
                value={draftSearch.get('query') ?? ''}
                onChange={(event) => {
                  const next = new URLSearchParams(draftSearch);
                  if (event.currentTarget.value) {
                    next.set('query', event.currentTarget.value);
                  } else {
                    next.delete('query');
                  }
                  setDraftSearch(next);
                }}
              />
              <span className="icon is-small is-left" aria-hidden="true">
                <i className="fas fa-search" />
              </span>
            </p>
          </div>
          <div className="is-flex is-justify-content-flex-end mt-4">
            <button className="button is-primary" type="submit">
              {t('pages:gameObjects.applyFilters')}
            </button>
          </div>
        </div>
      </form>

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
              <th>{t('pages:gameObjects.id')}</th>
              <th>
                <button
                  className="button is-ghost is-small p-0 has-text-weight-bold"
                  type="button"
                  onClick={toggleNameSort}
                  aria-label={`${t('pages:gameObjects.name')}, ${currentDirection}`}
                >
                  {t('pages:gameObjects.name')}
                  <span className="ml-1" aria-hidden="true">
                    {currentDirection === 'asc' ? '↑' : '↓'}
                  </span>
                </button>
              </th>
              <th className="is-hidden-mobile">{t('pages:gameObjects.model')}</th>
              <th>{t('pages:gameObjects.locations')}</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((gameObject) => {
              const locations = [
                ...new Map(
                  gameObject.spawns
                    .map((spawn) => spawn.zone)
                    .filter((zone) => isPlayerFacingZone(zone.name))
                    .map((zone) => [zone.id, zone] as const),
                ).values(),
              ];

              return (
                <tr key={gameObject.id}>
                  <td className="has-text-grey-light">{gameObject.id}</td>
                  <td>
                    <Link to={`/gameobject/${gameObject.id}`}>
                      {gameObject.name}
                    </Link>
                  </td>
                  <td className="is-hidden-mobile">
                    {gameObject.modelName || '—'}
                  </td>
                  <td>
                    {locations.length
                      ? locations.map((zone) => zone.name).join(', ')
                      : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        onPerPageChange={setPerPage}
        refetch={refetch}
      />
    </div>
  );
};
