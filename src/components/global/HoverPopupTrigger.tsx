import { useRef, type ReactElement, type ReactNode } from 'react';
import Tippy from '@tippyjs/react';
import type { Placement } from 'tippy.js';

const getFallbackPlacements = (placement: Placement): Placement[] => {
  if (placement.startsWith('top')) {
    return ['bottom', 'right', 'left'];
  }
  if (placement.startsWith('right')) {
    return ['left-start', 'bottom-start', 'top-start'];
  }
  if (placement.startsWith('left')) {
    return ['right-start', 'bottom-start', 'top-start'];
  }
  return ['top', 'right', 'left'];
};

export const HoverPopupTrigger = ({
  children,
  content,
  placement = 'top',
  offset,
}: {
  children: ReactElement;
  content: ReactNode;
  placement?: Placement;
  offset?: [number, number];
}): ReactElement => {
  const resizeObserver = useRef<ResizeObserver | null>(null);

  return (
    <Tippy
      appendTo={() => document.body}
      duration={0}
      placement={placement}
      offset={offset}
      onMount={(instance) => {
        resizeObserver.current = new ResizeObserver(() => {
          void instance.popperInstance?.update();
        });
        resizeObserver.current.observe(instance.popper);
      }}
      onHidden={() => {
        resizeObserver.current?.disconnect();
        resizeObserver.current = null;
      }}
      popperOptions={{
        strategy: 'fixed',
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: getFallbackPlacements(placement),
              padding: 8,
              rootBoundary: 'viewport',
            },
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true,
              boundary: 'viewport',
              padding: 8,
              rootBoundary: 'viewport',
            },
          },
        ],
      }}
      content={content}
    >
      {children}
    </Tippy>
  );
};
