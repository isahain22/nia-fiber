import express from 'express';
import { BareFiber } from '../models/BareFiber.js';

const router = express.Router();

// Create new bare fiber
router.post('/', (req, res) => {
    const fiberData = req.body;

    // Validate required fields
    const required = ['fiber_id', 'fiber_type', 'batch_id', 'distance_1310', 
                     'attenuation_1310', 'distance_1550', 'attenuation_1550', 'operator'];
    const missing = required.filter(field => !fiberData[field]);
    
    if (missing.length > 0) {
        return res.status(400).json({ 
            error: `Missing required fields: ${missing.join(', ')}` 
        });
    }

    BareFiber.create(fiberData, (err, id) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ 
            message: 'Bare fiber data saved successfully', 
            id: id 
        });
    });
});

// Get all bare fibers
router.get('/', (req, res) => {
    BareFiber.findAll((err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Get available fibers (not yet in cables)
router.get('/available', (req, res) => {
    BareFiber.findAvailableFibers((err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Get specific fiber by ID
router.get('/:fiberId', (req, res) => {
    const { fiberId } = req.params;
    
    BareFiber.findByFiberId(fiberId, (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Fiber not found' });
        }
        res.json({ data: row });
    });
});

export default router;