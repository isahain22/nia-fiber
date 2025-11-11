const express = require('express');
const { QCCheck } = require('../models/QCCheck');

const router = express.Router();

// Create new QC check
router.post('/', (req, res) => {
    const qcData = req.body;

    const required = [
        'cable_id', 'qc_operator', 'measured_id_diameter', 'measured_od_diameter',
        'optical_length', 'status'
    ];
    const missing = required.filter(field => !qcData[field]);
    
    if (missing.length > 0) {
        return res.status(400).json({ 
            error: `Missing required fields: ${missing.join(', ')}` 
        });
    }

    QCCheck.create(qcData, (err, id) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ 
            message: 'QC check saved successfully', 
            id: id 
        });
    });
});

module.exports = router;