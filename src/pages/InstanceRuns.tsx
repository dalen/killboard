import { gql, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  Card,
  Columns,
  Container,
  Icon,
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
import { Link, useSearchParams } from 'react-router-dom';
import { ErrorMessage } from '../components/global/ErrorMessage';
import { Archetype, InstanceRunFilterInput, Query } from '../types';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { QueryPagination } from '../components/QueryPagination';

const INSTANCE_RUNS = gql`
  query GetInstanceRuns(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $where: InstanceRunFilterInput
  ) {
    instanceRuns(
      first: $first
      last: $last
      before: $before
      after: $after
      where: $where
      order: { start: DESC }
    ) {
      nodes {
        id
        instanceId
        start
        end
        completed
        instance {
          id
          name
        }
        scoreboardEntries {
          itemRating
          deaths
          archetype
          damage
          healing
        }
        encounters {
          encounterId
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

const getInstanceFilters = (
  search: URLSearchParams,
): InstanceRunFilterInput => {
  const instance = search.get('instance');

  if (instance && instance !== 'all') {
    return { instanceId: { eq: Number(instance) } };
  }

  return {};
};

export function InstanceRuns() {
  const perPage = 25;

  const [search, setSearch] = useSearchParams();
  const instance = search.get('instance') || 'all';
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading, refetch } = useQuery<Query>(INSTANCE_RUNS, {
    variables: {
      first: perPage,
      where: {
        start: { gt: 0 },
        scoreboardEntryCount: { gte: 6 },
        ...getInstanceFilters(search),
      },
    },
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
          <Link to="/instance-runs">{t('pages:instanceRuns.title')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Card mb={5}>
        <Card.Content>
          <Columns>
            <Columns.Column>
              <div className="select">
                <select
                  value={instance}
                  onChange={(event) => {
                    search.set('instance', event.target.value);
                    setSearch(search);
                  }}
                >
                  <option value="all">{t('pages:instanceRuns.all')}</option>
                  <option value="176">Sigmar Crypts</option>
                  <option value="196">Bilerot</option>
                  <option value="173">Sacellum</option>
                  <option value="169">Altdorf Sewers</option>
                  <option value="160">Bastion Stair</option>
                </select>
              </div>
            </Columns.Column>
          </Columns>
        </Card.Content>
      </Card>
      <Table
        striped
        hoverable
        size={isMobile ? 'narrow' : 'fullwidth'}
        marginless
      >
        <thead>
          <tr>
            <th>{t('pages:instanceRuns.startTime')}</th>
            <th>{t('pages:instanceRuns.instance')}</th>
            <th>{t('pages:instanceRuns.duration')}</th>
            <th>{t('pages:instanceRuns.encounters')}</th>
            <th align="center">
              <Icon>
                <img
                  src="/images/icons/deaths.png"
                  width={36}
                  height={32}
                  alt={t('pages:instanceRuns.deaths') ?? ''}
                  title={t('pages:instanceRuns.deaths') ?? ''}
                />
              </Icon>
            </th>{' '}
            <th>{t('pages:instanceRuns.itemRatingMin')}</th>
            <th>{t('pages:instanceRuns.itemRatingAverage')}</th>
            <th>{t('pages:instanceRuns.itemRatingMax')}</th>
            <th align="center">
              <Icon>
                <img
                  src="/images/icons/protection.png"
                  width={28}
                  height={33}
                  alt={t('pages:instanceRuns.numTanks') ?? ''}
                  title={t('pages:instanceRuns.numTanks') ?? ''}
                />
              </Icon>
            </th>
            <th align="center">
              <Icon>
                <img
                  src="/images/icons/healing.png"
                  width={28}
                  height={28}
                  alt={t('pages:instanceRuns.numHealers') ?? ''}
                  title={t('pages:instanceRuns.numHealers') ?? ''}
                />
              </Icon>
            </th>
            <th align="center">
              <Icon>
                <img
                  src="/images/icons/damage.png"
                  width={30}
                  height={32}
                  alt={t('pages:instanceRuns.numDps') ?? ''}
                  title={t('pages:instanceRuns.numDps') ?? ''}
                />
              </Icon>
            </th>
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

            const duration = formatDuration(durationObject);
            const itemRatings = instanceRun.scoreboardEntries.map(
              (e) => e.itemRating,
            );
            const itemRatingMin = Math.min(...itemRatings);
            const itemRatingMax = Math.max(...itemRatings);
            const itemRatingAverage =
              itemRatings.reduce((a, b) => a + b) / itemRatings.length;
            const numTanks = instanceRun.scoreboardEntries.filter(
              (e) => e.archetype === Archetype.Tank,
            ).length;
            const numHealers = instanceRun.scoreboardEntries.filter(
              (e) => e.archetype === Archetype.Healer,
            ).length;
            const numDPS = instanceRun.scoreboardEntries.filter((e) =>
              [Archetype.MeleeDps, Archetype.RangedDps].includes(e.archetype),
            ).length;

            const numEncounters = new Set(
              instanceRun.encounters.map((e) => e.encounterId),
            ).size;

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
                <td>{numEncounters}</td>
                <td align="center">
                  {instanceRun.scoreboardEntries
                    .map((e) => e.deaths)
                    .reduce((a, b) => a + b, 0)}
                </td>
                <td align="center">{itemRatingMin}</td>
                <td align="center">{itemRatingAverage.toFixed(0)}</td>
                <td align="center">{itemRatingMax}</td>
                <td align="center">{numTanks}</td>
                <td align="center">{numHealers}</td>
                <td align="center">{numDPS}</td>
                <td>
                  <Link
                    to={`/instance-run/${instanceRun.id}`}
                    className="button is-primary p-2 is-pulled-right"
                  >
                    {t('common:details')}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </Container>
  );
}
