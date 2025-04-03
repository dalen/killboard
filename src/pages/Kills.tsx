import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { KillsFilters } from '@/components/kill/KillsFilters';
import { KillsList } from '@/components/kill/KillsList';
import { ReactElement } from 'react';

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

export function Kills(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/kills">{t('pages:killsPage.title')}</Link>
          </li>
        </ul>
      </nav>
      <div>
        <KillsFilters />
        <KillsList
          query={LATEST_KILLS}
          perPage={10}
          title={t('pages:killsPage.title')}
        />
      </div>
    </div>
  );
}
