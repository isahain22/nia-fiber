import { db } from '../config/database.js';

export class CableFiber {
    static addFibersToCable(cableId, fibers, callback) {
        const sql = `INSERT INTO cable_fibers (cable_id, fiber_id, standard_color, position) 
                     VALUES (?, ?, ?, ?)`;
        
        const stmt = db.prepare(sql);
        let errors = [];
        let successCount = 0;

        fibers.forEach((fiber, index) => {
            stmt.run([cableId, fiber.fiber_id, fiber.standard_color, fiber.position], 
                function(err) {
                    if (err) {
                        errors.push(`Fiber ${fiber.fiber_id}: ${err.message}`);
                    } else {
                        successCount++;
                    }

                    // If this is the last fiber, finalize
                    if (index === fibers.length - 1) {
                        stmt.finalize((finalErr) => {
                            if (finalErr) {
                                errors.push(`Finalization error: ${finalErr.message}`);
                            }
                            callback(errors.length > 0 ? errors : null, successCount);
                        });
                    }
                });
        });
    }

    static getCableFibers(cableId, callback) {
        const sql = `
            SELECT cf.*, bf.* 
            FROM cable_fibers cf 
            JOIN bare_fibers bf ON cf.fiber_id = bf.fiber_id 
            WHERE cf.cable_id = ? 
            ORDER BY cf.position
        `;
        db.all(sql, [cableId], callback);
    }
}