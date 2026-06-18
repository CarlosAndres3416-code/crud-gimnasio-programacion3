const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function conexionDB() {
    return open({
        filename: path.join(__dirname, '../../database.db'),
        driver: sqlite3.Database
    });
}

async function inicializarDB() {
    const db = await conexionDB(); 
    await db.exec(`
        CREATE TABLE IF NOT EXISTS inscripciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_cliente TEXT NOT NULL,
            plan_gimnasio TEXT NOT NULL,
            monto_pago REAL NOT NULL,
            estado TEXT DEFAULT 'Activo',
            fecha_inscripcion TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

module.exports = { conexionDB, inicializarDB };