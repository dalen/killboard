import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Query } from '../../types';
import { ErrorMessage } from '../global/ErrorMessage';
import { getCurrentFilters } from '../kill/KillsFilters';
import { SkirmishListTable } from './SkirmishListTable';
import { QueryPagination } from '../global/QueryPagination';

export function SkirmishList({
  query,
  queryOptions,
  perPage,
  title = undefined,
  showZone = true,
}: {
  query: DocumentNode;
  queryOptions?: QueryHookOptions;
  perPage: number;
  title?: string | null;
  showZone?: boolean;
}): React.ReactElement | null {
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

  if (loading) return <progress className="progress" />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const skirmishes = data?.skirmishes;

  if (skirmishes?.nodes == null) return <p>{t('common:error')}</p>;

  if (skirmishes.nodes.length === 0) return null;

  const { pageInfo } = skirmishes;

  return (
    <div>
      {title && (
        <div className="is-size-4 is-family-secondary is-uppercase">
          {title} {skirmishes.totalCount != null && skirmishes.totalCount}
        </div>
      )}
      <SkirmishListTable data={skirmishes.nodes} showZone={showZone} />
      <QueryPagination
        pageInfo={pageInfo}
        perPage={perPage}
        refetch={refetch}
      />
    </div>
  );
}
