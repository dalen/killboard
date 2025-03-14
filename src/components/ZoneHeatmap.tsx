import { ReactElement, useEffect, useRef } from 'react';
import simpleheat from 'simpleheat';

export function ZoneHeatmap({
  zoneId,
  max,
  data,
  size = 640,
}: {
  zoneId: string;
  max: number;
  data: [number, number, number][];
  size: number;
}): ReactElement {
  const divElement = useRef<HTMLDivElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasElement.current == null || divElement.current == null) return;
    const heat = simpleheat(canvasElement.current);
    heat
      .data(data)
      .max(max)
      .radius((size / 64) * 2.4)
      .draw();
  });

  return (
    <div
      ref={divElement}
      style={{ width: `${size}px`, height: `${size}px`, position: 'relative' }}
    >
      <img src={`/images/maps/${zoneId}.webp`} alt="Zone kills heatmap" />
      <canvas
        ref={canvasElement}
        width={size}
        height={size}
        style={{ position: 'absolute', left: '0px', top: '0px' }}
      />
    </div>
  );
}
