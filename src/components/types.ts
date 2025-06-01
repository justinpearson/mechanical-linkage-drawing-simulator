export type Tool = 'wheel' | 'rod' | 'pivot' | 'select';

export interface Point {
  x: number;
  y: number;
}

export interface Wheel {
  id: string;
  center: Point;
  radius: number;
}

export interface Rod {
  id: string;
  start: Point;
  end: Point;
}

export interface Pivot {
  id: string;
  position: Point;
}

export interface DrawingState {
  wheels: Wheel[];
  rods: Rod[];
  pivots: Pivot[];
  selectedTool: Tool;
  selectedElement: string | null;
}

// New types for selection and dragging
export type SelectionType = 'wheel' | 'rod' | 'pivot' | null;
export type DragType = 'wheel-center' | 'wheel-edge' | 'rod-end' | 'rod-middle' | 'pivot' | null;

export interface SelectionState {
  selectedId: string | null;
  selectionType: SelectionType;
  dragType: DragType;
  dragStartPoint: Point | null;
  originalElement: Wheel | Rod | Pivot | null;
} 