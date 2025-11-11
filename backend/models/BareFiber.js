const { db } = require('../config/database');

class BareFiber {
    static create(fiberData, callback) {
        const sql = `INSERT INTO bare_fibers 
            (fiber_id, fiber_type, batch_id, distance_1310, attenuation_1310, 
             distance_1550, attenuation_1550, operator) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const params = [
            fiberData.fiber_id,
            fiberData.fiber_type,
            fiberData.batch_id,
            fiberData.distance_1310,
            fiberData.attenuation_1310,
            fiberData.distance_1550,
            fiberData.attenuation_1550,
            fiberData.operator
        ];

        db.run(sql, params, function(err) {
            callback(err, this?.lastID);
        });
    }

    static findAll(callback) {
        const sql = "SELECT * FROM bare_fibers ORDER BY date_tested DESC";
        db.all(sql, [], callback);
    }

    static findAvailableFibers(callback) {
        const sql = `
            SELECT bf.* 
            FROM bare_fibers bf 
            LEFT JOIN cable_fibers cf ON bf.fiber_id = cf.fiber_id 
            WHERE cf.fiber_id IS NULL 
            ORDER BY bf.date_tested DESC
        `;
        db.all(sql, [], callback);
    }
}

module.exports = { BareFiber };