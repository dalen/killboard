import { useEffect, useRef } from 'react';
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
}): JSX.Element {
  const divElement = useRef<HTMLDivElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasElement.current == null || divElement.current == null) return;
    var heat = simpleheat(canvasElement.current);
    heat
      .data(data)
      .max(max)
      .radius((size / 64) * 3)
      .draw();
  });

  return (
    <div
      ref={divElement}
      style={{ width: `${size}px`, height: `${size}px`, position: 'relative' }}
    >
      <img src={`/images/maps/${zoneId}.webp`} />
      <canvas
        ref={canvasElement}
        width={size}
        height={size}
        style={{ position: 'absolute', left: '0px', top: '0px' }}
      />
    </div>
  );
}
