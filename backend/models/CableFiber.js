const { db } = require('../config/database');

class CableFiber {
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
}

module.exports = { CableFiber };