import type { ReactElement } from 'react';

export function WarIcon({
  icon,
  size,
  alt,
  count,
  frameType = 'square',
  selected = false,
}: {
  icon: number;
  size: number;
  alt?: string;
  count?: number;
  frameType?: 'square' | 'circle' | 'hex';
  selected?: boolean;
}): ReactElement {
  const frame = (() => {
    switch (frameType) {
      case 'circle': {
        return selected
          ? '/images/icons/round_frame_press.png'
          : '/images/icons/round_frame.png';
      }
      case 'hex': {
        return selected
          ? '/images/icons/hex_frame_press.png'
          : '/images/icons/hex_frame.png';
      }
      default: {
        return selected
          ? '/images/icons/square_frame_press.png'
          : '/images/icons/square_frame.png';
      }
    }
  })();

  return (
    <div
      style={{ height: `${size}px`, position: 'relative', width: `${size}px` }}
    >
      <img
        style={{
          left: 0,
          position: 'absolute',
          top: 0,
        }}
        src={`https://armory.returnofreckoning.com/icon/${icon}`}
        alt={alt || `Icon ${icon}`}
        width={size}
        height={size}
      />
      <img
        style={{
          left: 0,
          position: 'absolute',
          top: 0,
        }}
        src={frame}
        alt="Icon frame"
        width={size}
        height={size}
      />
      {count && (
        <div
          className="has-text-weight-bold s-1"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          {count}
        </div>
      )}
    </div>
  );
}
