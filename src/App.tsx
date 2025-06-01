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
    </div>
  )
}

export default App
