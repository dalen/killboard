import { Breadcrumb, Container } from 'react-bulma-components';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Creature(): JSX.Element {
  const { t } = useTranslation(['common', 'pages']);

  const { id } = useParams();
  return (
    <Container max breakpoint="widescreen" mt={2}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">{t('common:home')}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <Link to={`/creature/${id}`}>
            {t('pages:creature.creatureId', { creatureId: id })}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    </Container>
  );
}
