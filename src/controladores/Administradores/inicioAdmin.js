const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Controlador para realizar todas las consultas y retornar una única respuesta
const consultaInicial = async (req, res) => {
    try {
        // Contar negocios (empresas y fincas)
        const resultNegocios = await pool.query("SELECT tipo_negocio, COUNT(*) AS cantidad FROM Negocios GROUP BY tipo_negocio");
        const negocios = resultNegocios.rows.reduce((acc, row) => {
            acc[row.tipo_negocio] = parseInt(row.cantidad, 10);
            return acc;
        }, {});
        // Contar usuarios
        const resultUsuarios = await pool.query('SELECT COUNT(*) AS cantidad FROM Usuarios');
        const cantidadUsuarios = parseInt(resultUsuarios.rows[0].cantidad, 10);

        // Contar clientes
        const resultClientes = await pool.query('SELECT COUNT(*) AS cantidad FROM Clientes');
        const cantidadClientes = parseInt(resultClientes.rows[0].cantidad, 10);

        // Contar productos
        const resultProductos = await pool.query('SELECT COUNT(*) AS cantidad FROM Productos');
        const cantidadProductos = parseInt(resultProductos.rows[0].cantidad, 10);

        // Contar ventas
        const resultVentas = await pool.query('SELECT COUNT(*) AS cantidad FROM Ventas');
        const cantidadVentas = parseInt(resultVentas.rows[0].cantidad, 10);
         // Retornar datos de las empresas y fincas con la suma de ventas del último mes
         const resultDatosNegocios = await pool.query(`
            SELECT 
                n.nombre AS nombre_negocio, 
                n.direccion, 
                n.telefono, 
                COALESCE(SUM(v.total_venta), 0) AS total_ventas_ultimo_mes
            FROM Negocios n
            LEFT JOIN Ventas v ON n.id_negocio = v.id_negocio AND v.fecha_venta >= NOW() - INTERVAL '1 month'
            GROUP BY n.id_negocio, n.nombre, n.direccion, n.telefono
        `);
        const datosNegocios = resultDatosNegocios.rows;

        // Retornar todas las consultas en una única respuesta
        res.status(200).json({
            negocios,
            cantidadUsuarios,
            cantidadClientes,
            cantidadProductos,
            cantidadVentas,
            datosNegocios
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al realizar la consulta inicial' });
    }
};

module.exports = {
    consultaInicial
};