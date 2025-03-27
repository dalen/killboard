import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { CareerIcon } from '../components/CareerIcon';
import { SearchBox } from '../components/global/SearchBox';
import { ErrorMessage } from '../components/global/ErrorMessage';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { QueryPagination } from '../components/global/QueryPagination';
import { SearchQuery } from '../__generated__/graphql';
import { GuildHeraldry } from '../components/guild/GuildHeraldry';
import { itemFigureClass, itemNameClass } from '../itemUtils';
import { questTypeIcon } from '../utils';
import { ReactElement } from 'react';
import clsx from 'clsx';

const SEARCH = gql`
  query Search(
    $query: String!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    search(
      query: $query
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        __typename
        id
        name
        ... on Character {
          level
          career
          renownRank
          guildMembership {
            guild {
              id
              name
            }
          }
        }
        ... on Guild {
          level
          realm
          leader {
            id
            name
          }
          heraldry {
            emblem
            pattern
            color1
            color2
            shape
          }
          members {
            totalCount
          }
        }
        ... on Item {
          iconUrl
          description
          type
          slot
          rarity
          itemLevel
          itemSet {
            id
            name
          }
        }
        ... on Quest {
          questType: type {
            isGroup
            isTravel
            isTome
            isRvR
            isPlayerKill
            isEpic
          }
          repeatableType
          minLevel
          xp
          gold
          journalEntry
          questDescription: description
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

export function Search(): ReactElement {
  const perPage = 15;

  const { t } = useTranslation(['common', 'pages']);
  const { query } = useParams();
  const { loading, error, data, refetch } = useQuery<SearchQuery>(SEARCH, {
    variables: { query, first: perPage },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.search?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { pageInfo } = data.search;

  const handleSubmit = (newQuery: string): void => {
    refetch({ query: newQuery, first: perPage });
  };

  return (
    <div className="container is-max-desktop mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/search">{t('pages:searchPage.search')}</Link>
          </li>
        </ul>
      </nav>
      <SearchBox initialQuery={query} onSubmit={handleSubmit} isPlayer />
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
              <th></th>
              <th>Name</th>
              <th>Info</th>
              <th align="right">Type</th>
            </tr>
          </thead>
          <tbody>
            {data.search.nodes.map((searchItem) => {
              if (searchItem.__typename === 'Character') {
                return (
                  <tr>
                    <td>
                      <CareerIcon career={searchItem.career} />
                    </td>
                    <td>
                      <Link to={`/character/${searchItem.id}`}>
                        <strong>{searchItem.name}</strong>
                      </Link>
                      <br />
                      <Link
                        to={`/guild/${searchItem.guildMembership?.guild?.id}`}
                      >
                        {searchItem.guildMembership?.guild?.name}
                      </Link>
                    </td>
                    <td>
                      <small>
                        Lvl {searchItem.level}
                        <br />
                        RR {searchItem.renownRank}
                      </small>
                    </td>
                    <td align="right">
                      <span className="tag is-primary">
                        {searchItem.__typename}
                      </span>
                    </td>
                  </tr>
                );
              }

              if (searchItem.__typename === 'Guild') {
                return (
                  <tr>
                    <td>
                      <GuildHeraldry
                        heraldry={searchItem.heraldry}
                        realm={searchItem.realm}
                        size="48"
                      />
                    </td>
                    <td>
                      <Link to={`/guild/${searchItem.id}`}>
                        <strong>{searchItem.name}</strong>
                      </Link>
                      <br />
                      Leader:{' '}
                      <Link to={`/character/${searchItem.leader?.id}`}>
                        {searchItem.leader?.name}
                      </Link>
                    </td>
                    <td>
                      <small>
                        Lvl {searchItem.level}
                        <br />
                        Members {searchItem.members?.totalCount}
                      </small>
                    </td>
                    <td align="right">
                      <span className="tag is-primary">
                        {searchItem.__typename}
                      </span>
                    </td>
                  </tr>
                );
              }

              if (searchItem.__typename === 'Item') {
                return (
                  <tr>
                    <td>
                      <Link to={`/item/${searchItem.id}`}>
                        <figure
                          className={`${itemFigureClass(
                            searchItem,
                          )} [item-figure] image is-48x48 m-0`}
                        >
                          <img src={searchItem.iconUrl} alt={searchItem.name} />
                        </figure>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/item/${searchItem.id}`}>
                        <div
                          className={`${itemNameClass(searchItem)} has-text-weight-semi/bold`}
                        >
                          {searchItem.name}
                        </div>
                      </Link>
                      <br />
                      <small>
                        {t(`enums:itemType.${searchItem.type}`)}{' '}
                        {t(`enums:itemSlot.${searchItem.slot}`)}
                      </small>
                    </td>
                    <td>
                      <small>{searchItem.description}</small>
                    </td>
                    <td align="right">
                      <span className="tag is-primary">
                        {searchItem.__typename}
                      </span>
                    </td>
                  </tr>
                );
              }

              if (searchItem.__typename === 'Quest') {
                return (
                  <tr>
                    <td>
                      <Link to={`/quest/${searchItem.id}`}>
                        <div className="icon-text">
                          <span className="icon has-text-info">
                            <img
                              src={`/images/icons/${questTypeIcon(
                                searchItem.questType,
                                searchItem.repeatableType,
                              )}`}
                              alt="Quest Type"
                            />
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/quest/${searchItem.id}`}>
                        {searchItem.name}
                      </Link>
                      <br />
                      {searchItem.minLevel > 0 && (
                        <small>Lvl: {searchItem.minLevel}</small>
                      )}
                    </td>
                    <td>
                      <small>
                        {searchItem.journalEntry ?? searchItem.questDescription}
                      </small>
                    </td>
                    <td align="right">
                      <span className="tag is-primary">
                        {searchItem.__typename}
                      </span>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </div>
  );
}
