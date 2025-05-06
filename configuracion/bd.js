const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: 5432, // Puerto por defecto de PostgreSQL
    ssl: { rejectUnauthorized: false }, // Habilitar SSL
    idleTimeoutMillis: 30000, // Tiempo de espera para liberar conexiones inactivas
    connectionTimeoutMillis: 10000, // Tiempo de espera para establecer una conexión
});

const testDbConnection = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('Conexión a la base de datos exitosa');
    } catch (error) {
        console.error('Error al conectar a la base de datos', error.message); // Corregido
    }
};

module.exports = { pool, testDbConnection };