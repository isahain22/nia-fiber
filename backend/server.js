const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const bareFiberRoutes = require('./routes/bareFibers');
const cableRoutes = require('./routes/cables');
const qcCheckRoutes = require('./routes/qcChecks');

// Import database configuration
require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/bare-fibers', bareFiberRoutes);
app.use('/api/cables', cableRoutes);
app.use('/api/qc-checks', qcCheckRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'NIA FIBER QC TRACK API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 NIA FIBER QC TRACK Backend running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});