import React, { useState, useEffect } from 'react'
import { qcCheckAPI, cableAPI } from '../services/api'
import { QC_STATUS } from '../utils/constants'

const QCcheck = () => {
  const [cables, setCables] = useState([])
  const [selectedCable, setSelectedCable] = useState(null)
  const [qcData, setQcData] = useState({
    cable_id: '',
    qc_operator: '',
    measured_id_diameter: '',
    measured_od_diameter: '',
    optical_length: '',
    status: 'pass',
    remarks: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadCablesForQC()
  }, [])

  const loadCablesForQC = async () => {
    try {
      const response = await cableAPI.getAll()
      // Filter cables that are in progress (ready for QC)
      const cablesForQC = (response.data.data || []).filter(
        cable => cable.status === 'in_progress' || !cable.qc_status
      )
      setCables(cablesForQC)
    } catch (error) {
      console.error('Error loading cables:', error)
    }
  }

  const handleCableSelect = async (cableId) => {
    setLoading(true)
    try {
      const response = await cableAPI.getById(cableId)
      const cable = response.data
      setSelectedCable(cable)
      
      // Pre-fill form with cable data
      setQcData({
        cable_id: cable.cable.cable_id,
        qc_operator: '',
        measured_id_diameter: cable.cable.inside_diameter,
        measured_od_diameter: cable.cable.outside_diameter,
        optical_length: cable.cable.net_length_km,
        status: 'pass',
        remarks: ''
      })
    } catch (error) {
      console.error('Error loading cable details:', error)
      setMessage('❌ Error loading cable details')
    } finally {
      setLoading(false)
    }
  }

  const handleQcDataChange = (e) => {
    setQcData({
      ...qcData,
      [e.target.name]: e.target.value
    })
  }

  const calculateOpticalLength = () => {
    if (!selectedCable) return 0
    
    const fibers = selectedCable.fibers
    if (fibers.length === 0) return 0
    
    // Find the minimum length among all fibers (optical length is the shortest fiber)
    const minLength = Math.min(...fibers.map(fiber => 
      Math.min(fiber.distance_1310, fiber.distance_1550)
    ))
    return minLength.toFixed(2)
  }

  const handleAutoFill = () => {
    const opticalLength = calculateOpticalLength()
    setQcData(prev => ({
      ...prev,
      optical_length: opticalLength
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await qcCheckAPI.create(qcData)
      setMessage(`✅ QC check saved successfully for ${qcData.cable_id}`)
      
      // Reset form
      setQcData({
        cable_id: '',
        qc_operator: '',
        measured_id_diameter: '',
        measured_od_diameter: '',
        optical_length: '',
        status: 'pass',
        remarks: ''
      })
      setSelectedCable(null)
      
      // Reload cables list
      loadCablesForQC()
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="component">
      <h2>Final Quality Control Check</h2>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="qc-layout">
        <div className="qc-sidebar">
          <h3>Cables Ready for QC</h3>
          <div className="cable-list">
            {cables.length === 0 ? (
              <div className="no-data">No cables ready for QC check</div>
            ) : (
              cables.map(cable => (
                <div 
                  key={cable.cable_id}
                  className={`list-item ${selectedCable?.cable?.cable_id === cable.cable_id ? 'active' : ''}`}
                  onClick={() => handleCableSelect(cable.cable_id)}
                >
                  <div className="item-main">
                    <strong>{cable.cable_id}</strong>
                    <span>{cable.customer_name}</span>
                  </div>
                  <div className="item-details">
                    <span>{cable.tube_color} • {cable.actual_fiber_count || 0}/{cable.fiber_count} fibers</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="qc-main">
          {selectedCable ? (
            <div className="qc-form-container">
              <h3>QC Check for: {selectedCable.cable.cable_id}</h3>
              
              <div className="cable-summary">
                <h4>Cable Specifications</h4>
                <div className="spec-grid">
                  <div className="spec-item">
                    <label>Customer:</label>
                    <span>{selectedCable.cable.customer_name}</span>
                  </div>
                  <div className="spec-item">
                    <label>Tube Color:</label>
                    <span>{selectedCable.cable.tube_color}</span>
                  </div>
                  <div className="spec-item">
                    <label>Spec Dimensions:</label>
                    <span>ID: {selectedCable.cable.inside_diameter}mm / OD: {selectedCable.cable.outside_diameter}mm</span>
                  </div>
                  <div className="spec-item">
                    <label>Fiber Count:</label>
                    <span>{selectedCable.fibers.length} fibers</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="form">
                <h4>QC Measurements</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="qc_operator">QC Operator *</label>
                    <input
                      type="text"
                      id="qc_operator"
                      name="qc_operator"
                      value={qcData.qc_operator}
                      onChange={handleQcDataChange}
                      required
                      placeholder="Enter QC operator name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="status">QC Status *</label>
                    <select
                      id="status"
                      name="status"
                      value={qcData.status}
                      onChange={handleQcDataChange}
                      required
                    >
                      <option value="pass">Pass</option>
                      <option value="fail">Fail</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="measured_id_diameter">Measured Inside Diameter (mm) *</label>
                    <input
                      type="number"
                      step="0.01"
                      id="measured_id_diameter"
                      name="measured_id_diameter"
                      value={qcData.measured_id_diameter}
                      onChange={handleQcDataChange}
                      required
                      placeholder="Measured ID"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="measured_od_diameter">Measured Outside Diameter (mm) *</label>
                    <input
                      type="number"
                      step="0.01"
                      id="measured_od_diameter"
                      name="measured_od_diameter"
                      value={qcData.measured_od_diameter}
                      onChange={handleQcDataChange}
                      required
                      placeholder="Measured OD"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="optical_length">Optical Length (km) *</label>
                    <div className="input-with-action">
                      <input
                        type="number"
                        step="0.01"
                        id="optical_length"
                        name="optical_length"
                        value={qcData.optical_length}
                        onChange={handleQcDataChange}
                        required
                        placeholder="Optical length"
                      />
                      <button 
                        type="button"
                        className="btn-secondary btn-small"
                        onClick={handleAutoFill}
                        title="Calculate from fiber measurements"
                      >
                        Auto
                      </button>
                    </div>
                    <small className="helper-text">
                      Shortest length among all fibers: {calculateOpticalLength()} km
                    </small>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="remarks">Remarks</label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    value={qcData.remarks}
                    onChange={handleQcDataChange}
                    rows="3"
                    placeholder="Any QC remarks or observations..."
                  />
                </div>

                {qcData.status === 'fail' && (
                  <div className="warning-message">
                    ⚠️ This cable will be marked as failed. Please provide detailed remarks.
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving QC Check...' : 'Save QC Check'}
                </button>
              </form>
            </div>
          ) : (
            <div className="no-selection">
              <div className="placeholder">
                <h3>Select a Cable for QC Check</h3>
                <p>Choose a cable from the list to perform quality control checks</p>
                <ul>
                  <li>Verify dimensional measurements</li>
                  <li>Check optical length consistency</li>
                  <li>Record any observations</li>
                  <li>Set pass/fail status</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QCcheck