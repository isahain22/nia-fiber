import React, { useState } from 'react'

const BareFiberQC = () => {
  const [fibers, setFibers] = useState(Array(30).fill().map((_, index) => ({
    seq_no: index + 1,
    spool_id: '',
    model_spool_no: '',
    fiber_color: '',
    attenuation_1310: '',
    attenuation_1550: '',
    length_1550: '',
    tube_assignment: '',
    remarks: '',
    is_short: false
  })))

  const handleFiberChange = (index, field, value) => {
    const updatedFibers = [...fibers]
    updatedFibers[index] = { ...updatedFibers[index], [field]: value }
    
    // Auto-detect short length
    if (field === 'length_1550' && value) {
      const length = parseFloat(value)
      updatedFibers[index].is_short = length < 24.5 // Mark as short if less than 24.5km
    }
    
    setFibers(updatedFibers)
  }

  const fiberColors = [
    'Blue', 'Orange', 'Green', 'Brown', 'Slate', 'White',
    'Red', 'Black', 'Yellow', 'Violet', 'Rose', 'Aqua'
  ]

  const tubeOptions = [
    'Tube-01', 'Tube-02', 'Tube-03', 'Tube-04', 'Tube-05', 'Tube-06',
    'Tube-07', 'Tube-08', 'Tube-09', 'Tube-10', 'Tube-11', 'Tube-12'
  ]

  return (
    <div className="component">
      <h2>BARE FIBER TESTING REPORT (Pre-Buffering)</h2>
      <p className="report-description">
        Purpose: To record the core identity and initial measurements of bare fibers prior to buffering.
        <br /><strong>Note:</strong> Short length is automatically detected when length @1550nm is less than 24.5km
      </p>

      <div className="table-container">
        <table className="fiber-table">
          <thead>
            <tr>
              <th>Seq. No.</th>
              <th>Spool ID</th>
              <th>Model Spool No.</th>
              <th>Fiber Color</th>
              <th>Attenuation @1310nm</th>
              <th>Attenuation @1550nm</th>
              <th>Length @1550nm (km)</th>
              <th>Tube Assignment</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {fibers.map((fiber, index) => (
              <tr key={index} className={fiber.is_short ? 'short-fiber' : ''}>
                <td className="seq-number">{fiber.seq_no}</td>
                <td>
                  <input
                    type="text"
                    value={fiber.spool_id}
                    onChange={(e) => handleFiberChange(index, 'spool_id', e.target.value)}
                    placeholder="SPOOL-001"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={fiber.model_spool_no}
                    onChange={(e) => handleFiberChange(index, 'model_spool_no', e.target.value)}
                    placeholder="MODEL-001"
                  />
                </td>
                <td>
                  <select
                    value={fiber.fiber_color}
                    onChange={(e) => handleFiberChange(index, 'fiber_color', e.target.value)}
                  >
                    <option value="">Select Color</option>
                    {fiberColors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    step="0.001"
                    value={fiber.attenuation_1310}
                    onChange={(e) => handleFiberChange(index, 'attenuation_1310', e.target.value)}
                    placeholder="0.21"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.001"
                    value={fiber.attenuation_1550}
                    onChange={(e) => handleFiberChange(index, 'attenuation_1550', e.target.value)}
                    placeholder="0.18"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={fiber.length_1550}
                    onChange={(e) => handleFiberChange(index, 'length_1550', e.target.value)}
                    placeholder="25.00"
                  />
                </td>
                <td>
                  <select
                    value={fiber.tube_assignment}
                    onChange={(e) => handleFiberChange(index, 'tube_assignment', e.target.value)}
                  >
                    <option value="">Assign Tube</option>
                    {tubeOptions.map(tube => (
                      <option key={tube} value={tube}>{tube}</option>
                    ))}
                  </select>
                </td>
                <td className="status-cell">
                  {fiber.is_short ? (
                    <span className="status-badge short">SHORT LENGTH</span>
                  ) : fiber.length_1550 ? (
                    <span className="status-badge good">OK</span>
                  ) : (
                    <span className="status-badge pending">PENDING</span>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={fiber.remarks}
                    onChange={(e) => handleFiberChange(index, 'remarks', e.target.value)}
                    placeholder="Notes..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-section">
        <h3>Fiber Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total Fibers:</span>
            <span className="summary-value">30</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Short Length Fibers:</span>
            <span className="summary-value warning">{fibers.filter(f => f.is_short).length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Assigned to Tubes:</span>
            <span className="summary-value">{fibers.filter(f => f.tube_assignment).length}</span>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-primary">
          Save All Fiber Data
        </button>
        <button 
          type="button" 
          className="btn-secondary"
          onClick={() => setFibers(Array(30).fill().map((_, index) => ({
            seq_no: index + 1,
            spool_id: '',
            model_spool_no: '',
            fiber_color: '',
            attenuation_1310: '',
            attenuation_1550: '',
            length_1550: '',
            tube_assignment: '',
            remarks: '',
            is_short: false
          })))}
        >
          Clear All
        </button>
      </div>
    </div>
  )
}

export default BareFiberQC
