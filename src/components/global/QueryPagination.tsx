import type { ReactNode } from 'react';
import type { ApolloClient, OperationVariables } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import type { PageInfo } from '@/__generated__/graphql';

export const QueryPagination = <T,>({
  pageInfo,
  perPage,
  refetch,
  onPerPageChange,
}: {
  pageInfo: PageInfo;
  perPage: number;
  onPerPageChange: (perPage: number) => void;
  refetch: (
    variables?: Partial<OperationVariables>,
  ) => Promise<ApolloClient.QueryResult<T>>;
}): ReactNode => {
  const { t } = useTranslation(['common']);

  if (
    !pageInfo ||
    (!pageInfo.hasPreviousPage && !pageInfo.hasNextPage)
  ) {
    return null;
  }

  return (
    <div className="field is-grouped is-align-items-center is-pulled-right">
      <label className="label is-small mb-0">
        {t('common:itemsPerPage')}
      </label>
      <div className="control">
        <div className="select is-small">
          <select
            aria-label={t('common:itemsPerPage')}
            value={perPage}
            onChange={(event) => {
              const nextPerPage = Number(event.currentTarget.value);
              onPerPageChange(nextPerPage);
              void refetch({
                after: undefined,
                before: undefined,
                first: nextPerPage,
                last: undefined,
              });
            }}
          >
            {[10, 15, 20, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
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
