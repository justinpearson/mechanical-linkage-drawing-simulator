import { Stage, Layer, Circle, Line, Group } from 'react-konva';
import type { Tool, Wheel, Rod, Pivot, Point } from './types';
import { useCallback, useState } from 'react';

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  const handleMouseDown = useCallback((e: any) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    if (selectedTool === 'wheel') {
      onAddWheel({
        id: `wheel-${Date.now()}`,
        center: { x: point.x, y: point.y },
        radius: 30, // Default radius
      });
    } else if (selectedTool === 'rod') {
      setIsDrawing(true);
      setStartPoint({ x: point.x, y: point.y });
    } else if (selectedTool === 'pivot') {
      onAddPivot({
        id: `pivot-${Date.now()}`,
        position: { x: point.x, y: point.y },
      });
    }
  }, [selectedTool, onAddWheel, onAddRod, onAddPivot]);

  const handleMouseMove = useCallback((e: any) => {
    if (!isDrawing || !startPoint || selectedTool !== 'rod') return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    // Update the preview of the rod being drawn
    // This will be handled by the parent component
  }, [isDrawing, startPoint, selectedTool]);

  const handleMouseUp = useCallback((e: any) => {
    if (!isDrawing || !startPoint || selectedTool !== 'rod') return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    onAddRod({
      id: `rod-${Date.now()}`,
      start: startPoint,
      end: { x: point.x, y: point.y },
    });

    setIsDrawing(false);
    setStartPoint(null);
  }, [isDrawing, startPoint, selectedTool, onAddRod]);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {/* Draw wheels */}
        {wheels.map(wheel => (
          <Circle
            key={wheel.id}
            x={wheel.center.x}
            y={wheel.center.y}
            radius={wheel.radius}
            stroke="black"
            strokeWidth={2}
          />
        ))}

        {/* Draw rods */}
        {rods.map(rod => (
          <Line
            key={rod.id}
            points={[rod.start.x, rod.start.y, rod.end.x, rod.end.y]}
            stroke="black"
            strokeWidth={2}
          />
        ))}

        {/* Draw pivots */}
        {pivots.map(pivot => (
          <Group key={pivot.id} x={pivot.position.x} y={pivot.position.y}>
            <Circle radius={5} fill="black" />
          </Group>
        ))}

        {/* Draw preview for rod being drawn */}
        {isDrawing && startPoint && (
          <Line
            points={[
              startPoint.x,
              startPoint.y,
              startPoint.x + 100, // This will be updated in mouseMove
              startPoint.y + 100,
            ]}
            stroke="gray"
            strokeWidth={2}
            dash={[5, 5]}
          />
        )}
      </Layer>
    </Stage>
  );
}; 