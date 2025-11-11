import express from 'express';
import { QCCheck } from '../models/QCCheck.js';

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

// Get all QC checks
router.get('/', (req, res) => {
    QCCheck.findAll((err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Get QC check for specific cable
router.get('/:cableId', (req, res) => {
    const { cableId } = req.params;
    
    QCCheck.findByCableId(cableId, (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: row });
    });
});

export default router;