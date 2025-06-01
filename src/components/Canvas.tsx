import { useCallback, useEffect, useRef, useState } from 'react';
import type { Tool, Wheel, Rod, Pivot, Point, SelectionType, DragType, SelectionState } from './types';
import styled from '@emotion/styled';

const CanvasContainer = styled.div`
  width: 800px;
  height: 600px;
  margin: 20px auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const StyledCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
`;

interface CanvasProps {
  selectedTool: Tool;
  wheels: Wheel[];
  rods: Rod[];
  pivots: Pivot[];
  onAddWheel: (wheel: Wheel) => void;
  onAddRod: (rod: Rod) => void;
  onAddPivot: (pivot: Pivot) => void;
  onUpdateWheel: (wheel: Wheel) => void;
  onUpdateRod: (rod: Rod) => void;
  onUpdatePivot: (pivot: Pivot) => void;
}

// Hit testing functions
const isPointNearLine = (point: Point, start: Point, end: Point, threshold: number = 5): boolean => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  if (length === 0) return false;
  
  const t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / (length * length);
  if (t < 0 || t > 1) return false;
  
  const projX = start.x + t * dx;
  const projY = start.y + t * dy;
  const dist = Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
  
  return dist <= threshold;
};

const isPointNearPoint = (p1: Point, p2: Point, threshold: number = 5): boolean => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy) <= threshold;
};

const hitTestWheel = (point: Point, wheel: Wheel): { type: SelectionType; dragType: DragType } | null => {
  const distFromCenter = Math.sqrt(
    (point.x - wheel.center.x) ** 2 + (point.y - wheel.center.y) ** 2
  );
  
  if (distFromCenter <= wheel.radius) {
    // Check if near edge (within 5 pixels)
    if (Math.abs(distFromCenter - wheel.radius) <= 5) {
      return { type: 'wheel', dragType: 'wheel-edge' };
    }
    // Otherwise it's a center drag
    return { type: 'wheel', dragType: 'wheel-center' };
  }
  
  return null;
};

const hitTestRod = (point: Point, rod: Rod): { type: SelectionType; dragType: DragType } | null => {
  // Check if near endpoints
  if (isPointNearPoint(point, rod.start)) {
    return { type: 'rod', dragType: 'rod-end' };
  }
  if (isPointNearPoint(point, rod.end)) {
    return { type: 'rod', dragType: 'rod-end' };
  }
  
  // Check if near the line
  if (isPointNearLine(point, rod.start, rod.end)) {
    return { type: 'rod', dragType: 'rod-middle' };
  }
  
  return null;
};

const hitTestPivot = (point: Point, pivot: Pivot): { type: SelectionType; dragType: DragType } | null => {
  if (isPointNearPoint(point, pivot.position)) {
    return { type: 'pivot', dragType: 'pivot' };
  }
  return null;
};

export const Canvas = ({
  selectedTool,
  wheels,
  rods,
  pivots,
  onAddWheel,
  onAddRod,
  onAddPivot,
  onUpdateWheel,
  onUpdateRod,
  onUpdatePivot,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedId: null,
    selectionType: null,
    dragType: null,
    dragStartPoint: null,
    originalElement: null,
  });

  // Draw everything on the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    const gridSize = 20;

    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Set default styles for elements
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'black';

    // Draw wheels
    wheels.forEach(wheel => {
      ctx.beginPath();
      ctx.arc(wheel.center.x, wheel.center.y, wheel.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.stroke();

      // Draw radial line to show orientation (from center to edge at 0 radians)
      ctx.beginPath();
      ctx.moveTo(wheel.center.x, wheel.center.y);
      ctx.lineTo(wheel.center.x + wheel.radius, wheel.center.y);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = 'black'; // reset for other elements
      ctx.lineWidth = 2;
    });

    // Draw rods
    rods.forEach(rod => {
      ctx.beginPath();
      ctx.moveTo(rod.start.x, rod.start.y);
      ctx.lineTo(rod.end.x, rod.end.y);
      ctx.stroke();
    });

    // Draw pivots
    pivots.forEach(pivot => {
      ctx.beginPath();
      ctx.arc(pivot.position.x, pivot.position.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw preview for rod being drawn
    if (isDrawing && startPoint && currentPoint) {
      ctx.strokeStyle = 'gray';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [wheels, rods, pivots, isDrawing, startPoint, currentPoint]);

  // Set canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match container size
    canvas.width = 800;
    canvas.height = 600;
    draw();
  }, [draw]);

  // Redraw when elements change
  useEffect(() => {
    draw();
  }, [draw]);

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);
    console.log('Canvas MouseDown', { point, selectedTool });
    
    if (selectedTool === 'select') {
      // Hit test all elements
      for (const wheel of wheels) {
        const hit = hitTestWheel(point, wheel);
        if (hit) {
          setSelectionState({
            selectedId: wheel.id,
            selectionType: hit.type,
            dragType: hit.dragType,
            dragStartPoint: point,
            originalElement: wheel,
          });
          return;
        }
      }
      
      for (const rod of rods) {
        const hit = hitTestRod(point, rod);
        if (hit) {
          setSelectionState({
            selectedId: rod.id,
            selectionType: hit.type,
            dragType: hit.dragType,
            dragStartPoint: point,
            originalElement: rod,
          });
          return;
        }
      }
      
      for (const pivot of pivots) {
        const hit = hitTestPivot(point, pivot);
        if (hit) {
          setSelectionState({
            selectedId: pivot.id,
            selectionType: hit.type,
            dragType: hit.dragType,
            dragStartPoint: point,
            originalElement: pivot,
          });
          return;
        }
      }
      
      // If we get here, nothing was hit
      setSelectionState({
        selectedId: null,
        selectionType: null,
        dragType: null,
        dragStartPoint: null,
        originalElement: null,
      });
    } else if (selectedTool === 'wheel') {
      console.log('Placing wheel at', point);
      onAddWheel({
        id: `wheel-${Date.now()}`,
        center: point,
        radius: 30, // Default radius
      });
    } else if (selectedTool === 'rod') {
      console.log('Start drawing rod at', point);
      setIsDrawing(true);
      setStartPoint(point);
      setCurrentPoint(point);
    } else if (selectedTool === 'pivot') {
      console.log('Placing pivot at', point);
      onAddPivot({
        id: `pivot-${Date.now()}`,
        position: point,
      });
    }
  }, [selectedTool, onAddWheel, onAddRod, onAddPivot, wheels, rods, pivots]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);
    
    if (isDrawing && startPoint && selectedTool === 'rod') {
      console.log('Drawing rod preview to', point);
      setCurrentPoint(point);
      return;
    }
    
    if (selectedTool === 'select' && selectionState.dragType && selectionState.dragStartPoint && selectionState.originalElement) {
      const dx = point.x - selectionState.dragStartPoint.x;
      const dy = point.y - selectionState.dragStartPoint.y;
      
      if (selectionState.selectionType === 'wheel' && selectionState.originalElement) {
        const wheel = selectionState.originalElement as Wheel;
        if (selectionState.dragType === 'wheel-center') {
          // Move wheel center
          onUpdateWheel({
            ...wheel,
            center: {
              x: wheel.center.x + dx,
              y: wheel.center.y + dy,
            },
          });
        } else if (selectionState.dragType === 'wheel-edge') {
          // Resize wheel
          const newRadius = Math.sqrt(
            (point.x - wheel.center.x) ** 2 + (point.y - wheel.center.y) ** 2
          );
          onUpdateWheel({
            ...wheel,
            radius: newRadius,
          });
        }
      } else if (selectionState.selectionType === 'rod' && selectionState.originalElement) {
        const rod = selectionState.originalElement as Rod;
        if (selectionState.dragType === 'rod-end') {
          // Move rod endpoint
          const isStart = isPointNearPoint(selectionState.dragStartPoint, rod.start);
          onUpdateRod({
            ...rod,
            [isStart ? 'start' : 'end']: {
              x: point.x,
              y: point.y,
            },
          });
        } else if (selectionState.dragType === 'rod-middle') {
          // Move entire rod
          onUpdateRod({
            ...rod,
            start: {
              x: rod.start.x + dx,
              y: rod.start.y + dy,
            },
            end: {
              x: rod.end.x + dx,
              y: rod.end.y + dy,
            },
          });
        }
      } else if (selectionState.selectionType === 'pivot' && selectionState.originalElement) {
        const pivot = selectionState.originalElement as Pivot;
        // Move pivot
        onUpdatePivot({
          ...pivot,
          position: {
            x: pivot.position.x + dx,
            y: pivot.position.y + dy,
          },
        });
      }
      
      // Update drag start point
      setSelectionState(prev => ({
        ...prev,
        dragStartPoint: point,
      }));
    }
  }, [isDrawing, startPoint, selectedTool, selectionState, onUpdateWheel, onUpdateRod, onUpdatePivot]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && startPoint && selectedTool === 'rod') {
      const endPoint = getCanvasPoint(e);
      console.log('Finish drawing rod at', endPoint);
      onAddRod({
        id: `rod-${Date.now()}`,
        start: startPoint,
        end: endPoint,
      });

      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPoint(null);
    } else if (selectedTool === 'select') {
      // Clear selection state
      setSelectionState({
        selectedId: null,
        selectionType: null,
        dragType: null,
        dragStartPoint: null,
        originalElement: null,
      });
    }
  }, [isDrawing, startPoint, selectedTool, onAddRod]);

  return (
    <CanvasContainer>
      <StyledCanvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </CanvasContainer>
  );
}; 