import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import React from 'react';
import { Progress } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { getCurrentFilters } from './KillsFilters';
import { SkirmishListTable } from './SkirmishListTable';

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

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const skirmishes = data?.skirmishes;
  const pageInfo = skirmishes?.pageInfo;

  if (skirmishes?.nodes == null) return <p>{t('common:error')}</p>;

  if (skirmishes.nodes.length === 0) return null;

  return (
    <div>
      {title && (
        <div className="is-size-4 is-family-secondary is-uppercase">
          {title} {skirmishes.totalCount != null && skirmishes.totalCount}
        </div>
      )}
      <SkirmishListTable
        data={skirmishes.nodes}
        showZone={showZone}
        pageInfo={pageInfo}
        onNext={() =>
          refetch({
            first: perPage,
            after: pageInfo?.endCursor,
            last: undefined,
            before: undefined,
          })
        }
        onPrevious={() =>
          refetch({
            first: undefined,
            after: undefined,
            last: perPage,
            before: pageInfo?.startCursor,
          })
        }
      />
    </div>
  );
}
