import { ReactNode } from 'react';
import { Button } from 'react-bulma-components';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { PageInfo, Query } from '../types';

export function QueryPagination({
  pageInfo,
  perPage,
  refetch,
}: {
  pageInfo: PageInfo;
  perPage: number;
  refetch: (
    variables?: Partial<OperationVariables>,
  ) => Promise<ApolloQueryResult<Query>>;
}): ReactNode {
  const { t } = useTranslation(['common']);

  if (!pageInfo) {
    return null;
  }

  return (
    <div className="field is-grouped is-pulled-right">
      {pageInfo.hasPreviousPage && (
        <Button
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
          {t('common:prevPage')}
          <i className="fas fa-circle-chevron-left ml-1" />
        </Button>
      )}
      {pageInfo.hasNextPage && (
        <Button
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
          {t('common:nextPage')}
          <i className="fas fa-circle-chevron-right ml-1" />
        </Button>
      )}
    </div>
  );
}
