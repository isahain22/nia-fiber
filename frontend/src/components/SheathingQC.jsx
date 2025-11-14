import React, { useState } from 'react'

const SheathingQC = () => {
  const [cableData, setCableData] = useState({
    cable_id: '',
    customer: '',
    sheath_color: '',
    standard_length: '',
    measured_length_1550: '',
    sheath_thickness: '',
    outer_diameter: '',
    print_quality: '',
    test_date: '',
    operator: ''
  })

  const [qcMeasurements, setQcMeasurements] = useState({
    tensile_strength: '',
    elongation: '',
    compression_resistance: '',
    impact_resistance: '',
    temperature_rating: ''
  })

  const [visualChecks, setVisualChecks] = useState({
    surface_smoothness: '',
    color_consistency: '',
    print_legibility: '',
    marking_accuracy: ''
  })

  const handleCableDataChange = (field, value) => {
    setCableData(prev => ({ ...prev, [field]: value }))
  }

  const handleQcMeasurementChange = (field, value) => {
    setQcMeasurements(prev => ({ ...prev, [field]: value }))
  }

  const handleVisualCheckChange = (field, value) => {
    setVisualChecks(prev => ({ ...prev, [field]: value }))
  }

  const isShortLength = cableData.measured_length_1550 && parseFloat(cableData.measured_length_1550) < 24.5

  return (
    <div className="component">
      <h2>Sheathing Quality Control</h2>
      <p className="section-description">
        Final quality control measurements for sheathed cables. Verify length, dimensions, and quality standards.
      </p>

      <div className="form-section">
        <h3>Cable Information</h3>
        {isShortLength && (
          <div className="warning-banner">
            ⚠️ Cable length is short (&lt;24.5km)
          </div>
        )}
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
            <label>Sheath Color:</label>
            <input 
              type="text" 
              value={cableData.sheath_color}
              onChange={(e) => handleCableDataChange('sheath_color', e.target.value)}
              placeholder="Black"
            />
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
          <div className="form-group">
            <label>Measured Length @1550nm (km):</label>
            <input 
              type="number" 
              step="0.01"
              value={cableData.measured_length_1550}
              onChange={(e) => handleCableDataChange('measured_length_1550', e.target.value)}
              placeholder="25.00"
              className={isShortLength ? 'input-warning' : ''}
            />
          </div>
          <div className="form-group">
            <label>Sheath Thickness (mm):</label>
            <input 
              type="number" 
              step="0.01"
              value={cableData.sheath_thickness}
              onChange={(e) => handleCableDataChange('sheath_thickness', e.target.value)}
              placeholder="2.0"
            />
          </div>
          <div className="form-group">
            <label>Outer Diameter (mm):</label>
            <input 
              type="number" 
              step="0.01"
              value={cableData.outer_diameter}
              onChange={(e) => handleCableDataChange('outer_diameter', e.target.value)}
              placeholder="12.0"
            />
          </div>
          <div className="form-group">
            <label>Print Quality:</label>
            <select 
              value={cableData.print_quality}
              onChange={(e) => handleCableDataChange('print_quality', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Acceptable">Acceptable</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Test Date:</label>
            <input 
              type="date" 
              value={cableData.test_date}
              onChange={(e) => handleCableDataChange('test_date', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Operator:</label>
            <input 
              type="text" 
              value={cableData.operator}
              onChange={(e) => handleCableDataChange('operator', e.target.value)}
              placeholder="Operator Name"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Quality Control Measurements</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Tensile Strength (N):</label>
            <input 
              type="number" 
              step="0.1"
              value={qcMeasurements.tensile_strength}
              onChange={(e) => handleQcMeasurementChange('tensile_strength', e.target.value)}
              placeholder="2000"
            />
          </div>
          <div className="form-group">
            <label>Elongation (%):</label>
            <input 
              type="number" 
              step="0.1"
              value={qcMeasurements.elongation}
              onChange={(e) => handleQcMeasurementChange('elongation', e.target.value)}
              placeholder="300"
            />
          </div>
          <div className="form-group">
            <label>Compression Resistance (N/100mm):</label>
            <input 
              type="number" 
              step="0.1"
              value={qcMeasurements.compression_resistance}
              onChange={(e) => handleQcMeasurementChange('compression_resistance', e.target.value)}
              placeholder="2200"
            />
          </div>
          <div className="form-group">
            <label>Impact Resistance (J):</label>
            <input 
              type="number" 
              step="0.1"
              value={qcMeasurements.impact_resistance}
              onChange={(e) => handleQcMeasurementChange('impact_resistance', e.target.value)}
              placeholder="5.0"
            />
          </div>
          <div className="form-group">
            <label>Temperature Rating (°C):</label>
            <input 
              type="number" 
              step="1"
              value={qcMeasurements.temperature_rating}
              onChange={(e) => handleQcMeasurementChange('temperature_rating', e.target.value)}
              placeholder="-40 to +70"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Visual Checks</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Surface Smoothness:</label>
            <select 
              value={visualChecks.surface_smoothness}
              onChange={(e) => handleVisualCheckChange('surface_smoothness', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Smooth">Smooth</option>
              <option value="Slightly Rough">Slightly Rough</option>
              <option value="Rough">Rough</option>
            </select>
          </div>
          <div className="form-group">
            <label>Color Consistency:</label>
            <select 
              value={visualChecks.color_consistency}
              onChange={(e) => handleVisualCheckChange('color_consistency', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Consistent">Consistent</option>
              <option value="Slightly Variable">Slightly Variable</option>
              <option value="Variable">Variable</option>
            </select>
          </div>
          <div className="form-group">
            <label>Print Legibility:</label>
            <select 
              value={visualChecks.print_legibility}
              onChange={(e) => handleVisualCheckChange('print_legibility', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Acceptable">Acceptable</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Marking Accuracy:</label>
            <select 
              value={visualChecks.marking_accuracy}
              onChange={(e) => handleVisualCheckChange('marking_accuracy', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Accurate">Accurate</option>
              <option value="Slightly Off">Slightly Off</option>
              <option value="Inaccurate">Inaccurate</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Final Approval</h3>
        <div className="approval-section">
          <div className="approval-item">
            <label>
              <input type="checkbox" />
              All measurements within specification
            </label>
          </div>
          <div className="approval-item">
            <label>
              <input type="checkbox" />
              Visual inspection passed
            </label>
          </div>
          <div className="approval-item">
            <label>
              <input type="checkbox" />
              Documentation complete
            </label>
          </div>
          <div className="approval-item">
            <label>
              <input type="checkbox" />
              Ready for shipment
            </label>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-primary">Save Sheathing QC Data</button>
        <button type="button" className="btn-success">Final Approval</button>
        <button type="button" className="btn-secondary">Clear Form</button>
      </div>
    </div>
  )
}

export default SheathingQC
