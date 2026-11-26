import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { KillsFilters } from '@/components/kill/KillsFilters';
import { KillsList } from '@/components/kill/KillsList';
import { KillActivity } from '@/components/kill/KillActivity';
import type { ReactElement } from 'react';
import { useSearchParams } from 'react-router';
import type { KillTimeZoneMode } from '@/components/kill/killTime';

const LATEST_KILLS = gql`
  query GetKills(
    $first: Int
    $last: Int
    $before: String
    $after: String
    $time: DateTimeOperationFilterInput
    $soloOnly: Boolean
  ) {
    kills(
      where: { time: $time }
      first: $first
      last: $last
      before: $before
      after: $after
      soloOnly: $soloOnly
    ) {
      totalCount
      nodes {
        id
        time
        position {
          zoneId
          zone {
            name
          }
        }
        scenario {
          id
          name
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

export const Kills = (): ReactElement => {
  const { t } = useTranslation(['common', 'pages']);
  const [search] = useSearchParams();
  const timeZoneMode: KillTimeZoneMode =
    search.get('timeZone') === 'local' ? 'local' : 'altdorf';

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
        <KillsFilters defaultPeriod="last7d" showTimeZone />
        <KillActivity defaultPeriod="last7d" />
        <KillsList
          query={LATEST_KILLS}
          perPage={10}
          defaultPeriod="last7d"
          timeZoneMode={timeZoneMode}
          title={t('pages:killsPage.title')}
        />
      </div>
    </div>
  );
};
