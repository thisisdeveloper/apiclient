import React, { useState, useRef, useEffect } from 'react';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultHeight: number;
  minHeight?: number;
  maxHeight?: number;
}

export function ResizablePanel({ 
  children, 
  defaultHeight,
  minHeight = 100,
  maxHeight = window.innerHeight
}: ResizablePanelProps) {
  const [height, setHeight] = useState(defaultHeight);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef<number>(0);
  const dragStartHeight = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const delta = e.clientY - dragStartY.current;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, dragStartHeight.current + delta));
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minHeight, maxHeight]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = height;
  };

  return (
    <div style={{ height }} className="relative">
      {children}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 cursor-row-resize bg-transparent hover:bg-blue-500/10 group"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-gray-300 group-hover:bg-blue-500/50" />
      </div>
    </div>
  );
}