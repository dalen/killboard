import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import './WarhammerScrollPane.scss';

type ScrollMetrics = {
  scrollable: boolean;
  scrollTop: number;
  maxScroll: number;
  thumbHeight: number;
  thumbTop: number;
  trackHeight: number;
};

const EMPTY_METRICS: ScrollMetrics = {
  scrollable: false,
  scrollTop: 0,
  maxScroll: 0,
  thumbHeight: 34,
  thumbTop: 0,
  trackHeight: 0,
};

export const WarhammerScrollPane = ({
  children,
  className = '',
  viewportClassName = '',
  ariaLabel,
  scrollUpLabel,
  scrollDownLabel,
  viewportTabIndex = 0,
  outerRef,
  style,
  onMouseEnter,
  onMouseLeave,
}: {
  children: ReactNode;
  className?: string;
  viewportClassName?: string;
  ariaLabel: string;
  scrollUpLabel: string;
  scrollDownLabel: string;
  viewportTabIndex?: number;
  outerRef?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}): ReactElement => {
  const viewportId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ y: number; scrollTop: number } | null>(null);
  const [metrics, setMetrics] = useState(EMPTY_METRICS);
  const [dragging, setDragging] = useState(false);

  const updateMetrics = useCallback((): void => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const trackHeight = track.clientHeight;
    const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    const scrollable = maxScroll > 1;
    const thumbHeight = scrollable && trackHeight > 0
      ? Math.min(trackHeight, Math.max(34, viewport.clientHeight / viewport.scrollHeight * trackHeight))
      : scrollable
        ? 34
        : trackHeight;
    const thumbTop = scrollable && maxScroll > 0 && trackHeight > thumbHeight
      ? (viewport.scrollTop / maxScroll) * (trackHeight - thumbHeight)
      : 0;
    setMetrics((previous) => {
      const next = {
        scrollable,
        scrollTop: viewport.scrollTop,
        maxScroll,
        thumbHeight,
        thumbTop,
        trackHeight,
      };
      return Object.keys(next).every((key) =>
        next[key as keyof ScrollMetrics] === previous[key as keyof ScrollMetrics],
      ) ? previous : next;
    });
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = viewport?.firstElementChild;
    if (!viewport || !content) return undefined;
    updateMetrics();
    const observer = new ResizeObserver(updateMetrics);
    observer.observe(viewport);
    observer.observe(content);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [children, updateMetrics]);

  const setScrollTop = (value: number): void => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = Math.max(0, Math.min(value, viewport.scrollHeight - viewport.clientHeight));
  };

  const handleTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if ((event.target as HTMLElement).closest('.warhammer-scroll-thumb')) return;
    const track = trackRef.current;
    if (!track || !metrics.scrollable) return;
    const bounds = track.getBoundingClientRect();
    const ratio = (event.clientY - bounds.top - metrics.thumbHeight / 2) /
      Math.max(1, bounds.height - metrics.thumbHeight);
    setScrollTop(ratio * metrics.maxScroll);
  };

  const handleThumbPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    dragStart.current = { y: event.clientY, scrollTop: viewportRef.current?.scrollTop ?? 0 };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleThumbPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const start = dragStart.current;
    if (!start || metrics.trackHeight <= metrics.thumbHeight) return;
    const scrollPerTrackPixel = metrics.maxScroll / (metrics.trackHeight - metrics.thumbHeight);
    setScrollTop(start.scrollTop + (event.clientY - start.y) * scrollPerTrackPixel);
  };

  const stopDragging = (): void => {
    dragStart.current = null;
    setDragging(false);
  };

  const handleThumbKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const pageStep = Math.max(40, viewport.clientHeight - 40);
    const steps: Record<string, number> = {
      ArrowUp: -40,
      ArrowDown: 40,
      PageUp: -pageStep,
      PageDown: pageStep,
      Home: -metrics.maxScroll,
      End: metrics.maxScroll,
      ' ': pageStep,
    };
    const step = steps[event.key];
    if (step == null) return;
    event.preventDefault();
    if (event.key === 'Home') setScrollTop(0);
    else if (event.key === 'End') setScrollTop(metrics.maxScroll);
    else setScrollTop(viewport.scrollTop + step);
  };

  return (
    <div
      className={`warhammer-scroll-pane ${className}${metrics.scrollable ? ' is-overflowing' : ''}`}
      style={style}
      ref={outerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        id={viewportId}
        ref={viewportRef}
        className={`warhammer-scroll-viewport ${viewportClassName}`}
        onScroll={updateMetrics}
        tabIndex={viewportTabIndex}
        aria-label={ariaLabel}
      >
        <div className="warhammer-scroll-content">{children}</div>
      </div>
      <div
        className={`warhammer-scrollbar${metrics.scrollable ? ' is-scrollable' : ''}`}
        aria-label={ariaLabel}
        aria-hidden={!metrics.scrollable}
      >
          <button
            className="warhammer-scroll-arrow is-up"
            type="button"
            aria-label={scrollUpLabel}
            title={scrollUpLabel}
            disabled={metrics.scrollTop <= 0}
            onClick={() => setScrollTop((viewportRef.current?.scrollTop ?? 0) - 40)}
          />
          <div
            ref={trackRef}
            className="warhammer-scroll-track"
            onPointerDown={handleTrackPointerDown}
          >
            <div
              className={`warhammer-scroll-thumb${dragging ? ' is-dragging' : ''}`}
              role="scrollbar"
              aria-label={ariaLabel}
              aria-orientation="vertical"
              aria-controls={viewportId}
              aria-valuemin={0}
              aria-valuemax={Math.round(metrics.maxScroll)}
              aria-valuenow={Math.round(metrics.scrollTop)}
              tabIndex={0}
              style={{ height: metrics.thumbHeight, top: metrics.thumbTop }}
              onPointerDown={handleThumbPointerDown}
              onPointerMove={handleThumbPointerMove}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              onLostPointerCapture={stopDragging}
              onKeyDown={handleThumbKeyDown}
            />
          </div>
          <button
            className="warhammer-scroll-arrow is-down"
            type="button"
            aria-label={scrollDownLabel}
            title={scrollDownLabel}
            disabled={metrics.scrollTop >= metrics.maxScroll}
            onClick={() => setScrollTop((viewportRef.current?.scrollTop ?? 0) + 40)}
          />
      </div>
    </div>
  );
};
