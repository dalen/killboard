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

export const KillsList = ({
  query,
  queryOptions,
  perPage,
  title = undefined,
  showTime = true,
  showVictim = true,
  showKiller = true,
}: {
  query: DocumentNode;
  queryOptions?: useQuery.Options<Query>;
  perPage: number;
  title?: string | null;
  showTime?: boolean;
  showVictim?: boolean;
  showKiller?: boolean;
}): React.ReactElement | null => {
  const { t } = useTranslation(['common', 'components']);
  const [search] = useSearchParams();

  const { loading, error, data, refetch } = useQuery<Query>(query, {
    ...queryOptions,
    variables: {
      ...queryOptions?.variables,
      first: perPage,
      ...getCurrentFilters(search),
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
    return null;
  }

  const { pageInfo } = kills;

  return (
    <div>
      {title && (
        <div className="is-size-4 is-family-secondary is-uppercase">
          {title} {kills.totalCount != null && kills.totalCount}
        </div>
      )}
      <KillsListTable
        data={kills.nodes}
        showTime={showTime}
        showKiller={showKiller}
        showVictim={showVictim}
      />
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </div>
  );
};
