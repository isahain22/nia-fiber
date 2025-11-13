import React, { useState } from 'react'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')

  const navigation = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'bare-fiber', label: 'Bare Fiber QC' },
    { id: 'cable-creation', label: 'Buffering Station' },
    { id: 'qc-check', label: 'Final QC' },
    { id: 'search', label: 'Search Cables' },
    { id: 'reports', label: 'Reports' }
  ]

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>NIA FIBER QC TRACK</h1>
          <p>Fiber Optic Quality Control Management System</p>
        </div>
      </header>
      
      <nav className="app-nav">
        {navigation.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'bare-fiber' && <BareFiberInput />}
        {currentView === 'cable-creation' && <CableCreation />}
        {currentView === 'qc-check' && <QCcheck />}
        {currentView === 'search' && <CableSearch />}
        {currentView === 'reports' && <ReportGenerator />}
      </main>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Production Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Fibers Tested Today</h3>
          <p className="stat-number">0</p>
        </div>
        <div className="stat-card">
          <h3>Cables in Progress</h3>
          <p className="stat-number">0</p>
        </div>
        <div className="stat-card">
          <h3>QC Passed Today</h3>
          <p className="stat-number">0</p>
        </div>
      </div>
    </div>
  )
}

// Placeholder components
function BareFiberInput() {
  return <div className="component"><h2>Bare Fiber QC</h2><p>Enter OTDR measurements here</p></div>
}

function CableCreation() {
  return <div className="component"><h2>Buffering Station</h2><p>Create cables and bundle fibers</p></div>
}

function QCcheck() {
  return <div className="component"><h2>Final QC Check</h2><p>Perform quality control checks</p></div>
}

function CableSearch() {
  return <div className="component"><h2>Cable Search</h2><p>Search and view cable details</p></div>
}

function ReportGenerator() {
  return <div className="component"><h2>Report Generator</h2><p>Generate quality reports</p></div>
}

export default App
