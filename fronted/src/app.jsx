import React, { useState, useEffect } from 'react'
import BareFiberInput from './components/BareFiberInput'
import CableCreation from './components/CableCreation'
import CableSearch from './components/CableSearch'
import QCcheck from './components/QCcheck'
import ReportGenerator from './components/ReportGenerator'
import { healthCheck } from './services/api'

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
    { id: 'cable-creation', label: 'Buffering Station' },
    { id: 'qc-check', label: 'Final QC' },
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

  const getStatusText = () => {
    switch (apiStatus) {
      case 'connected': return 'API Connected'
      case 'disconnected': return 'API Disconnected'
      default: return 'Checking API...'
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-main">
            <h1>NIA FIBER QC TRACK</h1>
            <div className="status-indicator" style={{ backgroundColor: getStatusColor() }}>
              {getStatusText()}
            </div>
          </div>
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
  const [stats, setStats] = useState({
    fibersTested: 0,
    cablesInProgress: 0,
    qcPassed: 0,
    totalProduction: 0
  })

  useEffect(() => {
    // Simulate data fetching
    setStats({
      fibersTested: 24,
      cablesInProgress: 8,
      qcPassed: 12,
      totalProduction: 156
    })
  }, [])

  return (
    <div className="dashboard">
      <h2>Production Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔬</div>
          <h3>Fibers Tested Today</h3>
          <p className="stat-number">{stats.fibersTested}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <h3>Cables in Progress</h3>
          <p className="stat-number">{stats.cablesInProgress}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <h3>QC Passed Today</h3>
          <p className="stat-number">{stats.qcPassed}</p>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <h3>Total Production (km)</h3>
          <p className="stat-number">{stats.totalProduction}</p>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item success">
            <span className="activity-time">10:30 AM</span>
            <span className="activity-text">Cable TUBE-2024-015 passed final QC</span>
          </div>
          <div className="activity-item info">
            <span className="activity-time">09:45 AM</span>
            <span className="activity-text">12 fibers added to buffering station</span>
          </div>
          <div className="activity-item warning">
            <span className="activity-time">08:15 AM</span>
            <span className="activity-text">Batch BF-2024-008 completed bare fiber testing</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App