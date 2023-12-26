import { forEach } from 'lodash';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export function MapPositions({
  positions,
  zoneId,
  nwCornerX,
  nwCornerY,
  seCornerX,
  seCornerY,
}: {
  positions: { x: number; y: number }[];
  zoneId?: number;
  nwCornerX: number;
  nwCornerY: number;
  seCornerX: number;
  seCornerY: number;
}): JSX.Element {
  const { t } = useTranslation('components');
  const canvasElement = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasElement.current) {
      // or 1 here to avoid any div by zero errors
      const zoneWidth = seCornerX - nwCornerX || 1;
      const zoneHeight = seCornerY - nwCornerY || 1;
      const iconSize = 16;
      const canvasWidth = canvasElement.current.width;
      canvasElement.current.height = canvasWidth;

      const ctx = canvasElement.current.getContext('2d');
      if (ctx) {
        const image = new Image();
        const skullImage = new Image();
        image.src = `/images/maps/${zoneId}.webp`;
        image.onload = () => {
          ctx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            0,
            0,
            canvasWidth,
            canvasWidth,
          );
          // load the indicator image after the map, so it is drawn on top
          skullImage.src = '/images/maps/icons/skull_red.png';
        };
        skullImage.onload = () => {
          forEach(positions, (position) => {
            const xTranslated =
              position.x != null
                ? ((position.x - nwCornerX) / zoneWidth) * canvasWidth -
                  iconSize / 2
                : undefined;
            const yTranslated =
              position.y != null
                ? ((position.y - nwCornerY) / zoneHeight) * canvasWidth -
                  iconSize / 2
                : undefined;

            if (xTranslated && yTranslated) {
              ctx.drawImage(
                skullImage,
                xTranslated,
                yTranslated,
                iconSize,
                iconSize,
              );
            }
          });
        };
      }
    }
  }, [positions, zoneId, nwCornerX, nwCornerY, seCornerX, seCornerY]);

  return (
    <>
      <div className="is-size-4 is-family-secondary is-uppercase ">
        {t('map.title')}
      </div>
      <canvas ref={canvasElement} style={{ width: '100%' }} />
    </>
  );
}
