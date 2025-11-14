import React, { useState } from 'react'

const StrandingQC = () => {
  const [measurements, setMeasurements] = useState({
    cable_id: '',
    operator: '',
    test_date: '',
    stranded_length: '',
    lay_length: '',
    tension: '',
    twist_direction: ''
  })

  const [tubeMeasurements, setTubeMeasurements] = useState(Array(12).fill().map((_, index) => ({
    position: index + 1,
    tube_id: '',
    measured_length_1550: '',
    attenuation_1310: '',
    attenuation_1550: '',
    is_short: false,
    remarks: ''
  })))

  const [qcChecks, setQcChecks] = useState({
    stranding_tightness: '',
    tube_arrangement: '',
    surface_smoothness: '',
    diameter_consistency: ''
  })

  const handleMeasurementChange = (field, value) => {
    setMeasurements(prev => ({ ...prev, [field]: value }))
  }

  const handleTubeMeasurementChange = (index, field, value) => {
    const updated = [...tubeMeasurements]
    updated[index] = { ...updated[index], [field]: value }
    
    // Auto-detect short length
    if (field === 'measured_length_1550' && value) {
      const length = parseFloat(value)
      updated[index].is_short = length < 24.5
    }
    
    setTubeMeasurements(updated)
  }

  const handleQcCheckChange = (field, value) => {
    setQcChecks(prev => ({ ...prev, [field]: value }))
  }

  const activeTubes = tubeMeasurements.filter(tube => tube.tube_id)
  const shortTubes = tubeMeasurements.filter(tube => tube.is_short)

  return (
    <div className="component">
      <h2>Stranding Quality Control</h2>
      <p className="section-description">
        Measure and verify up to 12 stranded loose tubes before moving to sheathing stage.
        <br /><strong>Note:</strong> Short length is automatically detected when length @1550nm is less than 24.5km
      </p>

      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Cable ID:</label>
            <input 
              type="text" 
              value={measurements.cable_id}
              onChange={(e) => handleMeasurementChange('cable_id', e.target.value)}
              placeholder="CABLE-2024-001"
            />
          </div>
          <div className="form-group">
            <label>Operator:</label>
            <input 
              type="text" 
              value={measurements.operator}
              onChange={(e) => handleMeasurementChange('operator', e.target.value)}
              placeholder="Operator Name"
            />
          </div>
          <div className="form-group">
            <label>Test Date:</label>
            <input 
              type="date" 
              value={measurements.test_date}
              onChange={(e) => handleMeasurementChange('test_date', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Stranded Length (m):</label>
            <input 
              type="number" 
              step="0.01"
              value={measurements.stranded_length}
              onChange={(e) => handleMeasurementChange('stranded_length', e.target.value)}
              placeholder="25000.00"
            />
          </div>
          <div className="form-group">
            <label>Lay Length (mm):</label>
            <input 
              type="number" 
              step="0.1"
              value={measurements.lay_length}
              onChange={(e) => handleMeasurementChange('lay_length', e.target.value)}
              placeholder="150.0"
            />
          </div>
          <div className="form-group">
            <label>Tension (N):</label>
            <input 
              type="number" 
              step="0.1"
              value={measurements.tension}
              onChange={(e) => handleMeasurementChange('tension', e.target.value)}
              placeholder="50.0"
            />
          </div>
          <div className="form-group">
            <label>Twist Direction:</label>
            <select 
              value={measurements.twist_direction}
              onChange={(e) => handleMeasurementChange('twist_direction', e.target.value)}
            >
              <option value="">Select</option>
              <option value="S-Z">S-Z</option>
              <option value="Z-S">Z-S</option>
              <option value="Unidirectional">Unidirectional</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Tube Measurements (Up to 12 Tubes)</h3>
        {shortTubes.length > 0 && (
          <div className="warning-banner">
            ⚠️ {shortTubes.length} tube(s) detected with short length (&lt;24.5km)
          </div>
        )}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Tube ID</th>
                <th>Length @1550nm (km)</th>
                <th>Attenuation @1310nm</th>
                <th>Attenuation @1550nm</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {tubeMeasurements.map((tube, index) => (
                <tr key={index} className={tube.is_short ? 'short-fiber' : ''}>
                  <td>{tube.position}</td>
                  <td>
                    <input 
                      type="text" 
                      value={tube.tube_id}
                      onChange={(e) => handleTubeMeasurementChange(index, 'tube_id', e.target.value)}
                      placeholder={`TUBE-00${tube.position}`}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      step="0.01"
                      value={tube.measured_length_1550}
                      onChange={(e) => handleTubeMeasurementChange(index, 'measured_length_1550', e.target.value)}
                      placeholder="25.00"
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      step="0.001"
                      value={tube.attenuation_1310}
                      onChange={(e) => handleTubeMeasurementChange(index, 'attenuation_1310', e.target.value)}
                      placeholder="0.21"
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      step="0.001"
                      value={tube.attenuation_1550}
                      onChange={(e) => handleTubeMeasurementChange(index, 'attenuation_1550', e.target.value)}
                      placeholder="0.18"
                    />
                  </td>
                  <td className="status-cell">
                    {tube.is_short ? (
                      <span className="status-badge short">SHORT</span>
                    ) : tube.measured_length_1550 ? (
                      <span className="status-badge good">OK</span>
                    ) : (
                      <span className="status-badge pending">PENDING</span>
                    )}
                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={tube.remarks}
                      onChange={(e) => handleTubeMeasurementChange(index, 'remarks', e.target.value)}
                      placeholder="Notes..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="measurement-summary">
          <div className="summary-item">
            <span>Tubes Measured:</span>
            <strong>{activeTubes.length}</strong>
          </div>
          <div className="summary-item">
            <span>Short Tubes:</span>
            <strong className={shortTubes.length > 0 ? 'warning' : ''}>{shortTubes.length}</strong>
          </div>
          <div className="summary-item">
            <span>Total Fibers:</span>
            <strong>{activeTubes.length * 12}</strong>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Quality Checks</h3>
        <div className="quality-grid">
          <div className="form-group">
            <label>Stranding Tightness:</label>
            <select 
              value={qcChecks.stranding_tightness}
              onChange={(e) => handleQcCheckChange('stranding_tightness', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Acceptable">Acceptable</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tube Arrangement:</label>
            <select 
              value={qcChecks.tube_arrangement}
              onChange={(e) => handleQcCheckChange('tube_arrangement', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Proper">Proper</option>
              <option value="Irregular">Irregular</option>
              <option value="Twisted">Twisted</option>
            </select>
          </div>
          <div className="form-group">
            <label>Surface Smoothness:</label>
            <select 
              value={qcChecks.surface_smoothness}
              onChange={(e) => handleQcCheckChange('surface_smoothness', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Smooth">Smooth</option>
              <option value="Slightly Rough">Slightly Rough</option>
              <option value="Rough">Rough</option>
            </select>
          </div>
          <div className="form-group">
            <label>Diameter Consistency:</label>
            <select 
              value={qcChecks.diameter_consistency}
              onChange={(e) => handleQcCheckChange('diameter_consistency', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Consistent">Consistent</option>
              <option value="Variable">Variable</option>
              <option value="Irregular">Irregular</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Remarks</h3>
        <textarea className="comments-box" placeholder="Additional observations..." rows="3"></textarea>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-primary">Save Stranding QC Data</button>
        <button type="button" className="btn-success">Approve for Sheathing</button>
        <button type="button" className="btn-secondary">Clear Form</button>
      </div>
    </div>
  )
}

export default StrandingQC
