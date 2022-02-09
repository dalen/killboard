import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export const Map = ({
  x,
  y,
  zoneId,
}: {
  x?: number;
  y?: number;
  zoneId?: number;
}): JSX.Element => {
  const { t } = useTranslation('components');
  const canvasElement = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasElement.current) {
      const iconSize = 16;
      const canvasWidth = canvasElement.current.width;
      canvasElement.current.height = canvasWidth;
      const xTranslated = x
        ? (x / 65535) * canvasWidth - iconSize / 2
        : undefined;
      const yTranslated = y
        ? (y / 65535) * canvasWidth - iconSize / 2
        : undefined;
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
            canvasWidth
          );
          // load the indicator image after the map, so it is drawn on top
          skullImage.src = '/images/maps/icons/skull_red.png';
        };
        skullImage.onload = () => {
          xTranslated &&
            yTranslated &&
            ctx.drawImage(
              skullImage,
              xTranslated,
              yTranslated,
              iconSize,
              iconSize
            );
        };
      }
    }
  }, [x, y, zoneId]);

  return (
    <>
      <div className="is-size-4 is-family-secondary is-uppercase ">
        {t('map.title')}
      </div>
      <canvas ref={canvasElement} style={{ width: '100%' }} />
    </>
  );
};
