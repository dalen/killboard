import { gql, useQuery } from '@apollo/client';
import { Progress, Table } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { CareerIcon } from './CareerIcon';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { QueryPagination } from './QueryPagination';
import { ReactElement } from 'react';

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
}): ReactElement {
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
            <th aria-label="Career" id="th-career" />
            <th>{t('pages:guildMembers.name')}</th>
            <th>{t('pages:guildMembers.level')}</th>
            <th>{t('pages:guildMembers.renownRank')}</th>
            <th>{t('pages:guildMembers.guildRank')}</th>
          </tr>
        </thead>
        <tbody>
          {data.guild.members.nodes.map((member) => (
            <tr key={member.character.id}>
              <td aria-labelledby="th-career">
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
      </Table>
      <QueryPagination
        pageInfo={pageInfo}
        refetch={refetch}
        perPage={perPage}
      />
    </div>
  );
}
