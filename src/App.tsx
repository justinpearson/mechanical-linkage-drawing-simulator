import { useState } from 'react'
import { Canvas } from './components/Canvas'
import { Toolbar } from './components/Toolbar'
import type { Tool, Wheel, Rod, Pivot } from './components/types'
import './App.css'

function App() {
  const [selectedTool, setSelectedTool] = useState<Tool>('select')
  const [wheels, setWheels] = useState<Wheel[]>([])
  const [rods, setRods] = useState<Rod[]>([])
  const [pivots, setPivots] = useState<Pivot[]>([])

  const handleAddWheel = (wheel: Wheel) => {
    setWheels(prev => [...prev, wheel])
  }

  const handleAddRod = (rod: Rod) => {
    setRods(prev => [...prev, rod])
  }

  const handleAddPivot = (pivot: Pivot) => {
    setPivots(prev => [...prev, pivot])
  }

  return (
    <div className="app">
      <Toolbar selectedTool={selectedTool} onToolSelect={setSelectedTool} />
      <Canvas
        selectedTool={selectedTool}
        wheels={wheels}
        rods={rods}
        pivots={pivots}
        onAddWheel={handleAddWheel}
        onAddRod={handleAddRod}
        onAddPivot={handleAddPivot}
      />
      <div style={{ width: 800, margin: '20px auto' }}>
        <h3>Elements</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Type</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Position</th>
            </tr>
          </thead>
          <tbody>
            {wheels.map(wheel => (
              <tr key={wheel.id}>
                <td style={{ padding: 8 }}>Wheel</td>
                <td style={{ padding: 8 }}>{`(${wheel.center.x.toFixed(1)}, ${wheel.center.y.toFixed(1)})`}</td>
              </tr>
            ))}
            {rods.map(rod => {
              const midX = (rod.start.x + rod.end.x) / 2;
              const midY = (rod.start.y + rod.end.y) / 2;
              return (
                <tr key={rod.id}>
                  <td style={{ padding: 8 }}>Rod</td>
                  <td style={{ padding: 8 }}>{`(${midX.toFixed(1)}, ${midY.toFixed(1)})`}</td>
                </tr>
              );
            })}
            {pivots.map(pivot => (
              <tr key={pivot.id}>
                <td style={{ padding: 8 }}>Pivot</td>
                <td style={{ padding: 8 }}>{`(${pivot.position.x.toFixed(1)}, ${pivot.position.y.toFixed(1)})`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
