import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router';
import { ReactElement } from 'react';
import { ZoneMapComponent } from '@/components/map/ZoneMapComponent';

export function ZoneMap(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  return (
    <div className="container is-max-widescreen mt-2">
      <nav className="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li>
            <Link to="/">{t('common:home')}</Link>
          </li>
          <li className="is-active">
            <Link to={`/zone_heatmap/${id}`}>
              {t('pages:mapPage.zoneId', { zoneId: id })}
            </Link>
          </li>
        </ul>
      </nav>
      <ZoneMapComponent zoneId={Number(id)} />
    </div>
  );
}
