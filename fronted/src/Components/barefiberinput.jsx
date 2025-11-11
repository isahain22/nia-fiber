import React, { useState } from 'react'
import { bareFiberAPI } from '../services/api'
import { FIBER_TYPES } from '../utils/constants'

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
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fiber_id">Fiber ID *</label>
            <input
              type="text"
              id="fiber_id"
              name="fiber_id"
              value={formData.fiber_id}
              onChange={handleChange}
              required
              placeholder="e.g., BF-2024-001"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fiber_type">Fiber Type *</label>
            <select
              id="fiber_type"
              name="fiber_type"
              value={formData.fiber_type}
              onChange={handleChange}
              required
            >
              {FIBER_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="batch_id">Batch ID *</label>
          <input
            type="text"
            id="batch_id"
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
            <label htmlFor="distance_1310">Distance @1310nm (km) *</label>
            <input
              type="number"
              step="0.01"
              id="distance_1310"
              name="distance_1310"
              value={formData.distance_1310}
              onChange={handleChange}
              required
              min="0"
              placeholder="25.00"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="attenuation_1310">Attenuation @1310nm (dB/km) *</label>
            <input
              type="number"
              step="0.001"
              id="attenuation_1310"
              name="attenuation_1310"
              value={formData.attenuation_1310}
              onChange={handleChange}
              required
              min="0"
              max="1"
              placeholder="0.21"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="distance_1550">Distance @1550nm (km) *</label>
            <input
              type="number"
              step="0.01"
              id="distance_1550"
              name="distance_1550"
              value={formData.distance_1550}
              onChange={handleChange}
              required
              min="0"
              placeholder="25.00"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="attenuation_1550">Attenuation @1550nm (dB/km) *</label>
            <input
              type="number"
              step="0.001"
              id="attenuation_1550"
              name="attenuation_1550"
              value={formData.attenuation_1550}
              onChange={handleChange}
              required
              min="0"
              max="1"
              placeholder="0.18"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="operator">Operator Name *</label>
          <input
            type="text"
            id="operator"
            name="operator"
            value={formData.operator}
            onChange={handleChange}
            required
            placeholder="Enter operator name"
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Fiber Data'}
        </button>
      </form>
    </div>
  )
}

export default BareFiberInput