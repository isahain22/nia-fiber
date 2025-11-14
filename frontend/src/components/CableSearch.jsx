import React from 'react'

const CableSearch = () => {
  return (
    <div className="component">
      <h2>Cable Search & Tracking</h2>
      <p>Search and view complete cable production history across all stages.</p>
      <div className="search-section">
        <input type="text" placeholder="Search by Cable ID, Customer, or Tube ID..." className="search-input" />
        <button className="btn-primary">Search</button>
      </div>
    </div>
  )
}

export default CableSearch
