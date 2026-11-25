import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Link, useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { InstanceRunsList } from '@/components/instance_run/InstanceRunsList';
import { InstanceRecentCharacters } from '@/components/instance_statistics/InstanceRecentCharacters';
import { InstanceRecentLeaderboard } from '@/components/instance_statistics/InstanceRecentLeaderboard';
import type { ReactElement } from 'react';

const INSTANCE_DETAIL = gql`
  query InstanceDetail($id: ID!) {
    instance(id: $id) {
      id
      name
    }
  }
`;

type InstanceTab = 'runs' | 'characters' | 'leaderboards';

export const Instance = (): ReactElement => {
  const { id = '' } = useParams();
  const [search] = useSearchParams();
  const { t } = useTranslation(['common', 'pages']);
  const { data, error, loading } = useQuery<Query>(INSTANCE_DETAIL, {
    variables: { id },
  });
  const requestedTab = search.get('tab');
  const activeTab: InstanceTab =
    requestedTab === 'characters' || requestedTab === 'leaderboards'
      ? requestedTab
      : 'runs';

  if (loading) {
    return <progress className="progress" />;
  }
  if (error) {
    return <ErrorMessage name={error.name} message={error.message} />;
  }
  if (!data?.instance) {
    return <ErrorMessage customText={t('common:notFound')} />;
  }

  const { instance } = data;

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li>
            <Link to="/instances">{t('common:instances')}</Link>
          </li>
          <li className="is-active">
            <span aria-current="page">{instance.name}</span>
          </li>
        </ul>
      </nav>

      <div className="card mb-5">
        <div className="card-content">
          <h1 className="title is-4">{instance.name}</h1>
        </div>
      </div>

      <div className="tabs is-boxed">
        <ul>
          {(['runs', 'characters', 'leaderboards'] as const).map((tab) => (
            <li key={tab} className={activeTab === tab ? 'is-active' : ''}>
              <Link to={`/instance/${id}?tab=${tab}`}>
                {t(`pages:instanceHub.tabs.${tab}`)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {activeTab === 'runs' && <InstanceRunsList instanceId={id} />}

      {activeTab === 'characters' && (
        <InstanceRecentCharacters instanceId={id} />
      )}

      {activeTab === 'leaderboards' && (
        <InstanceRecentLeaderboard instanceId={id} />
      )}
    </div>
  );
};
