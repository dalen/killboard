import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { InstanceRunsFilters } from '@/components/instance_run/InstanceRunsFilters';
import { InstanceRunsList } from '@/components/instance_run/InstanceRunsList';

export function InstanceRuns() {
  const { t } = useTranslation(['common', 'pages']);

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to="/instance-runs">{t('pages:instanceRuns.title')}</Link>
          </li>
        </ul>
      </nav>
      <InstanceRunsFilters />
      <InstanceRunsList />
    </div>
  );
}
