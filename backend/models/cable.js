import { db } from '../config/database.js';

export class Cable {
    static create(cableData, callback) {
        const sql = `INSERT INTO cables 
            (cable_id, tube_color, inside_diameter, outside_diameter, fiber_count,
             customer_name, operator_name, bobbin_number, standard_length_km,
             net_length_km, relo_number, remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const params = [
            cableData.cable_id,
            cableData.tube_color,
            cableData.inside_diameter,
            cableData.outside_diameter,
            cableData.fiber_count,
            cableData.customer_name,
            cableData.operator_name,
            cableData.bobbin_number,
            cableData.standard_length_km,
            cableData.net_length_km,
            cableData.relo_number,
            cableData.remarks
        ];

        db.run(sql, params, function(err) {
            callback(err, this?.lastID);
        });
    }

    static findAll(callback) {
        const sql = `
            SELECT c.*, 
                   COUNT(cf.id) as actual_fiber_count,
                   qc.status as qc_status
            FROM cables c
            LEFT JOIN cable_fibers cf ON c.cable_id = cf.cable_id
            LEFT JOIN qc_checks qc ON c.cable_id = qc.cable_id
            GROUP BY c.cable_id
            ORDER BY c.date_created DESC
        `;
        db.all(sql, [], callback);
    }

    static findById(cableId, callback) {
        const sql = "SELECT * FROM cables WHERE cable_id = ?";
        db.get(sql, [cableId], callback);
    }

    static getFullCableData(cableId, callback) {
        const cableSql = "SELECT * FROM cables WHERE cable_id = ?";
        
        db.get(cableSql, [cableId], (err, cable) => {
            if (err) {
                callback(err);
                return;
            }

            if (!cable) {
                callback(null, null);
                return;
            }

            const fibersSql = `
                SELECT cf.*, bf.* 
                FROM cable_fibers cf 
                JOIN bare_fibers bf ON cf.fiber_id = bf.fiber_id 
                WHERE cf.cable_id = ? 
                ORDER BY cf.position
            `;

            const qcSql = `
                SELECT * FROM qc_checks 
                WHERE cable_id = ? 
                ORDER BY date_checked DESC 
                LIMIT 1
            `;

            db.all(fibersSql, [cableId], (err, fibers) => {
                if (err) {
                    callback(err);
                    return;
                }

                db.get(qcSql, [cableId], (err, qcCheck) => {
                    callback(err, {
                        cable,
                        fibers,
                        qc_check: qcCheck
                    });
                });
            });
        });
    }

    static updateStatus(cableId, status, callback) {
        const sql = "UPDATE cables SET status = ? WHERE cable_id = ?";
        db.run(sql, [status, cableId], callback);
    }
}