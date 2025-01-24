import { gql } from '@apollo/client';
import { Breadcrumb, Container } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { KillsFilters } from '../components/KillsFilters';
import { KillsList } from '../components/KillsList';

const LATEST_KILLS = gql`
  query GetKills(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $from: Int
    $to: Int
    $soloOnly: Boolean
  ) {
    kills(
      where: { time: { gte: $from, lte: $to } }
      first: $first
      last: $last
      before: $before
      after: $after
      soloOnly: $soloOnly
    ) {
      nodes {
        id
        time
        position {
          zoneId
        }
        scenario {
          id
        }
        victim {
          level
          renownRank
          character {
            id
            career
            name
          }
          guild {
            id
            name
          }
        }
        attackers {
          level
          renownRank
          damagePercent
          character {
            id
            career
            name
          }
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

export function Kills(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/kills">{t('pages:killsPage.title')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <KillsFilters />
        <KillsList
          query={LATEST_KILLS}
          perPage={10}
          title={t('pages:killsPage.title')}
        />
      </div>
    </Container>
  );
}
