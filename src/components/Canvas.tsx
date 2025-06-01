import { useCallback, useEffect, useRef, useState } from 'react';
import type { Tool, Wheel, Rod, Pivot, Point, SelectionType, DragType, SelectionState, SelectedElements } from './types';
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
  onUpdateWheel: (wheel: Wheel, isDragComplete?: boolean) => void;
  onUpdateRod: (rod: Rod, isDragComplete?: boolean) => void;
  onUpdatePivot: (pivot: Pivot, isDragComplete?: boolean) => void;
  selectedIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
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
  selectedIds,
  onSelectionChange,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedIds: new Set(),
    selectionType: null,
    dragType: null,
    dragStartPoint: null,
    originalElements: new Map(),
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
      ctx.fillStyle = selectedIds.has(wheel.id) ? '#e6f3ff' : 'white';
      ctx.fill();
      ctx.strokeStyle = selectedIds.has(wheel.id) ? '#0066cc' : 'black';
      ctx.stroke();

      // Draw radial line to show orientation
      ctx.beginPath();
      ctx.moveTo(wheel.center.x, wheel.center.y);
      ctx.lineTo(wheel.center.x + wheel.radius, wheel.center.y);
      ctx.stroke();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
    });

    // Draw rods
    rods.forEach(rod => {
      // Draw the main line
      ctx.beginPath();
      ctx.moveTo(rod.start.x, rod.start.y);
      ctx.lineTo(rod.end.x, rod.end.y);
      ctx.strokeStyle = selectedIds.has(rod.id) ? '#0066cc' : 'black';
      ctx.stroke();

      // Draw circular endpoints
      const endpointRadius = 4;
      ctx.beginPath();
      ctx.arc(rod.start.x, rod.start.y, endpointRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rod.end.x, rod.end.y, endpointRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw pivots
    pivots.forEach(pivot => {
      ctx.beginPath();
      ctx.arc(pivot.position.x, pivot.position.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = selectedIds.has(pivot.id) ? '#0066cc' : 'black';
      ctx.fill();
      // Add a white border to make it more visible
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Reset styles
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
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
  }, [wheels, rods, pivots, isDrawing, startPoint, currentPoint, selectedIds]);

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
      // Find the element under the cursor
      let hitElement: { id: string; type: SelectionType; dragType: DragType } | null = null;
      
      // Check wheels
      for (const wheel of wheels) {
        const hit = hitTestWheel(point, wheel);
        if (hit) {
          hitElement = { id: wheel.id, type: hit.type, dragType: hit.dragType };
          break;
        }
      }
      
      // Check rods if no wheel hit
      if (!hitElement) {
        for (const rod of rods) {
          const hit = hitTestRod(point, rod);
          if (hit) {
            hitElement = { id: rod.id, type: hit.type, dragType: hit.dragType };
            break;
          }
        }
      }
      
      // Check pivots if no rod hit
      if (!hitElement) {
        for (const pivot of pivots) {
          const hit = hitTestPivot(point, pivot);
          if (hit) {
            hitElement = { id: pivot.id, type: hit.type, dragType: hit.dragType };
            break;
          }
        }
      }

      if (hitElement) {
        const newSelectedIds = new Set(selectedIds);
        
        if (e.shiftKey) {
          // Toggle selection with shift key
          if (newSelectedIds.has(hitElement.id)) {
            newSelectedIds.delete(hitElement.id);
          } else {
            newSelectedIds.add(hitElement.id);
          }
        } else {
          // Single selection without shift key
          newSelectedIds.clear();
          newSelectedIds.add(hitElement.id);
        }

        // Store original elements for dragging
        const originalElements = new Map<string, Wheel | Rod | Pivot>();
        newSelectedIds.forEach(id => {
          const wheel = wheels.find(w => w.id === id);
          const rod = rods.find(r => r.id === id);
          const pivot = pivots.find(p => p.id === id);
          if (wheel) originalElements.set(id, wheel);
          if (rod) originalElements.set(id, rod);
          if (pivot) originalElements.set(id, pivot);
        });

        onSelectionChange(newSelectedIds);
        setSelectionState({
          selectedIds: newSelectedIds,
          selectionType: hitElement.type,
          dragType: hitElement.dragType,
          dragStartPoint: point,
          originalElements,
        });
      } else if (!e.shiftKey) {
        // Clear selection if clicking empty space without shift
        onSelectionChange(new Set());
        setSelectionState({
          selectedIds: new Set(),
          selectionType: null,
          dragType: null,
          dragStartPoint: null,
          originalElements: new Map(),
        });
      }
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
  }, [selectedTool, onAddWheel, onAddRod, onAddPivot, wheels, rods, pivots, selectedIds, onSelectionChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);
    
    if (isDrawing && startPoint && selectedTool === 'rod') {
      console.log('Drawing rod preview to', point);
      setCurrentPoint(point);
      return;
    }
    
    if (selectedTool === 'select' && selectionState.dragType && selectionState.dragStartPoint && selectionState.originalElements.size > 0) {
      const dx = point.x - selectionState.dragStartPoint.x;
      const dy = point.y - selectionState.dragStartPoint.y;
      
      // Update all selected elements
      selectionState.selectedIds.forEach(id => {
        const originalElement = selectionState.originalElements.get(id);
        if (!originalElement) return;

        if ('center' in originalElement) { // Wheel
          const wheel = originalElement as Wheel;
          onUpdateWheel({
            ...wheel,
            center: {
              x: wheel.center.x + dx,
              y: wheel.center.y + dy,
            },
          });
        } else if ('start' in originalElement) { // Rod
          const rod = originalElement as Rod;
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
        } else if ('position' in originalElement) { // Pivot
          const pivot = originalElement as Pivot;
          onUpdatePivot({
            ...pivot,
            position: {
              x: pivot.position.x + dx,
              y: pivot.position.y + dy,
            },
          });
        }
      });
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
    } else if (selectedTool === 'select' && selectionState.originalElements.size > 0) {
      // Get the final positions from the current state
      selectionState.selectedIds.forEach(id => {
        const wheel = wheels.find(w => w.id === id);
        const rod = rods.find(r => r.id === id);
        const pivot = pivots.find(p => p.id === id);
        
        if (wheel) {
          onUpdateWheel(wheel, true);
        } else if (rod) {
          onUpdateRod(rod, true);
        } else if (pivot) {
          onUpdatePivot(pivot, true);
        }
      });
      
      // Clear selection state
      setSelectionState({
        selectedIds: new Set(),
        selectionType: null,
        dragType: null,
        dragStartPoint: null,
        originalElements: new Map(),
      });
    }
  }, [isDrawing, startPoint, selectedTool, selectionState, onAddRod, onUpdateWheel, onUpdateRod, onUpdatePivot, wheels, rods, pivots]);

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