const { db } = require('../config/database');

class QCCheck {
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
            callback(err, this?.lastID);
        });
    }
}

module.exports = { QCCheck };