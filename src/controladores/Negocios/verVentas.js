const { pool } = require('../../../configuracion/bd');

const verVentas = async (req, res) => {
    const { id_negocio } = req.params;
    try {
        const result = await pool.query(
            `SELECT v.*, c.nombre AS cliente_nombre, u.nombre AS empleado_nombre
             FROM Ventas v
             LEFT JOIN Clientes c ON v.cliente_id = c.id_cliente
             LEFT JOIN Usuarios u ON v.empleado_id = u.id_usuario
             WHERE v.id_negocio = $1
             ORDER BY v.fecha_venta DESC`,
            [id_negocio]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ error: 'Error al obtener ventas' });
    }
};

module.exports = verVentas;