import React from 'react'

const ReportGenerator = () => {
  return (
    <div className="component">
      <h2>Report Generator</h2>
      <p>Generate comprehensive quality reports for all production stages.</p>
      <div className="report-options">
        <button className="btn-primary">Bare Fiber Report</button>
        <button className="btn-primary">Buffering Report</button>
        <button className="btn-primary">Stranding Report</button>
        <button className="btn-primary">Sheathing Report</button>
        <button className="btn-primary">Complete Cable Report</button>
      </div>
    </div>
  )
}

export default ReportGenerator
