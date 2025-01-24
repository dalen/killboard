import { Breadcrumb, Container } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { InstanceRunsFilters } from '../components/InstanceRunsFilters';
import { InstanceRunsList } from '../components/InstanceRunsList';

export function InstanceRuns() {
  const { t } = useTranslation(['common', 'pages']);

  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to="/instance-runs">{t('pages:instanceRuns.title')}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <InstanceRunsFilters />
      <InstanceRunsList />
    </Container>
  );
}
