import { gql, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  Button,
  Container,
  Progress,
  Table,
} from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import {
  intervalToDuration,
  formatDuration,
  formatISO,
  format,
} from 'date-fns';
import { Link } from 'react-router-dom';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { Query } from '../types';
import useWindowDimensions from '../hooks/useWindowDimensions';

const INSTANCE_RUNS = gql`
  query GetInstanceRuns(
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    instanceRuns(
      first: $first
      last: $last
      before: $before
      after: $after
      where: { start: { gt: 0 }, scoreboardEntryCount: { gte: 6 } }
      order: { start: DESC }
    ) {
      nodes {
        id
        instanceId
        start
        end
        instance {
          id
          name
        }
        scoreboardEntries {
          itemRating
          deaths
          character {
            career
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

export function InstanceRuns() {
  const perPage = 25;

  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading, refetch } = useQuery<Query>(INSTANCE_RUNS, {
    variables: { first: perPage },
  });
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  if (loading || !data?.instanceRuns?.nodes) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const { pageInfo } = data.instanceRuns;

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/kills">{t('pages:instanceRuns.title')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Table
        striped
        hoverable
        size={isMobile ? 'narrow' : 'fullwidth'}
        marginless
      >
        <thead>
          <tr>
            <th id="th-time">{t('pages:instanceRuns.startTime')}</th>
            <th id="th-instance">{t('pages:instanceRuns.instance')}</th>
            <th id="th-duration">{t('pages:instanceRuns.duration')}</th>
            <th id="th-deaths">{t('pages:instanceRuns.deaths')}</th>
            <th>{t('pages:instanceRuns.itemRatingMin')}</th>
            <th>{t('pages:instanceRuns.itemRatingAverage')}</th>
            <th>{t('pages:instanceRuns.itemRatingMax')}</th>
            <th>{t('pages:instanceRuns.numTanks')}</th>
            <th>{t('pages:instanceRuns.numHealers')}</th>
            <th>{t('pages:instanceRuns.numDps')}</th>
          </tr>
        </thead>
        <tbody>
          {data.instanceRuns.nodes.map((instanceRun) => {
            const startDate = new Date(instanceRun.start);
            const endDate = new Date(instanceRun.end);
            const durationObject = intervalToDuration({
              start: startDate,
              end: endDate,
            });
            // Skip seconds in the duration
            if (
              durationObject.days ||
              durationObject.hours ||
              durationObject.minutes
            ) {
              durationObject.seconds = undefined;
            }
            const duration = formatDuration(durationObject);
            const itemRatings = instanceRun.scoreboardEntries.map(
              (e) => e.itemRating,
            );
            const itemRatingMin = Math.min(...itemRatings);
            const itemRatingMax = Math.max(...itemRatings);
            const itemRatingAverage =
              itemRatings.reduce((a, b) => a + b) / itemRatings.length;
            const numTanks = instanceRun.scoreboardEntries.filter((e) =>
              [
                'IRON_BREAKER',
                'BLACK_ORC',
                'KNIGHT_OF_THE_BLAZING_SUN',
                'CHOSEN',
                'SWORD_MASTER',
                'BLACK_GUARD',
              ].includes(e.character.career),
            ).length;

            const numHealers = instanceRun.scoreboardEntries.filter((e) =>
              [
                'RUNE_PRIEST',
                'SHAMAN',
                'WARRIOR_PRIEST',
                'ZEALOT',
                'ARCHMAGE',
                'DISCIPLE_OF_KHAINE',
              ].includes(e.character.career),
            ).length;

            const numDPS =
              instanceRun.scoreboardEntries.length - numTanks - numHealers;

            return (
              <tr key={instanceRun.id}>
                <td>
                  <small>
                    {formatISO(startDate, { representation: 'date' })}
                    <br />
                    {format(startDate, 'HH:mm')}
                  </small>
                </td>
                <td>{instanceRun.instance.name}</td>
                <td>{duration}</td>
                <td>
                  {instanceRun.scoreboardEntries.reduce(
                    (val, entry) => entry.deaths + val,
                    0,
                  )}
                </td>
                <td>{itemRatingMin}</td>
                <td>{itemRatingAverage.toFixed(0)}</td>
                <td>{itemRatingMax}</td>
                <td>{numTanks}</td>
                <td>{numHealers}</td>
                <td>{numDPS}</td>
              </tr>
            );
          })}
        </tbody>
        {(pageInfo?.hasNextPage || pageInfo?.hasPreviousPage) && (
          <tfoot>
            <tr>
              <td colSpan={10}>
                <div className="field is-grouped is-pulled-right">
                  {pageInfo.hasPreviousPage && (
                    <Button
                      p={2}
                      pull="right"
                      color="info"
                      size="small"
                      onClick={() => {
                        refetch({
                          first: undefined,
                          after: undefined,
                          last: perPage,
                          before: pageInfo.startCursor,
                        });
                      }}
                    >
                      {t('components:skirmishList.loadPrevious')}
                      <i className="fas fa-circle-chevron-left ml-1" />
                    </Button>
                  )}
                  {pageInfo.hasNextPage && (
                    <Button
                      p={2}
                      pull="right"
                      color="info"
                      size="small"
                      onClick={() => {
                        refetch({
                          first: perPage,
                          after: pageInfo.endCursor,
                          last: undefined,
                          before: undefined,
                        });
                      }}
                    >
                      {t('components:skirmishList.loadMore')}
                      <i className="fas fa-circle-chevron-right ml-1" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </Table>
    </Container>
  );
}
