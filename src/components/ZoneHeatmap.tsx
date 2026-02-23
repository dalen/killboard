import type { ReactElement} from 'react';
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
}): ReactElement {
  const divElement = useRef<HTMLDivElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasElement.current == null || divElement.current == null) {return;}
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
      style={{ height: `${size}px`, position: 'relative', width: `${size}px` }}
    >
      <img src={`/images/maps/${zoneId}.webp`} alt="Zone kills heatmap" />
      <canvas
        ref={canvasElement}
        width={size}
        height={size}
        style={{ left: '0px', position: 'absolute', top: '0px' }}
      />
    </div>
  );
}
