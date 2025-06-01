import styled from '@emotion/styled';
import type { Tool } from './types';

const ToolbarContainer = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
`;

const ToolButton = styled.button<{ isSelected: boolean }>`
  min-width: 80px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: ${props => props.isSelected ? '#e0e0e0' : 'white'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;

interface ToolbarProps {
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
}

export const Toolbar = ({ selectedTool, onToolSelect }: ToolbarProps) => {
  const tools: { id: Tool; label: string }[] = [
    { id: 'select', label: 'Select' },
    { id: 'wheel', label: 'Wheel' },
    { id: 'rod', label: 'Rod' },
    { id: 'pivot', label: 'Pivot' },
  ];

  return (
    <ToolbarContainer>
      {tools.map(tool => (
        <ToolButton
          key={tool.id}
          isSelected={selectedTool === tool.id}
          onClick={() => onToolSelect(tool.id)}
          title={tool.label}
        >
          {tool.label}
        </ToolButton>
      ))}
    </ToolbarContainer>
  );
}; 