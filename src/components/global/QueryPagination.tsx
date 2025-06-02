import { ReactNode } from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { PageInfo } from '@/__generated__/graphql';

export function QueryPagination<T>({
  pageInfo,
  perPage,
  refetch,
}: {
  pageInfo: PageInfo;
  perPage: number;
  refetch: (
    variables?: Partial<OperationVariables>,
  ) => Promise<ApolloQueryResult<T>>;
}): ReactNode {
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
        </button>
      )}
      {pageInfo.hasNextPage && (
        <button
          className="button  is-info is-small"
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
        </button>
      )}
    </div>
  );
}
