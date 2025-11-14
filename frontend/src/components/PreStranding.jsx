import React, { useState } from 'react'

const PreStranding = () => {
  const [selectedTubes, setSelectedTubes] = useState([])
  const [cableData, setCableData] = useState({
    cable_id: '',
    customer: '',
    cable_type: '',
    standard_length: '',
    tube_count: ''
  })

  // Sample tubes from buffering stage
  const availableTubes = [
    { id: 'TUBE-001', color: 'Blue', fiber_count: 12, length_1550: '25.00', status: 'Available', short_fibers: 0 },
    { id: 'TUBE-002', color: 'Orange', fiber_count: 12, length_1550: '24.80', status: 'Available', short_fibers: 1 },
    { id: 'TUBE-003', color: 'Green', fiber_count: 12, length_1550: '25.10', status: 'Available', short_fibers: 0 },
    { id: 'TUBE-004', color: 'Brown', fiber_count: 12, length_1550: '25.00', status: 'Available', short_fibers: 0 },
    { id: 'TUBE-005', color: 'Slate', fiber_count: 12, length_1550: '24.60', status: 'Available', short_fibers: 2 },
    { id: 'TUBE-006', color: 'White', fiber_count: 12, length_1550: '25.20', status: 'Available', short_fibers: 0 },
    { id: 'TUBE-007', color: 'Red', fiber_count: 12, length_1550: '25.00', status: 'Available', short_fibers: 0 },
    { id: 'TUBE-008', color: 'Black', fiber_count: 12, length_1550: '24.90', status: 'Available', short_fibers: 1 },
    { id: 'TUBE-009', color: 'Yellow', fiber_count: 12, length_1550: '25.00', status: 'Available', short_fibers: 0 },
    { id: 'TUBE-010', color: 'Violet', fiber_count: 12, length_1550: '25.10', status: 'Available', short_fibers: 0 },
    { id: 'TUBE-011', color: 'Rose', fiber_count: 12, length_1550: '24.70', status: 'Available', short_fibers: 3 },
    { id: 'TUBE-012', color: 'Aqua', fiber_count: 12, length_1550: '25.00', status: 'Available', short_fibers: 0 }
  ]

  const toggleTubeSelection = (tubeId) => {
    if (selectedTubes.includes(tubeId)) {
      setSelectedTubes(selectedTubes.filter(id => id !== tubeId))
    } else if (selectedTubes.length < 12) {
      setSelectedTubes([...selectedTubes, tubeId])
    }
  }

  const handleCableDataChange = (field, value) => {
    setCableData(prev => ({ ...prev, [field]: value }))
  }

  const totalShortFibers = selectedTubes.reduce((total, tubeId) => {
    const tube = availableTubes.find(t => t.id === tubeId)
    return total + (tube?.short_fibers || 0)
  }, 0)

  return (
    <div className="component">
      <h2>Pre-Stranding - Tube Selection</h2>
      <p className="section-description">
        Select up to 12 loose tubes from buffering stage to prepare for stranding process.
        Maximum 12 tubes can be selected for stranding.
      </p>

      <div className="form-section">
        <h3>Cable Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Cable ID:</label>
            <input 
              type="text" 
              value={cableData.cable_id}
              onChange={(e) => handleCableDataChange('cable_id', e.target.value)}
              placeholder="CABLE-2024-001"
            />
          </div>
          <div className="form-group">
            <label>Customer:</label>
            <input 
              type="text" 
              value={cableData.customer}
              onChange={(e) => handleCableDataChange('customer', e.target.value)}
              placeholder="Customer Name"
            />
          </div>
          <div className="form-group">
            <label>Cable Type:</label>
            <select 
              value={cableData.cable_type}
              onChange={(e) => handleCableDataChange('cable_type', e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Single Tube">Single Tube</option>
              <option value="Multi Tube">Multi Tube</option>
              <option value="Ribbon">Ribbon</option>
              <option value="Armored">Armored</option>
            </select>
          </div>
          <div className="form-group">
            <label>Standard Length (km):</label>
            <input 
              type="number" 
              step="0.01"
              value={cableData.standard_length}
              onChange={(e) => handleCableDataChange('standard_length', e.target.value)}
              placeholder="25.00"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Available Tubes from Buffering ({availableTubes.length} available)</h3>
        <div className="selection-info">
          <span>Selected: {selectedTubes.length}/12 tubes</span>
          {totalShortFibers > 0 && (
            <span className="warning-text">⚠️ {totalShortFibers} short fibers in selection</span>
          )}
        </div>
        <div className="tubes-grid">
          {availableTubes.map(tube => (
            <div 
              key={tube.id}
              className={`tube-card ${selectedTubes.includes(tube.id) ? 'selected' : ''} ${
                tube.short_fibers > 0 ? 'has-short-fibers' : ''
              }`}
              onClick={() => toggleTubeSelection(tube.id)}
            >
              <div className="tube-color" style={{ 
                backgroundColor: tube.color.toLowerCase(),
                border: tube.short_fibers > 0 ? '2px solid #ef4444' : '2px solid #374151'
              }}></div>
              <div className="tube-info">
                <div className="tube-id">{tube.id}</div>
                <div className="tube-details">
                  <span>Color: {tube.color}</span>
                  <span>Fibers: {tube.fiber_count}</span>
                  <span>Length: {tube.length_1550}km</span>
                  {tube.short_fibers > 0 && (
                    <span className="short-count">Short: {tube.short_fibers}</span>
                  )}
                </div>
              </div>
              <div className="selection-indicator">
                {selectedTubes.includes(tube.id) ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTubes.length > 0 && (
        <div className="form-section">
          <h3>Selected Tubes for Stranding</h3>
          <div className="selected-tubes-list">
            {selectedTubes.map(tubeId => {
              const tube = availableTubes.find(t => t.id === tubeId)
              return (
                <div key={tubeId} className="selected-tube-item">
                  <div className="tube-main-info">
                    <strong>{tubeId}</strong>
                    <span>{tube.color} • {tube.fiber_count} fibers • {tube.length_1550}km</span>
                    {tube.short_fibers > 0 && (
                      <span className="short-warning">({tube.short_fibers} short)</span>
                    )}
                  </div>
                  <button 
                    onClick={() => toggleTubeSelection(tubeId)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
          
          <div className="selection-summary">
            <div className="summary-item">
              <span>Total Tubes:</span>
              <strong>{selectedTubes.length}</strong>
            </div>
            <div className="summary-item">
              <span>Total Fibers:</span>
              <strong>{selectedTubes.length * 12}</strong>
            </div>
            <div className="summary-item">
              <span>Short Fibers:</span>
              <strong className={totalShortFibers > 0 ? 'warning' : ''}>{totalShortFibers}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button 
          type="button" 
          className="btn-primary"
          disabled={selectedTubes.length === 0 || !cableData.cable_id}
        >
          Move to Stranding QC ({selectedTubes.length} tubes)
        </button>
        <button 
          type="button" 
          className="btn-secondary"
          onClick={() => {
            setSelectedTubes([])
            setCableData({
              cable_id: '',
              customer: '',
              cable_type: '',
              standard_length: '',
              tube_count: ''
            })
          }}
        >
          Clear Selection
        </button>
      </div>
    </div>
  )
}

export default PreStranding
