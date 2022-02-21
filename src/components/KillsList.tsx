import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import React from 'react';
import { Progress } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Query } from '../types';
import { ErrorMessage } from './global/ErrorMessage';
import { KillsListTable } from './KillsListTable';

export const KillsList = ({
  query,
  queryOptions,
  perPage,
  showTime = true,
  showVictim = true,
  showKiller = true,
}: {
  query: DocumentNode;
  queryOptions?: QueryHookOptions;
  perPage: number;
  showTime?: boolean;
  showVictim?: boolean;
  showKiller?: boolean;
}): React.ReactElement | null => {
  const { t } = useTranslation(['common', 'components']);
  const { loading, error, data, refetch } = useQuery<Query>(query, {
    ...queryOptions,
    variables: { ...queryOptions?.variables, first: perPage },
  });

  if (loading) return <Progress />;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;

  const kills = data?.kills;
  const pageInfo = kills?.pageInfo;

  if (kills?.nodes == null) return <p>{t('common:error')}</p>;

  if (kills.nodes.length === 0) return null;

  return (
    <div>
      <KillsListTable
        data={kills.nodes}
        showTime={showTime}
        showKiller={showKiller}
        showVictim={showVictim}
        pageInfo={pageInfo}
        onNext={() =>
          refetch({
            first: perPage,
            after: pageInfo?.endCursor,
            last: undefined,
            before: undefined,
          })
        }
      />
    </div>
  );
};
