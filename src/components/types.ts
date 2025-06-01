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