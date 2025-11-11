import React, { useState } from 'react'
import { bareFiberAPI } from '../services/api'

const BareFiberInput = () => {
  const [formData, setFormData] = useState({
    fiber_id: '',
    fiber_type: 'SMF-28e',
    batch_id: '',
    distance_1310: '',
    attenuation_1310: '',
    distance_1550: '',
    attenuation_1550: '',
    operator: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await bareFiberAPI.create(formData)
      setMessage('✅ Bare fiber data saved successfully!')
      
      // Reset form
      setFormData({
        fiber_id: '',
        fiber_type: 'SMF-28e',
        batch_id: '',
        distance_1310: '',
        attenuation_1310: '',
        distance_1550: '',
        attenuation_1550: '',
        operator: ''
      })
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="component">
      <h2>Bare Fiber QC Data Input</h2>
      
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Fiber ID:</label>
          <input
            type="text"
            name="fiber_id"
            value={formData.fiber_id}
            onChange={handleChange}
            required
            placeholder="e.g., BF-2024-001"
          />
        </div>

        <div className="form-group">
          <label>Batch ID:</label>
          <input
            type="text"
            name="batch_id"
            value={formData.batch_id}
            onChange={handleChange}
            required
            placeholder="e.g., BATCH-2024-01"
          />
        </div>

        <h3>OTDR Measurements</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Distance @1310nm (km):</label>
            <input
              type="number"
              step="0.01"
              name="distance_1310"
              value={formData.distance_1310}
              onChange={handleChange}
              required
              placeholder="25.00"
            />
          </div>
          
          <div className="form-group">
            <label>Attenuation @1310nm (dB/km):</label>
            <input
              type="number"
              step="0.001"
              name="attenuation_1310"
              value={formData.attenuation_1310}
              onChange={handleChange}
              required
              placeholder="0.21"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Distance @1550nm (km):</label>
            <input
              type="number"
              step="0.01"
              name="distance_1550"
              value={formData.distance_1550}
              onChange={handleChange}
              required
              placeholder="25.00"
            />
          </div>
          
          <div className="form-group">
            <label>Attenuation @1550nm (dB/km):</label>
            <input
              type="number"
              step="0.001"
              name="attenuation_1550"
              value={formData.attenuation_1550}
              onChange={handleChange}
              required
              placeholder="0.18"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Operator Name:</label>
          <input
            type="text"
            name="operator"
            value={formData.operator}
            onChange={handleChange}
            required
            placeholder="Enter operator name"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Fiber Data'}
        </button>
      </form>
    </div>
  )
}

export default BareFiberInput