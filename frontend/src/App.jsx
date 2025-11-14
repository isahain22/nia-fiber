import React, { useState, useEffect } from 'react'
import BareFiberQC from './components/BareFiberQC'
import BufferingStation from './components/BufferingStation'
import PreStranding from './components/PreStranding'
import StrandingQC from './components/StrandingQC'
import SheathingQC from './components/SheathingQC'
import CableSearch from './components/CableSearch'
import ReportGenerator from './components/ReportGenerator'
import { healthCheck } from './services/api'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    checkAPIHealth()
  }, [])

  const checkAPIHealth = async () => {
    try {
      await healthCheck()
      setApiStatus('connected')
    } catch (error) {
      setApiStatus('disconnected')
    }
  }

  const navigation = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'bare-fiber', label: 'Bare Fiber QC' },
    { id: 'buffering', label: 'Buffering Station' },
    { id: 'pre-stranding', label: 'Pre-Stranding' },
    { id: 'stranding-qc', label: 'Stranding QC' },
    { id: 'sheathing-qc', label: 'Sheathing QC' },
    { id: 'search', label: 'Search Cables' },
    { id: 'reports', label: 'Reports' }
  ]

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'connected': return '#10b981'
      case 'disconnected': return '#ef4444'
      default: return '#f59e0b'
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-main">
            <h1>NIA FIBER QC TRACK</h1>
            <div className="status-indicator" style={{ backgroundColor: getStatusColor() }}>
              {apiStatus === 'connected' ? 'API Connected' : apiStatus === 'disconnected' ? 'API Disconnected' : 'Checking API...'}
            </div>
          </div>
          <p>Fiber Optic Production Quality Control Management System</p>
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
        {currentView === 'bare-fiber' && <BareFiberQC />}
        {currentView === 'buffering' && <BufferingStation />}
        {currentView === 'pre-stranding' && <PreStranding />}
        {currentView === 'stranding-qc' && <StrandingQC />}
        {currentView === 'sheathing-qc' && <SheathingQC />}
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
      <div className="production-flow">
        <div className="flow-step">
          <div className="step-number">1</div>
          <h3>Bare Fiber QC</h3>
          <p>Measure individual fibers</p>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">
          <div className="step-number">2</div>
          <h3>Buffering</h3>
          <p>Bundle 12 fibers into tubes</p>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">
          <div className="step-number">3</div>
          <h3>Pre-Stranding</h3>
          <p>Select tubes for stranding</p>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">
          <div className="step-number">4</div>
          <h3>Stranding QC</h3>
          <p>Measure up to 12 tubes</p>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">
          <div className="step-number">5</div>
          <h3>Sheathing QC</h3>
          <p>Final cable measurements</p>
        </div>
      </div>
    </div>
  )
}

export default App
