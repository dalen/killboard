import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { CareerIcon } from '@/components/CareerIcon';
import { GuildLink } from '@/components/global/GuildLink';
import { SearchBox } from '@/components/global/SearchBox';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { QueryPagination } from '@/components/global/QueryPagination';
import type { Career, PageInfo } from '../__generated__/schema-types';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { type ReactElement, useState } from 'react';
import clsx from 'clsx';

const PLAYER_SEARCH = gql`
  query PlayerSearch(
    $query: String!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    characters(
      where: { name: { contains: $query } }
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      nodes {
        id
        name
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
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

interface PlayerSearchData {
  characters?: {
    nodes?: {
      id: string;
      name: string;
      level: number;
      career: Career;
      renownRank: number;
      guildMembership?: { guild: { id: string; name: string } } | null;
    }[] | null;
    pageInfo: PageInfo;
  } | null;
}

export const Search = (): ReactElement => {
  const [perPage, setPerPage] = useState(15);
  const { t } = useTranslation(['common', 'pages']);
  const { query = '' } = useParams();
  const { loading, error, data, refetch } = useQuery<PlayerSearchData>(
    PLAYER_SEARCH,
    { variables: { first: perPage, query } },
  );
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (data?.characters == null) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { pageInfo, nodes } = data.characters;
  const players = nodes ?? [];
  const handleSubmit = (newQuery: string): void => {
    void refetch({ first: perPage, query: newQuery });
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
            {players.length === 0 ? (
              <tr>
                <td colSpan={4}>{t('common:notFound')}</td>
              </tr>
            ) : (
              players.map((player) => (
                <tr key={player.id}>
                  <td>
                    <CareerIcon career={player.career} />
                  </td>
                  <td>
                    <Link to={`/character/${player.id}`}>
                      <strong>{player.name}</strong>
                    </Link>
                    <br />
                    <GuildLink guild={player.guildMembership?.guild} />
                  </td>
                  <td>
                    <small>
                      Lvl {player.level}
                      <br />
                      RR {player.renownRank}
                    </small>
                  </td>
                  <td align="right">
                    <span className="tag is-primary">Character</span>
                  </td>
                </tr>
              ))
            )}
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
