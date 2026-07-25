import { useCallback, useRef, useState, useEffect } from 'react';

interface ResizableSplitPanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultSplit?: number;
  minLeftPercent?: number;
  minRightPercent?: number;
  onSplitChange?: (ratio: number) => void;
}

export function ResizableSplitPanel({
  leftPanel,
  rightPanel,
  defaultSplit = 0.5,
  minLeftPercent = 0.2,
  minRightPercent = 0.2,
  onSplitChange,
}: ResizableSplitPanelProps) {
  const [split, setSplit] = useState(defaultSplit);
  const [isVertical, setIsVertical] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsVertical(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const clamp = useCallback(
    (value: number) => Math.min(1 - minRightPercent, Math.max(minLeftPercent, value)),
    [minLeftPercent, minRightPercent]
  );

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  }, [isVertical]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let ratio: number;
      if (isVertical) {
        ratio = (e.clientY - rect.top) / rect.height;
      } else {
        ratio = (e.clientX - rect.left) / rect.width;
      }
      const clamped = clamp(ratio);
      setSplit(clamped);
      onSplitChange?.(clamped);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isVertical, clamp, onSplitChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = 0.02;
      let newSplit = split;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        newSplit = clamp(split - step);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        newSplit = clamp(split + step);
      } else {
        return;
      }
      e.preventDefault();
      setSplit(newSplit);
      onSplitChange?.(newSplit);
    },
    [split, clamp, onSplitChange]
  );

  const leftStyle = isVertical
    ? { height: `${split * 100}%` }
    : { width: `${split * 100}%` };
  const rightStyle = isVertical
    ? { height: `${(1 - split) * 100}%` }
    : { width: `${(1 - split) * 100}%` };

  return (
    <div
      ref={containerRef}
      className={`flex h-full ${isVertical ? 'flex-col' : 'flex-row'}`}
    >
      <div className="overflow-auto" style={leftStyle}>
        {leftPanel}
      </div>

      {/* Divider */}
      <div
        role="separator"
        aria-orientation={isVertical ? 'horizontal' : 'vertical'}
        aria-valuenow={Math.round(split * 100)}
        aria-valuemin={Math.round(minLeftPercent * 100)}
        aria-valuemax={Math.round((1 - minRightPercent) * 100)}
        aria-label="Resize panels"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        className={`
          flex-shrink-0 bg-gray-200 hover:bg-primary-300 active:bg-primary-400
          transition-colors focus-visible:outline-2 focus-visible:outline-primary-500
          ${isVertical
            ? 'h-1.5 cursor-row-resize w-full'
            : 'w-1.5 cursor-col-resize h-full'
          }
        `}
      />

      <div className="overflow-auto" style={rightStyle}>
        {rightPanel}
      </div>
    </div>
  );
}
