import React, { useState } from 'react'

const BufferingStation = () => {
  const [formData, setFormData] = useState({
    customer: '',
    shift: '',
    equipment_id: '',
    tube_number: '',
    tube_color: '',
    tube_length: '',
    number_of_fibers: '12',
    rec_date: '',
    test_date: '',
    test_time: '',
    relo: '',
    otdr_no: ''
  })

  const [fibers, setFibers] = useState(Array(12).fill().map((_, index) => ({
    s_no: index + 1,
    color: ['Blue', 'Orange', 'Green', 'Brown', 'Slate', 'White', 'Red', 'Black', 'Yellow', 'Violet', 'Rose', 'Aqua'][index],
    fiber_id: '',
    otdr_1310: '',
    otdr_1550: '',
    length_1550: '',
    is_short: false,
    remarks: ''
  })))

  const [observations, setObservations] = useState(Array(10).fill().map((_, index) => ({
    sample_no: index + 1,
    id_mm: '',
    od_mm: '',
    thickness: ''
  })))

  const [qualityChecks, setQualityChecks] = useState({
    jelly_presence: '',
    tube_circularity: '',
    tube_physical: '',
    tube_color_condition: ''
  })

  const [signatures, setSignatures] = useState({
    tested_by: '',
    checked_by: '',
    verified_by: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFiberChange = (index, field, value) => {
    const updated = [...fibers]
    updated[index] = { ...updated[index], [field]: value }
    
    // Auto-detect short length
    if (field === 'length_1550' && value) {
      const length = parseFloat(value)
      updated[index].is_short = length < 24.5
    }
    
    setFibers(updated)
  }

  const handleObservationChange = (index, field, value) => {
    const updated = [...observations]
    updated[index] = { ...updated[index], [field]: value }
    setObservations(updated)
  }

  const handleQualityChange = (field, value) => {
    setQualityChecks(prev => ({ ...prev, [field]: value }))
  }

  const handleSignatureChange = (field, value) => {
    setSignatures(prev => ({ ...prev, [field]: value }))
  }

  const shortFiberCount = fibers.filter(f => f.is_short).length

  return (
    <div className="component">
      <div className="document-header">
        <div className="company-logo">NIA FIBER COMPANY</div>
        <div className="document-title">PRODUCTION TEST DATA SHEET - SECONDARY TUBING</div>
        <div className="document-info">
          <div>Department: Quality Control</div>
          <div>Reference No: <input type="text" placeholder="REF-001" /></div>
          <div>Issue Date: <input type="date" /></div>
          <div>Page: 1 of 1</div>
        </div>
      </div>

      <div className="form-section">
        <h3>Production Test Data</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Customer:</label>
            <input type="text" value={formData.customer} onChange={(e) => handleInputChange('customer', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Shift:</label>
            <div className="checkbox-group">
              <label><input type="checkbox" name="shift" value="A" /> A</label>
              <label><input type="checkbox" name="shift" value="B" /> B</label>
              <label><input type="checkbox" name="shift" value="C" /> C</label>
            </div>
          </div>
          <div className="form-group">
            <label>Equipment ID:</label>
            <input type="text" value={formData.equipment_id} onChange={(e) => handleInputChange('equipment_id', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tube Number:</label>
            <input type="text" value={formData.tube_number} onChange={(e) => handleInputChange('tube_number', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tube Color:</label>
            <input type="text" value={formData.tube_color} onChange={(e) => handleInputChange('tube_color', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tube Length (km):</label>
            <input type="number" step="0.01" value={formData.tube_length} onChange={(e) => handleInputChange('tube_length', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Number of Fibers:</label>
            <select value={formData.number_of_fibers} onChange={(e) => handleInputChange('number_of_fibers', e.target.value)}>
              <option value="12">12 fibers</option>
            </select>
          </div>
          <div className="form-group">
            <label>REC Date:</label>
            <input type="date" value={formData.rec_date} onChange={(e) => handleInputChange('rec_date', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Test Date:</label>
            <input type="date" value={formData.test_date} onChange={(e) => handleInputChange('test_date', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Test Time:</label>
            <input type="time" value={formData.test_time} onChange={(e) => handleInputChange('test_time', e.target.value)} />
          </div>
          <div className="form-group">
            <label>RELO:</label>
            <input type="text" value={formData.relo} onChange={(e) => handleInputChange('relo', e.target.value)} />
          </div>
          <div className="form-group">
            <label>OTDR No:</label>
            <input type="text" value={formData.otdr_no} onChange={(e) => handleInputChange('otdr_no', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Fiber Test Data (12 Fibers per Tube)</h3>
        {shortFiberCount > 0 && (
          <div className="warning-banner">
            ⚠️ {shortFiberCount} fiber(s) detected with short length (&lt;24.5km)
          </div>
        )}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Color</th>
                <th>Fiber ID</th>
                <th>OTDR 1310nm</th>
                <th>OTDR 1550nm</th>
                <th>Length @1550nm</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {fibers.map((fiber, index) => (
                <tr key={index} className={fiber.is_short ? 'short-fiber' : ''}>
                  <td>{fiber.s_no}</td>
                  <td>{fiber.color}</td>
                  <td>
                    <input type="text" value={fiber.fiber_id} onChange={(e) => handleFiberChange(index, 'fiber_id', e.target.value)} />
                  </td>
                  <td>
                    <input type="number" step="0.001" value={fiber.otdr_1310} onChange={(e) => handleFiberChange(index, 'otdr_1310', e.target.value)} />
                  </td>
                  <td>
                    <input type="number" step="0.001" value={fiber.otdr_1550} onChange={(e) => handleFiberChange(index, 'otdr_1550', e.target.value)} />
                  </td>
                  <td>
                    <input type="number" step="0.01" value={fiber.length_1550} onChange={(e) => handleFiberChange(index, 'length_1550', e.target.value)} />
                  </td>
                  <td className="status-cell">
                    {fiber.is_short ? (
                      <span className="status-badge short">SHORT</span>
                    ) : fiber.length_1550 ? (
                      <span className="status-badge good">OK</span>
                    ) : (
                      <span className="status-badge pending">PENDING</span>
                    )}
                  </td>
                  <td>
                    <input type="text" value={fiber.remarks} onChange={(e) => handleFiberChange(index, 'remarks', e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-section">
        <h3>Tube Observations (10 Samples)</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sample #</th>
                <th>ID (mm)</th>
                <th>OD (mm)</th>
                <th>Thickness (mm)</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((obs, index) => (
                <tr key={index}>
                  <td>#{obs.sample_no}</td>
                  <td>
                    <input type="number" step="0.01" value={obs.id_mm} onChange={(e) => handleObservationChange(index, 'id_mm', e.target.value)} />
                  </td>
                  <td>
                    <input type="number" step="0.01" value={obs.od_mm} onChange={(e) => handleObservationChange(index, 'od_mm', e.target.value)} />
                  </td>
                  <td>
                    <input type="number" step="0.01" value={obs.thickness} onChange={(e) => handleObservationChange(index, 'thickness', e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-section">
        <h3>Quality Checks</h3>
        <div className="quality-grid">
          <div className="form-group">
            <label>Jelly Presence:</label>
            <select value={qualityChecks.jelly_presence} onChange={(e) => handleQualityChange('jelly_presence', e.target.value)}>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tube Circularity:</label>
            <select value={qualityChecks.tube_circularity} onChange={(e) => handleQualityChange('tube_circularity', e.target.value)}>
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tube Physical Condition:</label>
            <select value={qualityChecks.tube_physical} onChange={(e) => handleQualityChange('tube_physical', e.target.value)}>
              <option value="">Select</option>
              <option value="rough">Rough</option>
              <option value="smooth">Smooth</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tube Color Condition:</label>
            <input type="text" value={qualityChecks.tube_color_condition} onChange={(e) => handleQualityChange('tube_color_condition', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Comments</h3>
        <textarea className="comments-box" placeholder="Process issues, observations, etc." rows="3"></textarea>
      </div>

      <div className="form-section">
        <h3>Signatures</h3>
        <div className="signature-grid">
          <div className="form-group">
            <label>Tested By:</label>
            <input type="text" value={signatures.tested_by} onChange={(e) => handleSignatureChange('tested_by', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Checked By:</label>
            <input type="text" value={signatures.checked_by} onChange={(e) => handleSignatureChange('checked_by', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Verified By:</label>
            <input type="text" value={signatures.verified_by} onChange={(e) => handleSignatureChange('verified_by', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-primary">Save Buffering Data</button>
        <button type="button" className="btn-success">Approve for Pre-Stranding</button>
        <button type="button" className="btn-secondary">Clear Form</button>
      </div>
    </div>
  )
}

export default BufferingStation
