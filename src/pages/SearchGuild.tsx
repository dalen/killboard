import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { SearchBox } from '../components/global/SearchBox';
import { ErrorMessage } from '../components/global/ErrorMessage';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { QueryPagination } from '../components/global/QueryPagination';
import { SearchGuildsQuery } from '../__generated__/graphql';
import { ReactElement } from 'react';
import clsx from 'clsx';

const SEARCH_GUILD = gql`
  query SearchGuilds(
    $query: String!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    guilds(
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
        leader {
          id
          level
          name
          renownRank
        }
        members {
          totalCount
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

export function SearchGuild(): ReactElement {
  const perPage = 15;

  const { t } = useTranslation(['common', 'pages']);
  const { query } = useParams();
  const { loading, error, data, refetch } = useQuery<SearchGuildsQuery>(
    SEARCH_GUILD,
    {
      variables: { query, first: perPage },
    },
  );
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.guilds?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { pageInfo } = data.guilds;

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
            <Link to="/search">{t('pages:searchPageGuild.search')}</Link>
          </li>
        </ul>
      </nav>
      <SearchBox initialQuery={query} onSubmit={handleSubmit} />
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
              <th>{t('pages:searchPageGuild.guild')}</th>
              <th>{t('pages:searchPageGuild.leader')}</th>
              <th>{t('pages:searchPageGuild.members')}</th>
              <th>{t('pages:searchPageGuild.level')}</th>
            </tr>
          </thead>
          <tbody>
            {data.guilds.nodes.map((guild) => (
              <tr key={guild.id}>
                <td>
                  <Link to={`/guild/${guild.id}`}>{guild.name}</Link>
                </td>
                <td>
                  <Link to={`/character/${guild.leader?.id}`}>
                    {guild.leader?.name}
                  </Link>
                </td>
                <td>{guild.members?.totalCount}</td>
                <td>{guild.level}</td>
              </tr>
            ))}
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
