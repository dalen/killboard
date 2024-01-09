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
}): JSX.Element {
  const frame = (() => {
    switch (frameType) {
      case 'circle':
        return selected
          ? '/images/icons/round_frame_press.png'
          : '/images/icons/round_frame.png';
      case 'hex':
        return selected
          ? '/images/icons/hex_frame_press.png'
          : '/images/icons/hex_frame.png';
      default:
        return selected
          ? '/images/icons/square_frame_press.png'
          : '/images/icons/square_frame.png';
    }
  })();

  return (
    <div
      style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}
    >
      <img
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        src={`https://armory.returnofreckoning.com/icon/${icon}`}
        alt={alt || `Icon ${icon}`}
        width={size}
        height={size}
      />
      <img
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
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
            top: 0,
            right: 0,
          }}
        >
          {count}
        </div>
      )}
    </div>
  );
}
