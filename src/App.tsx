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
  const [history, setHistory] = useState<string[]>([])

  const handleAddWheel = (wheel: Wheel) => {
    const message = `Add Wheel at (${wheel.center.x.toFixed(1)}, ${wheel.center.y.toFixed(1)})`;
    console.log(message);
    setHistory(prev => [...prev, message]);
    setWheels(prev => [...prev, wheel])
  }

  const handleAddRod = (rod: Rod) => {
    const message = `Add Rod from (${rod.start.x.toFixed(1)}, ${rod.start.y.toFixed(1)}) to (${rod.end.x.toFixed(1)}, ${rod.end.y.toFixed(1)})`;
    console.log(message);
    setHistory(prev => [...prev, message]);
    setRods(prev => [...prev, rod])
  }

  const handleAddPivot = (pivot: Pivot) => {
    const message = `Add Pivot at (${pivot.position.x.toFixed(1)}, ${pivot.position.y.toFixed(1)})`;
    console.log(message);
    setHistory(prev => [...prev, message]);
    setPivots(prev => [...prev, pivot])
  }

  const handleDeleteAll = () => {
    const message = 'Delete all elements';
    console.log(message);
    setHistory(prev => [...prev, message]);
    setWheels([]);
    setRods([]);
    setPivots([]);
  }

  const handleClearHistory = () => {
    setHistory([]);
  }

  return (
    <div className="app">
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Mechanical Linkage Drawing Simulator</h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', textAlign: 'left' }}>
          This is a web app for generating drawings via mechanical linkage systems, like the "Spirograph" children's toy, or fancy scrollwork on currency ("intaglio").
          <br /><br />
          A mechanical linkage is basically a collection of rotating wheels and rods that are attached to each other in some way. In this app, the user can create wheels and rods, connect them together, and play an animation that simulates the wheels turning and the linkage arms moving around. It is basically a 2D, lightweight, heavily constrained physics simulator.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <Toolbar selectedTool={selectedTool} onToolSelect={(tool) => { 
          const message = `Select Tool: ${tool}`;
          console.log(message);
          setHistory(prev => [...prev, message]);
          setSelectedTool(tool); 
        }} />
        <Canvas
          selectedTool={selectedTool}
          wheels={wheels}
          rods={rods}
          pivots={pivots}
          onAddWheel={handleAddWheel}
          onAddRod={handleAddRod}
          onAddPivot={handleAddPivot}
        />
      </div>

      <div style={{ width: 800, margin: '20px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>Elements</h3>
          <button 
            onClick={handleDeleteAll}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Delete All
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>History</h3>
          <button 
            onClick={handleClearHistory}
            style={{
              padding: '8px 16px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Clear History
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((action, index) => (
              <tr key={index}>
                <td style={{ padding: 8 }}>{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
