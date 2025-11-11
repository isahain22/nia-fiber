const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'fibertrack.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database:', dbPath);
        initializeDatabase();
    }
});

function initializeDatabase() {
    const tables = [
        `CREATE TABLE IF NOT EXISTS bare_fibers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fiber_id TEXT UNIQUE NOT NULL,
            fiber_type TEXT NOT NULL,
            batch_id TEXT NOT NULL,
            distance_1310 REAL NOT NULL,
            attenuation_1310 REAL NOT NULL,
            distance_1550 REAL NOT NULL,
            attenuation_1550 REAL NOT NULL,
            operator TEXT NOT NULL,
            date_tested DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'tested'
        )`,
        `CREATE TABLE IF NOT EXISTS cables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cable_id TEXT UNIQUE NOT NULL,
            tube_color TEXT NOT NULL,
            inside_diameter REAL NOT NULL,
            outside_diameter REAL NOT NULL,
            fiber_count INTEGER NOT NULL,
            customer_name TEXT NOT NULL,
            operator_name TEXT NOT NULL,
            bobbin_number TEXT NOT NULL,
            standard_length_km REAL NOT NULL,
            net_length_km REAL NOT NULL,
            relo_number TEXT,
            remarks TEXT,
            status TEXT DEFAULT 'in_progress',
            date_created DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS cable_fibers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cable_id TEXT NOT NULL,
            fiber_id TEXT NOT NULL,
            standard_color TEXT NOT NULL,
            position INTEGER NOT NULL,
            FOREIGN KEY (cable_id) REFERENCES cables (cable_id),
            FOREIGN KEY (fiber_id) REFERENCES bare_fibers (fiber_id)
        )`,
        `CREATE TABLE IF NOT EXISTS qc_checks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cable_id TEXT NOT NULL,
            qc_operator TEXT NOT NULL,
            date_checked DATETIME DEFAULT CURRENT_TIMESTAMP,
            measured_id_diameter REAL NOT NULL,
            measured_od_diameter REAL NOT NULL,
            optical_length REAL NOT NULL,
            status TEXT NOT NULL,
            remarks TEXT,
            FOREIGN KEY (cable_id) REFERENCES cables (cable_id)
        )`
    ];

    let tablesCreated = 0;
    tables.forEach((sql, index) => {
        db.run(sql, (err) => {
            if (err) {
                console.error(`❌ Error creating table ${index + 1}:`, err.message);
            } else {
                tablesCreated++;
                console.log(`✅ Table ${index + 1} created successfully`);
            }
            
            if (tablesCreated === tables.length) {
                console.log('🎉 All database tables initialized successfully!');
            }
        });
    });
}

module.exports = { db };