import type { ReactNode } from 'react';
import type { ApolloClient, OperationVariables } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import type { PageInfo } from '@/__generated__/graphql';

export const QueryPagination = <T,>({
  pageInfo,
  perPage,
  refetch,
}: {
  pageInfo: PageInfo;
  perPage: number;
  refetch: (
    variables?: Partial<OperationVariables>,
  ) => Promise<ApolloClient.QueryResult<T>>;
}): ReactNode => {
  const { t } = useTranslation(['common']);

  if (!pageInfo) {
    return null;
  }

  return (
    <div className="field is-grouped is-pulled-right">
      {pageInfo.hasPreviousPage && (
        <button
          className="button  is-info is-small"
          onClick={() => {
            void refetch({
              after: undefined,
              before: pageInfo.startCursor,
              first: undefined,
              last: perPage,
            });
          }}
        >
          {t('common:prevPage')}
          <i className="fas fa-circle-chevron-left ml-1" />
        </button>
      )}
      {pageInfo.hasNextPage && (
        <button
          className="button  is-info is-small"
          onClick={() => {
            void refetch({
              after: pageInfo.endCursor,
              before: undefined,
              first: perPage,
              last: undefined,
            });
          }}
        >
          {t('common:nextPage')}
          <i className="fas fa-circle-chevron-right ml-1" />
        </button>
      )}
    </div>
  );
};
