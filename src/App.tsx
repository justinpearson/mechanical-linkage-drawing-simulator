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
  const [history, setHistory] = useState<{ message: string; timestamp: Date }[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleAddWheel = (wheel: Wheel) => {
    const message = `Add Wheel at (${wheel.center.x.toFixed(1)}, ${wheel.center.y.toFixed(1)})`;
    console.log(message);
    setHistory(prev => [{ message, timestamp: new Date() }, ...prev]);
    setWheels(prev => [wheel, ...prev])
  }

  const handleAddRod = (rod: Rod) => {
    const message = `Add Rod from (${rod.start.x.toFixed(1)}, ${rod.start.y.toFixed(1)}) to (${rod.end.x.toFixed(1)}, ${rod.end.y.toFixed(1)})`;
    console.log(message);
    setHistory(prev => [{ message, timestamp: new Date() }, ...prev]);
    setRods(prev => [rod, ...prev])
  }

  const handleAddPivot = (pivot: Pivot) => {
    const message = `Add Pivot at (${pivot.position.x.toFixed(1)}, ${pivot.position.y.toFixed(1)})`;
    console.log(message);
    setHistory(prev => [{ message, timestamp: new Date() }, ...prev]);
    setPivots(prev => [pivot, ...prev])
  }

  const handleUpdateWheel = (wheel: Wheel, isDragComplete: boolean = false) => {
    if (isDragComplete) {
      const message = `Update Wheel at (${wheel.center.x.toFixed(1)}, ${wheel.center.y.toFixed(1)})`;
      console.log(message);
      setHistory(prev => [{ message, timestamp: new Date() }, ...prev]);
    }
    setWheels(prev => prev.map(w => w.id === wheel.id ? wheel : w));
  }

  const handleUpdateRod = (rod: Rod, isDragComplete: boolean = false) => {
    if (isDragComplete) {
      const message = `Update Rod from (${rod.start.x.toFixed(1)}, ${rod.start.y.toFixed(1)}) to (${rod.end.x.toFixed(1)}, ${rod.end.y.toFixed(1)})`;
      console.log(message);
      setHistory(prev => [{ message, timestamp: new Date() }, ...prev]);
    }
    setRods(prev => prev.map(r => r.id === rod.id ? rod : r));
  }

  const handleUpdatePivot = (pivot: Pivot, isDragComplete: boolean = false) => {
    if (isDragComplete) {
      const message = `Update Pivot at (${pivot.position.x.toFixed(1)}, ${pivot.position.y.toFixed(1)})`;
      console.log(message);
      setHistory(prev => [{ message, timestamp: new Date() }, ...prev]);
    }
    setPivots(prev => prev.map(p => p.id === pivot.id ? pivot : p));
  }

  const handleDeleteAll = () => {
    const message = 'Delete all elements';
    console.log(message);
    setHistory(prev => [{ message, timestamp: new Date() }, ...prev]);
    setWheels([]);
    setRods([]);
    setPivots([]);
  }

  const handleClearHistory = () => {
    setHistory([]);
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString();
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
          setHistory(prev => [{ message, timestamp: new Date() }, ...prev]);
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
          onUpdateWheel={handleUpdateWheel}
          onUpdateRod={handleUpdateRod}
          onUpdatePivot={handleUpdatePivot}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
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
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'center', padding: 8 }}>Selected</th>
            </tr>
          </thead>
          <tbody>
            {wheels.map(wheel => (
              <tr key={wheel.id}>
                <td style={{ padding: 8 }}>Wheel</td>
                <td style={{ padding: 8 }}>{`(${wheel.center.x.toFixed(1)}, ${wheel.center.y.toFixed(1)})`}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(wheel.id)}
                    onChange={() => {
                      const newSelectedIds = new Set(selectedIds);
                      if (newSelectedIds.has(wheel.id)) {
                        newSelectedIds.delete(wheel.id);
                      } else {
                        newSelectedIds.add(wheel.id);
                      }
                      setSelectedIds(newSelectedIds);
                    }}
                  />
                </td>
              </tr>
            ))}
            {rods.map(rod => {
              const midX = (rod.start.x + rod.end.x) / 2;
              const midY = (rod.start.y + rod.end.y) / 2;
              return (
                <tr key={rod.id}>
                  <td style={{ padding: 8 }}>Rod</td>
                  <td style={{ padding: 8 }}>{`(${midX.toFixed(1)}, ${midY.toFixed(1)})`}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(rod.id)}
                      onChange={() => {
                        const newSelectedIds = new Set(selectedIds);
                        if (newSelectedIds.has(rod.id)) {
                          newSelectedIds.delete(rod.id);
                        } else {
                          newSelectedIds.add(rod.id);
                        }
                        setSelectedIds(newSelectedIds);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
            {pivots.map(pivot => (
              <tr key={pivot.id}>
                <td style={{ padding: 8 }}>Pivot</td>
                <td style={{ padding: 8 }}>{`(${pivot.position.x.toFixed(1)}, ${pivot.position.y.toFixed(1)})`}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(pivot.id)}
                    onChange={() => {
                      const newSelectedIds = new Set(selectedIds);
                      if (newSelectedIds.has(pivot.id)) {
                        newSelectedIds.delete(pivot.id);
                      } else {
                        newSelectedIds.add(pivot.id);
                      }
                      setSelectedIds(newSelectedIds);
                    }}
                  />
                </td>
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
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Time</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={index}>
                <td style={{ padding: 8 }}>{formatTimestamp(entry.timestamp)}</td>
                <td style={{ padding: 8 }}>{entry.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
