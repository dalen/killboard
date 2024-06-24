import { gql, useQuery } from '@apollo/client';
import { Container, Progress, Table, Breadcrumb } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { SearchBox } from '../components/SearchBox';
import { Query } from '../types';
import { ErrorMessage } from '../components/global/ErrorMessage';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { QueryPagination } from '../components/QueryPagination';

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

export function SearchGuild(): JSX.Element {
  const perPage = 15;

  const { t } = useTranslation(['common', 'pages']);
  const { query } = useParams();
  const { loading, error, data, refetch } = useQuery<Query>(SEARCH_GUILD, {
    variables: { query, first: perPage },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.guilds?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { pageInfo } = data.guilds;

  const handleSubmit = (newQuery: string): void => {
    refetch({ query: newQuery, first: perPage });
  };

  return (
    <Container max breakpoint="desktop" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/search">{t('pages:searchPageGuild.search')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <SearchBox initialQuery={query} onSubmit={handleSubmit} />
      <div className="table-container">
        <Table striped hoverable size={isMobile ? 'narrow' : 'fullwidth'}>
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
        </Table>
      </div>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </Container>
  );
}
