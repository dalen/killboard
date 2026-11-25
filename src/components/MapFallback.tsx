import { useState } from 'react';
import type { ReactElement } from 'react';

export const MapFallback = ({
  zoneId,
  zoneName,
  mapUnavailableText,
  markersUnavailableText,
}: {
  zoneId?: string;
  zoneName?: string;
  mapUnavailableText: string;
  markersUnavailableText: string;
}): ReactElement => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'missing'>(
    'loading',
  );
  const canShowMap = Boolean(zoneId && zoneName?.trim());
  const mapLoaded = imageState === 'loaded';
  const mapUnavailable = imageState === 'missing' || !canShowMap;

  return (
    <>
      {canShowMap && (
        <figure className="image mb-4" style={{ maxWidth: '640px' }}>
          <img
            src={`/images/maps/${zoneId}.webp`}
            alt={`${zoneName} map`}
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('missing')}
          />
        </figure>
      )}
      {mapLoaded && (
        <div className="notification is-dark mb-0">
          {markersUnavailableText}
        </div>
      )}
      {mapUnavailable && (
        <div className="notification is-dark mb-0">{mapUnavailableText}</div>
      )}
      {!mapLoaded && !mapUnavailable && <progress className="progress" />}
    </>
  );
};
