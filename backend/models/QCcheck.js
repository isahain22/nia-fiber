import { db } from '../config/database.js';

export class QCCheck {
    static create(qcData, callback) {
        const sql = `INSERT INTO qc_checks 
            (cable_id, qc_operator, measured_id_diameter, measured_od_diameter,
             optical_length, status, remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        const params = [
            qcData.cable_id,
            qcData.qc_operator,
            qcData.measured_id_diameter,
            qcData.measured_od_diameter,
            qcData.optical_length,
            qcData.status,
            qcData.remarks
        ];

        db.run(sql, params, function(err) {
            if (!err) {
                // Update cable status
                const updateSql = "UPDATE cables SET status = ? WHERE cable_id = ?";
                db.run(updateSql, [qcData.status, qcData.cable_id]);
            }
            callback(err, this?.lastID);
        });
    }

    static findByCableId(cableId, callback) {
        const sql = "SELECT * FROM qc_checks WHERE cable_id = ? ORDER BY date_checked DESC LIMIT 1";
        db.get(sql, [cableId], callback);
    }

    static findAll(callback) {
        const sql = `
            SELECT qc.*, c.customer_name, c.tube_color 
            FROM qc_checks qc 
            JOIN cables c ON qc.cable_id = c.cable_id 
            ORDER BY qc.date_checked DESC
        `;
        db.all(sql, [], callback);
    }
}