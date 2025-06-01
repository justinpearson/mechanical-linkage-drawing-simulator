import { useCallback, useEffect, useRef, useState } from 'react';
import type { Tool, Wheel, Rod, Pivot, Point } from './types';
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
}

export const Canvas = ({
  selectedTool,
  wheels,
  rods,
  pivots,
  onAddWheel,
  onAddRod,
  onAddPivot,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);

  // Draw everything on the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set default styles
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'black';

    // Draw wheels
    wheels.forEach(wheel => {
      ctx.beginPath();
      ctx.arc(wheel.center.x, wheel.center.y, wheel.radius, 0, Math.PI * 2);
      ctx.stroke();
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
    
    if (selectedTool === 'wheel') {
      onAddWheel({
        id: `wheel-${Date.now()}`,
        center: point,
        radius: 30, // Default radius
      });
    } else if (selectedTool === 'rod') {
      setIsDrawing(true);
      setStartPoint(point);
      setCurrentPoint(point);
    } else if (selectedTool === 'pivot') {
      onAddPivot({
        id: `pivot-${Date.now()}`,
        position: point,
      });
    }
  }, [selectedTool, onAddWheel, onAddRod, onAddPivot]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || selectedTool !== 'rod') return;
    setCurrentPoint(getCanvasPoint(e));
  }, [isDrawing, startPoint, selectedTool]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || selectedTool !== 'rod') return;

    const endPoint = getCanvasPoint(e);
    onAddRod({
      id: `rod-${Date.now()}`,
      start: startPoint,
      end: endPoint,
    });

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
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