import React, { useState } from 'react'

const BareFiberInput = () => {
  const [fibers, setFibers] = useState(Array(30).fill().map((_, index) => ({
    seq_no: index + 1,
    spool_id: '',
    model_spool_no: '',
    fiber_color: '',
    attenuation_1310: '',
    attenuation_1550: '',
    power_meter_reading: '',
    remarks: ''
  })))

  const handleFiberChange = (index, field, value) => {
    const updatedFibers = [...fibers]
    updatedFibers[index] = { ...updatedFibers[index], [field]: value }
    setFibers(updatedFibers)
  }

  const fiberColors = [
    'Blue', 'Orange', 'Green', 'Brown', 'Slate', 'White',
    'Red', 'Black', 'Yellow', 'Violet', 'Rose', 'Aqua'
  ]

  return (
    <div className="component">
      <h2>BARE FIBER TESTING REPORT (Pre-Buffering)</h2>
      <p className="report-description">
        Purpose: To record the core identity and initial attenuation measurements of bare fibers prior to the buffering and cabling process.
      </p>

      <div className="table-container">
        <table className="fiber-table">
          <thead>
            <tr>
              <th>Seq. No.</th>
              <th>Spool ID</th>
              <th>Model Spool No.</th>
              <th>Fiber Color</th>
              <th>Attenuation @ 1310nm (dB/km)</th>
              <th>Attenuation @ 1550nm (dB/km)</th>
              <th>Power Meter Reading (dBm)</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {fibers.map((fiber, index) => (
              <tr key={index}>
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
                    value={fiber.power_meter_reading}
                    onChange={(e) => handleFiberChange(index, 'power_meter_reading', e.target.value)}
                    placeholder="-25.5"
                  />
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
            power_meter_reading: '',
            remarks: ''
          })))}
        >
          Clear All
        </button>
      </div>
    </div>
  )
}

export default BareFiberInput
