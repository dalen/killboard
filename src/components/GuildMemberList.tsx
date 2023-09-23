import { gql, useQuery } from '@apollo/client';
import { Progress, Table, Button } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CareerIcon } from './CareerIcon';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import useWindowDimensions from '../hooks/useWindowDimensions';

const GUILD_MEMBERS = gql`
  query GetGuildMembers(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    guild(id: $id) {
      members(first: $first, last: $last, before: $before, after: $after) {
        nodes {
          rank {
            name
          }
          character {
            id
            name
            career
            level
            renownRank
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
  }
`;

export function GuildMemberList({
  id,
}: {
  id: string | undefined;
}): JSX.Element {
  const perPage = 25;

  const { t } = useTranslation(['common', 'pages']);
  const { loading, error, data, refetch } = useQuery<Query>(GUILD_MEMBERS, {
    variables: { id, first: perPage },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.guild?.members?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const { pageInfo } = data.guild.members;

  return (
    <div className="table-container">
      <Table striped hoverable size={isMobile ? 'narrow' : 'fullwidth'}>
        <thead>
          <tr>
            <th aria-label="empty header" />
            <th>{t('pages:guildMembers.name')}</th>
            <th>{t('pages:guildMembers.level')}</th>
            <th>{t('pages:guildMembers.renownRank')}</th>
            <th>{t('pages:guildMembers.guildRank')}</th>
          </tr>
        </thead>
        <tbody>
          {data.guild.members.nodes.map((member) => (
            <tr key={member.character.id}>
              <td>
                <CareerIcon career={member.character.career} />
              </td>
              <td>
                <Link to={`/character/${member.character.id}`}>
                  {member.character.name}
                </Link>
              </td>
              <td>{member.character.level}</td>
              <td>{member.character.renownRank}</td>
              <td>{member.rank.name}</td>
            </tr>
          ))}
        </tbody>
        {pageInfo && (
          <tfoot>
            <tr>
              <td colSpan={5}>
                <div className="field is-grouped is-pulled-right">
                  {pageInfo.hasPreviousPage && (
                    <Button
                      color="info"
                      size="small"
                      onClick={() =>
                        refetch({
                          first: undefined,
                          after: undefined,
                          before: pageInfo.startCursor,
                          last: perPage,
                        })
                      }
                    >
                      {t('common:prevPage')}
                      <i className="fas fa-circle-chevron-left ml-1" />
                    </Button>
                  )}
                  {pageInfo.hasNextPage && (
                    <Button
                      color="info"
                      size="small"
                      onClick={() =>
                        refetch({
                          first: perPage,
                          after: pageInfo.endCursor,
                          before: undefined,
                          last: undefined,
                        })
                      }
                    >
                      {t('common:nextPage')}
                      <i className="fas fa-circle-chevron-right ml-1" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  );
}
