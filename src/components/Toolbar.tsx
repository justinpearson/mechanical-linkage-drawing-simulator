import styled from '@emotion/styled';
import type { Tool } from './types';

const ToolbarContainer = styled.div`
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToolButton = styled.button<{ isSelected: boolean }>`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: ${props => props.isSelected ? '#e0e0e0' : 'white'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
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
  const tools: { id: Tool; icon: string }[] = [
    { id: 'select', icon: '👆' },
    { id: 'wheel', icon: '⭕' },
    { id: 'rod', icon: '📏' },
    { id: 'pivot', icon: '📍' },
  ];

  return (
    <ToolbarContainer>
      {tools.map(tool => (
        <ToolButton
          key={tool.id}
          isSelected={selectedTool === tool.id}
          onClick={() => onToolSelect(tool.id)}
          title={tool.id.charAt(0).toUpperCase() + tool.id.slice(1)}
        >
          {tool.icon}
        </ToolButton>
      ))}
    </ToolbarContainer>
  );
}; 