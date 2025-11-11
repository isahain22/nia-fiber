import express from 'express';
import { Cable } from '../models/Cable.js';
import { CableFiber } from '../models/CableFiber.js';

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

// Get specific cable with full data
router.get('/:cableId', (req, res) => {
    const { cableId } = req.params;
    
    Cable.getFullCableData(cableId, (err, cableData) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!cableData) {
            return res.status(404).json({ error: 'Cable not found' });
        }
        res.json(cableData);
    });
});

// Add fibers to cable
router.post('/:cableId/fibers', (req, res) => {
    const { cableId } = req.params;
    const { fibers } = req.body;

    if (!fibers || !Array.isArray(fibers) || fibers.length === 0) {
        return res.status(400).json({ error: 'Fibers array is required' });
    }

    CableFiber.addFibersToCable(cableId, fibers, (err, successCount) => {
        if (err) {
            return res.status(400).json({ errors: err });
        }
        res.json({ 
            message: `${successCount} fibers added to cable successfully` 
        });
    });
});

export default router;