const { db } = require('../config/database');

class Cable {
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
        const sql = "SELECT * FROM cables ORDER BY date_created DESC";
        db.all(sql, [], callback);
    }
}

module.exports = { Cable };