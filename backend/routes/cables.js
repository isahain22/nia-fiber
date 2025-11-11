const express = require('express');
const { Cable } = require('../models/Cable');
const { CableFiber } = require('../models/CableFiber');

const router = express.Router();

// Create new cable
router.post('/', (req, res) => {
    const cableData = req.body;

    const required = [
        'cable_id', 'tube_color', 'inside_diameter', 'outside_diameter', 
        'fiber_count', 'customer_name', 'operator_name', 'bobbin_number',
        'standard_length_km', 'net_length_km'
    ];
    const missing = required.filter(field => !cableData[field]);
    
    if (missing.length > 0) {
        return res.status(400).json({ 
            error: `Missing required fields: ${missing.join(', ')}` 
        });
    }

    Cable.create(cableData, (err, id) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ 
            message: 'Cable created successfully', 
            id: id 
        });
    });
});

// Get all cables
router.get('/', (req, res) => {
    Cable.findAll((err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

module.exports = router;