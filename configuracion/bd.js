const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const testDbConnection = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('Conexión a la base de datos exitosa');
    } catch (err) {
        console.error('Error al conectar a la base de datos', err);
    }
};

module.exports = { pool, testDbConnection };