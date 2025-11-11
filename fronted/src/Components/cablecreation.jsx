import React, { useState, useEffect } from 'react'
import { cableAPI, bareFiberAPI } from '../services/api'
import { TUBE_COLORS, STANDARD_COLORS } from '../utils/constants'

const CableCreation = () => {
  const [step, setStep] = useState(1)
  const [availableFibers, setAvailableFibers] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Cable basic info
  const [cableData, setCableData] = useState({
    cable_id: '',
    tube_color: 'Natural',
    inside_diameter: '',
    outside_diameter: '',
    fiber_count: 12,
    customer_name: '',
    operator_name: '',
    bobbin_number: '',
    standard_length_km: '',
    net_length_km: '',
    relo_number: '',
    remarks: ''
  })

  // Fiber bundling
  const [fiberBundles, setFiberBundles] = useState(
    STANDARD_COLORS.map((color, index) => ({
      position: index + 1,
      standard_color: color,
      fiber_id: '',
      fiber_data: null
    }))
  )

  useEffect(() => {
    loadAvailableFibers()
  }, [])

  const loadAvailableFibers = async () => {
    try {
      const response = await bareFiberAPI.getAvailable()
      setAvailableFibers(response.data.data || [])
    } catch (error) {
      console.error('Error loading available fibers:', error)
    }
  }

  const handleCableDataChange = (e) => {
    setCableData({
      ...cableData,
      [e.target.name]: e.target.value
    })
  }

  const handleFiberSelection = (position, fiberId) => {
    const updatedBundles = fiberBundles.map(bundle => {
      if (bundle.position === position) {
        const fiberData = availableFibers.find(f => f.fiber_id === fiberId)
        return {
          ...bundle,
          fiber_id: fiberId,
          fiber_data: fiberData || null
        }
      }
      return bundle
    })
    setFiberBundles(updatedBundles)
  }

  const createCable = async () => {
    setLoading(true)
    setMessage('')

    try {
      // Step 1: Create cable
      await cableAPI.create(cableData)
      
      // Step 2: Add fibers to cable
      const fibersToAdd = fiberBundles
        .filter(bundle => bundle.fiber_id)
        .map(bundle => ({
          fiber_id: bundle.fiber_id,
          standard_color: bundle.standard_color,
          position: bundle.position
        }))

      if (fibersToAdd.length > 0) {
        await cableAPI.addFibers(cableData.cable_id, fibersToAdd)
      }

      setMessage(`✅ Cable ${cableData.cable_id} created successfully with ${fibersToAdd.length} fibers!`)
      setStep(1)
      
      // Reset form
      setCableData({
        cable_id: '',
        tube_color: 'Natural',
        inside_diameter: '',
        outside_diameter: '',
        fiber_count: 12,
        customer_name: '',
        operator_name: '',
        bobbin_number: '',
        standard_length_km: '',
        net_length_km: '',
        relo_number: '',
        remarks: ''
      })
      setFiberBundles(
        STANDARD_COLORS.map((color, index) => ({
          position: index + 1,
          standard_color: color,
          fiber_id: '',
          fiber_data: null
        }))
      )
      
      // Reload available fibers
      loadAvailableFibers()
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filledFiberCount = fiberBundles.filter(bundle => bundle.fiber_id).length

  return (
    <div className="component">
      <h2>Buffering Station - Cable Creation</h2>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="creation-steps">
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-label">Cable Information</div>
          <div className="step-connector"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="step-label">Fiber Bundling</div>
        </div>

        {step === 1 && (
          <div className="step-content">
            <h3>Cable Basic Information</h3>
            <form className="form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cable_id">Cable ID *</label>
                  <input
                    type="text"
                    id="cable_id"
                    name="cable_id"
                    value={cableData.cable_id}
                    onChange={handleCableDataChange}
                    required
                    placeholder="e.g., TUBE-2024-001"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="tube_color">Tube Color *</label>
                  <select
                    id="tube_color"
                    name="tube_color"
                    value={cableData.tube_color}
                    onChange={handleCableDataChange}
                    required
                  >
                    {TUBE_COLORS.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="inside_diameter">Inside Diameter (mm) *</label>
                  <input
                    type="number"
                    step="0.01"
                    id="inside_diameter"
                    name="inside_diameter"
                    value={cableData.inside_diameter}
                    onChange={handleCableDataChange}
                    required
                    placeholder="e.g., 2.50"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="outside_diameter">Outside Diameter (mm) *</label>
                  <input
                    type="number"
                    step="0.01"
                    id="outside_diameter"
                    name="outside_diameter"
                    value={cableData.outside_diameter}
                    onChange={handleCableDataChange}
                    required
                    placeholder="e.g., 3.20"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customer_name">Customer Name *</label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={cableData.customer_name}
                    onChange={handleCableDataChange}
                    required
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="operator_name">Operator Name *</label>
                  <input
                    type="text"
                    id="operator_name"
                    name="operator_name"
                    value={cableData.operator_name}
                    onChange={handleCableDataChange}
                    required
                    placeholder="Enter operator name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bobbin_number">Bobbin Number *</label>
                  <input
                    type="text"
                    id="bobbin_number"
                    name="bobbin_number"
                    value={cableData.bobbin_number}
                    onChange={handleCableDataChange}
                    required
                    placeholder="e.g., BOB-001"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="fiber_count">Fiber Count *</label>
                  <select
                    id="fiber_count"
                    name="fiber_count"
                    value={cableData.fiber_count}
                    onChange={handleCableDataChange}
                    required
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(count => (
                      <option key={count} value={count}>{count} fibers</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="standard_length_km">Standard Length (km) *</label>
                  <input
                    type="number"
                    step="0.01"
                    id="standard_length_km"
                    name="standard_length_km"
                    value={cableData.standard_length_km}
                    onChange={handleCableDataChange}
                    required
                    placeholder="e.g., 25.00"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="net_length_km">Net Length (km) *</label>
                  <input
                    type="number"
                    step="0.01"
                    id="net_length_km"
                    name="net_length_km"
                    value={cableData.net_length_km}
                    onChange={handleCableDataChange}
                    required
                    placeholder="e.g., 24.80"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="relo_number">Relo Number</label>
                  <input
                    type="text"
                    id="relo_number"
                    name="relo_number"
                    value={cableData.relo_number}
                    onChange={handleCableDataChange}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="remarks">Remarks</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={cableData.remarks}
                  onChange={handleCableDataChange}
                  rows="3"
                  placeholder="Any additional remarks..."
                />
              </div>

              <button 
                type="button" 
                className="btn-primary"
                onClick={() => setStep(2)}
                disabled={!cableData.cable_id || !cableData.customer_name}
              >
                Next: Fiber Bundling
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h3>Fiber Bundling</h3>
            <p className="mb-2">
              Available Fibers: {availableFibers.length} | 
              Selected: {filledFiberCount} / {cableData.fiber_count}
            </p>

            <div className="fiber-bundle">
              {fiberBundles.slice(0, cableData.fiber_count).map((bundle) => (
                <div 
                  key={bundle.position} 
                  className={`fiber-slot ${bundle.fiber_id ? 'filled' : ''}`}
                >
                  <div 
                    className="color-indicator"
                    style={{ 
                      backgroundColor: bundle.standard_color.toLowerCase(),
                      borderColor: bundle.fiber_id ? '#10b981' : '#374151'
                    }}
                  ></div>
                  <div className="fiber-color">{bundle.standard_color}</div>
                  <select
                    value={bundle.fiber_id}
                    onChange={(e) => handleFiberSelection(bundle.position, e.target.value)}
                    className="mt-1"
                  >
                    <option value="">Select Fiber</option>
                    {availableFibers.map(fiber => (
                      <option 
                        key={fiber.fiber_id} 
                        value={fiber.fiber_id}
                        disabled={fiberBundles.some(b => b.fiber_id === fiber.fiber_id && b.position !== bundle.position)}
                      >
                        {fiber.fiber_id} ({fiber.fiber_type})
                      </option>
                    ))}
                  </select>
                  
                  {bundle.fiber_data && (
                    <div className="fiber-details mt-1">
                      <small>
                        1310: {bundle.fiber_data.distance_1310}km, {bundle.fiber_data.attenuation_1310}dB/km<br/>
                        1550: {bundle.fiber_data.distance_1550}km, {bundle.fiber_data.attenuation_1550}dB/km
                      </small>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="step-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              
              <button 
                type="button" 
                className="btn-primary"
                onClick={createCable}
                disabled={loading || filledFiberCount === 0}
              >
                {loading ? 'Creating Cable...' : `Create Cable (${filledFiberCount} fibers)`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CableCreation