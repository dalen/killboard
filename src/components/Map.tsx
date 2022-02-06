import React, { useEffect, useRef } from 'react';

export const Map = ({
  x,
  y,
  zoneId,
  scenarioId,
}: {
  x?: number;
  y?: number;
  zoneId?: number;
  scenarioId?: number;
}): JSX.Element => {
  const canvasElement = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasElement.current) {
      const canvasWidth = canvasElement.current.width;
      canvasElement.current.height = canvasWidth;
      const xTranslated = x ? (x / 65535) * canvasWidth : undefined;
      const yTranslated = y ? (y / 65535) * canvasWidth : undefined;
      const ctx = canvasElement.current.getContext('2d');
      if (ctx) {
        const image = new Image();
        const skullImage = new Image();
        image.src = scenarioId
          ? `/images/maps/zones/${scenarioId}.webp`
          : `/images/maps/zones/${zoneId}.webp`;
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
            ctx.drawImage(skullImage, xTranslated, yTranslated, 16, 16);
        };
      }
    }
  }, []);

  return (
    <div>
      <div className="is-size-4 is-family-secondary is-uppercase ">
        Location
      </div>
      <canvas ref={canvasElement} style={{ width: '100%' }} />
    </div>
  );
};
