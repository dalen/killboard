import type { DocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { getCurrentFilters } from '@/components/kill/KillsFilters';
import { KillsListTable } from '@/components/kill/KillsListTable';
import { QueryPagination } from '@/components/global/QueryPagination';
import type { KillTimeZoneMode } from './killTime';

export const KillsList = ({
  query,
  queryOptions,
  perPage,
  title,
  showTime = true,
  showVictim = true,
  showKiller = true,
  mobileCards = false,
  feudPlayerId,
  defaultPeriod = 'all',
  timeZoneMode = 'local',
  showTotalCount = true,
  description,
  includeZoneFilter = false,
}: {
  query: DocumentNode;
  queryOptions?: useQuery.Options<Query>;
  perPage: number;
  title?: string | null;
  showTime?: boolean;
  showVictim?: boolean;
  showKiller?: boolean;
  mobileCards?: boolean;
  feudPlayerId?: number;
  defaultPeriod?: string;
  timeZoneMode?: KillTimeZoneMode;
  showTotalCount?: boolean;
  description?: string;
  includeZoneFilter?: boolean;
}): React.ReactElement | null => {
  const [currentPerPage, setPerPage] = React.useState(perPage);
  const { t } = useTranslation(['common', 'components']);
  const [search] = useSearchParams();
  const searchKey = search.toString();
  const currentFilters = React.useMemo(
    () => getCurrentFilters(new URLSearchParams(searchKey), defaultPeriod, includeZoneFilter),
    [defaultPeriod, includeZoneFilter, searchKey],
  );

  const { loading, error, data, refetch } = useQuery<Query>(query, {
    ...queryOptions,
    variables: {
      ...queryOptions?.variables,
      first: currentPerPage,
      ...currentFilters,
    },
  });

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }

  const kills = data?.kills;

  if (kills?.nodes == null) {
    return <p>{t('common:error')}</p>;
  }

  if (kills.nodes.length === 0) {
    return <p>{t('common:noResults')}</p>;
  }

  const currentPageKills = kills.nodes;
  const { pageInfo } = kills;
  return (
    <div>
      {title && (
        <div className="is-size-4 is-family-secondary is-uppercase mb-2">
          {title}
          {showTotalCount && kills.totalCount != null ? ` ${kills.totalCount}` : ''}
        </div>
      )}
      {description && <p className="is-size-7 has-text-grey-light mb-2">{description}</p>}
      <KillsListTable
        data={currentPageKills}
        showTime={showTime}
        showKiller={showKiller}
        showVictim={showVictim}
        mobileCards={mobileCards}
        feudPlayerId={feudPlayerId}
        timeZoneMode={timeZoneMode}
      />
      <QueryPagination
        pageInfo={pageInfo}
        perPage={currentPerPage}
        onPerPageChange={setPerPage}
        refetch={refetch}
      />
    </div>
  );
};
