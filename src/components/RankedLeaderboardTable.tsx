import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { Content, Media, Progress, Table } from 'react-bulma-components';
import { Link } from 'react-router';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { GuildHeraldry } from './GuildHeraldry';
import { CareerIcon } from './CareerIcon';
import { QueryPagination } from './QueryPagination';
import { ReactElement } from 'react';

const RANKED_LEADERBOARD = gql`
  query GetRankedLeaderboard(
    $season: ID
    $type: RankedLeaderboardRatingType!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    rankedSeason(id: $season) {
      id
      mainSeason
      name
      start
      end
      leaderboard(
        type: $type
        first: $first
        last: $last
        before: $before
        after: $after
      ) {
        nodes {
          character {
            id
            name
            career
          }
          guild {
            id
            name
            heraldry {
              emblem
              pattern
              color1
              color2
              shape
            }
          }
          careerRank
          rank
          rating
          wins
          losses
          draws
          renownRank
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

export function RankedLeaderboardTable({
  season,
  type,
}: {
  season: string;
  type: string;
}): ReactElement {
  const { t } = useTranslation(['components', 'common']);
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;
  const perPage = 20;

  const { loading, error, data, refetch } = useQuery<Query>(
    RANKED_LEADERBOARD,
    {
      variables: {
        season,
        type: type === 'solo' ? 'RANKED_SOLO' : 'RANKED_GROUP',
        first: perPage,
      },
    },
  );

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  if (data?.rankedSeason?.leaderboard?.nodes == null)
    return <ErrorMessage customText={t('common:notFound')} />;

  const entries = data.rankedSeason.leaderboard.nodes;
  const { pageInfo } = data.rankedSeason.leaderboard;

  return (
    <div className="table-container">
      <Table
        striped
        hoverable
        size={isMobile ? 'narrow' : 'fullwidth'}
        marginless
      >
        <thead>
          <tr>
            <th>{t('components:rankedLeaderboard.rank')}</th>
            {isMobile ? (
              <>
                <th>{t('components:rankedLeaderboard.name')}</th>
                <th aria-label="empty header" />
              </>
            ) : (
              <>
                <th id="th-career">
                  {t('components:rankedLeaderboard.career')}
                </th>
                <th>{t('components:rankedLeaderboard.name')}</th>
                <th colSpan={2}>{t('components:rankedLeaderboard.guild')}</th>
                <th align="right">
                  {t('components:rankedLeaderboard.renownRank')}
                </th>
                <th align="right">{t('components:rankedLeaderboard.wins')}</th>
                <th align="right">
                  {t('components:rankedLeaderboard.losses')}
                </th>
                <th align="right">{t('components:rankedLeaderboard.draws')}</th>
              </>
            )}

            <th align="right">{t('components:rankedLeaderboard.rating')}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.character.id}>
              <td>{entry.rank}</td>
              {isMobile ? (
                <>
                  <td>
                    <Media>
                      <Media.Item align="left">
                        <CareerIcon career={entry.character.career} />
                      </Media.Item>
                      <Media.Item>
                        <Content>
                          <Link to={`/character/${entry.character.id}`}>
                            <strong>{entry.character.name}</strong>
                          </Link>
                          <br />
                          <Link to={`/guild/${entry.guild?.id}`}>
                            {entry.guild?.name}
                          </Link>
                          <br />
                          <small>
                            {t('components:rankedLeaderboard.renownRank')}&nbsp;
                            {entry.renownRank}
                          </small>
                        </Content>
                      </Media.Item>
                    </Media>
                  </td>
                  <td align="right">
                    <small>
                      {t('components:rankedLeaderboard.wins')}&nbsp;{entry.wins}
                    </small>
                    <br />
                    <small>
                      {t('components:rankedLeaderboard.losses')}&nbsp;
                      {entry.losses}
                    </small>
                    <br />
                    <small>
                      {t('components:rankedLeaderboard.draws')}&nbsp;
                      {entry.draws}
                    </small>
                  </td>
                </>
              ) : (
                <>
                  <td aria-labelledby="th-career">
                    <CareerIcon career={entry.character.career} />
                  </td>
                  <td>
                    <Link to={`/character/${entry.character.id}`}>
                      {entry.character.name}
                    </Link>
                  </td>
                  <td>
                    {entry.guild && (
                      <Link to={`/guild/${entry.guild.id}`}>
                        <GuildHeraldry
                          size="32"
                          heraldry={entry.guild.heraldry}
                          realm={entry.guild.realm}
                        />
                      </Link>
                    )}
                  </td>
                  <td>
                    {entry.guild && (
                      <Link to={`/guild/${entry.guild.id}`}>
                        {entry.guild.name}
                      </Link>
                    )}
                  </td>
                  <td align="right">{entry.renownRank}</td>
                  <td align="right">{entry.wins}</td>
                  <td align="right">{entry.losses}</td>
                  <td align="right">{entry.draws}</td>
                </>
              )}

              <td align="right">{entry.rating}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </div>
  );
}
