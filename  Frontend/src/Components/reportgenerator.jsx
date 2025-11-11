import React, { useState, useEffect } from 'react'
import { cableAPI } from '../services/api'

const ReportGenerator = () => {
  const [cables, setCables] = useState([])
  const [selectedCable, setSelectedCable] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAllCables()
  }, [])

  const loadAllCables = async () => {
    setLoading(true)
    try {
      const response = await cableAPI.getAll()
      setCables(response.data.data || [])
    } catch (error) {
      console.error('Error loading cables:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCableSelect = async (cableId) => {
    setLoading(true)
    try {
      const response = await cableAPI.getById(cableId)
      setSelectedCable(response.data)
    } catch (error) {
      console.error('Error loading cable details:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = () => {
    if (!selectedCable) return

    const reportWindow = window.open('', '_blank')
    const cable = selectedCable.cable
    const fibers = selectedCable.fibers
    const qcCheck = selectedCable.qc_check

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>NIA FIBER QC REPORT - ${cable.cable_id}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #dc2626; 
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 { 
            color: #1e40af; 
            margin: 0; 
          }
          .header h2 { 
            color: #dc2626; 
            margin: 5px 0 0 0;
          }
          .section { 
            margin-bottom: 30px; 
          }
          .section h3 { 
            background: #f3f4f6; 
            padding: 10px; 
            border-left: 4px solid #dc2626;
            color: #1e293b;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
            margin: 15px 0; 
          }
          .info-item { 
            display: flex; 
            justify-content: space-between;
            border-bottom: 1px solid #e5e7eb;
            padding: 5px 0;
          }
          .info-item label { 
            font-weight: bold; 
            color: #374151;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0;
          }
          th, td { 
            border: 1px solid #d1d5db; 
            padding: 10px; 
            text-align: left; 
          }
          th { 
            background: #f8fafc; 
            font-weight: bold;
          }
          .status-pass { color: #065f46; font-weight: bold; }
          .status-fail { color: #dc2626; font-weight: bold; }
          .qc-result { 
            background: #f0f9ff; 
            padding: 15px; 
            border-radius: 5px;
            margin: 15px 0;
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            color: #6b7280; 
            font-size: 0.9em;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .color-dot {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
            vertical-align: middle;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>NIA FIBER QC TRACK</h1>
          <h2>FIBER OPTIC CABLE QUALITY REPORT</h2>
        </div>

        <div class="section">
          <h3>Cable Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Cable ID:</label>
              <span>${cable.cable_id}</span>
            </div>
            <div class="info-item">
              <label>Customer:</label>
              <span>${cable.customer_name}</span>
            </div>
            <div class="info-item">
              <label>Tube Color:</label>
              <span>${cable.tube_color}</span>
            </div>
            <div class="info-item">
              <label>Bobbin Number:</label>
              <span>${cable.bobbin_number}</span>
            </div>
            <div class="info-item">
              <label>Specified Dimensions:</label>
              <span>ID: ${cable.inside_diameter}mm / OD: ${cable.outside_diameter}mm</span>
            </div>
            <div class="info-item">
              <label>Length:</label>
              <span>Standard: ${cable.standard_length_km}km / Net: ${cable.net_length_km}km</span>
            </div>
            <div class="info-item">
              <label>Created:</label>
              <span>${new Date(cable.date_created).toLocaleDateString()} by ${cable.operator_name}</span>
            </div>
            <div class="info-item">
              <label>Status:</label>
              <span class="${cable.status === 'qc_passed' || cable.status === 'completed' ? 'status-pass' : 'status-fail'}">
                ${cable.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Fiber Details (${fibers.length} fibers)</h3>
          <table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Fiber ID</th>
                <th>Type</th>
                <th>Distance @1310nm</th>
                <th>Attenuation @1310nm</th>
                <th>Distance @1550nm</th>
                <th>Attenuation @1550nm</th>
              </tr>
            </thead>
            <tbody>
              ${fibers.map(fiber => `
                <tr>
                  <td>
                    <span class="color-dot" style="background-color: ${fiber.standard_color.toLowerCase()}"></span>
                    ${fiber.standard_color}
                  </td>
                  <td>${fiber.fiber_id}</td>
                  <td>${fiber.fiber_type}</td>
                  <td>${fiber.distance_1310} km</td>
                  <td>${fiber.attenuation_1310} dB/km</td>
                  <td>${fiber.distance_1550} km</td>
                  <td>${fiber.attenuation_1550} dB/km</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${qcCheck ? `
        <div class="section">
          <h3>Quality Control Check Results</h3>
          <div class="qc-result">
            <div class="info-grid">
              <div class="info-item">
                <label>QC Operator:</label>
                <span>${qcCheck.qc_operator}</span>
              </div>
              <div class="info-item">
                <label>Date Checked:</label>
                <span>${new Date(qcCheck.date_checked).toLocaleDateString()}</span>
              </div>
              <div class="info-item">
                <label>Measured Dimensions:</label>
                <span>ID: ${qcCheck.measured_id_diameter}mm / OD: ${qcCheck.measured_od_diameter}mm</span>
              </div>
              <div class="info-item">
                <label>Optical Length:</label>
                <span>${qcCheck.optical_length} km</span>
              </div>
              <div class="info-item">
                <label>QC Status:</label>
                <span class="${qcCheck.status === 'pass' ? 'status-pass' : 'status-fail'}">
                  ${qcCheck.status.toUpperCase()}
                </span>
              </div>
            </div>
            ${qcCheck.remarks ? `
              <div class="info-item">
                <label>Remarks:</label>
                <span>${qcCheck.remarks}</span>
              </div>
            ` : ''}
          </div>
        </div>
        ` : `
        <div class="section">
          <h3>Quality Control Check Results</h3>
          <p><em>No QC check performed yet</em></p>
        </div>
        `}

        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>NIA FIBER QC TRACK - Fiber Optic Quality Control Management System</p>
        </div>
      </body>
      </html>
    `)

    reportWindow.document.close()
    setTimeout(() => {
      reportWindow.print()
    }, 250)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'in_progress': { class: 'status-in-progress', text: 'In Progress' },
      'qc_passed': { class: 'status-pass', text: 'QC Passed' },
      'qc_failed': { class: 'status-fail', text: 'QC Failed' },
      'completed': { class: 'status-pass', text: 'Completed' }
    }
    
    const statusInfo = statusMap[status] || { class: 'status-in-progress', text: status }
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>
  }

  return (
    <div className="component">
      <h2>Report Generator</h2>
      <p className="mb-3">Generate comprehensive quality reports for fiber optic cables</p>

      <div className="report-layout">
        <div className="report-sidebar">
          <h3>Available Cables</h3>
          <div className="cable-list">
            {loading ? (
              <div className="loading">Loading cables...</div>
            ) : (
              <div className="list-items">
                {cables.map(cable => (
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
                      <span>{cable.tube_color}</span>
                      {getStatusBadge(cable.qc_status || cable.status)}
                    </div>
                  </div>
                ))}
                {cables.length === 0 && (
                  <div className="no-data">No cables available</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="report-main">
          {selectedCable ? (
            <div className="report-preview">
              <div className="preview-header">
                <h3>Report Preview: {selectedCable.cable.cable_id}</h3>
                <button 
                  className="btn-primary"
                  onClick={generateReport}
                  disabled={loading}
                >
                  📄 Generate & Print Report
                </button>
              </div>

              <div className="preview-content">
                <div className="preview-section">
                  <h4>Cable Information</h4>
                  <div className="preview-grid">
                    <div><strong>Cable ID:</strong> {selectedCable.cable.cable_id}</div>
                    <div><strong>Customer:</strong> {selectedCable.cable.customer_name}</div>
                    <div><strong>Tube Color:</strong> {selectedCable.cable.tube_color}</div>
                    <div><strong>Bobbin:</strong> {selectedCable.cable.bobbin_number}</div>
                    <div><strong>Dimensions:</strong> ID: {selectedCable.cable.inside_diameter}mm / OD: {selectedCable.cable.outside_diameter}mm</div>
                    <div><strong>Length:</strong> Standard: {selectedCable.cable.standard_length_km}km / Net: {selectedCable.cable.net_length_km}km</div>
                  </div>
                </div>

                <div className="preview-section">
                  <h4>Fiber Details ({selectedCable.fibers.length} fibers)</h4>
                  <div className="preview-table">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Color</th>
                          <th>Fiber ID</th>
                          <th>1310nm</th>
                          <th>1550nm</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCable.fibers.map(fiber => (
                          <tr key={fiber.fiber_id}>
                            <td>
                              <div 
                                className="color-dot"
                                style={{ backgroundColor: fiber.standard_color.toLowerCase() }}
                              ></div>
                              {fiber.standard_color}
                            </td>
                            <td>{fiber.fiber_id}</td>
                            <td>{fiber.distance_1310}km, {fiber.attenuation_1310}dB/km</td>
                            <td>{fiber.distance_1550}km, {fiber.attenuation_1550}dB/km</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedCable.qc_check && (
                  <div className="preview-section">
                    <h4>QC Check Results</h4>
                    <div className="preview-grid">
                      <div><strong>Operator:</strong> {selectedCable.qc_check.qc_operator}</div>
                      <div><strong>Date:</strong> {new Date(selectedCable.qc_check.date_checked).toLocaleDateString()}</div>
                      <div><strong>Dimensions:</strong> ID: {selectedCable.qc_check.measured_id_diameter}mm / OD: {selectedCable.qc_check.measured_od_diameter}mm</div>
                      <div><strong>Optical Length:</strong> {selectedCable.qc_check.optical_length}km</div>
                      <div><strong>Status:</strong> {getStatusBadge(selectedCable.qc_check.status)}</div>
                      {selectedCable.qc_check.remarks && (
                        <div><strong>Remarks:</strong> {selectedCable.qc_check.remarks}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <div className="placeholder">
                <h3>Select a Cable to Generate Report</h3>
                <p>Choose a cable from the list to generate a comprehensive quality report</p>
                <div className="report-features">
                  <h4>Report Includes:</h4>
                  <ul>
                    <li>Complete cable specifications</li>
                    <li>Detailed fiber measurements</li>
                    <li>QC check results</li>
                    <li>Professional formatting</li>
                    <li>Print-ready layout</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportGenerator