const { pool } = require('../../../configuracion/bd');

const listarNegocios = async (req, res) => {
    try {
        // Consulta para obtener información básica de los negocios
        const negociosQuery = `
            SELECT 
                n.id_negocio,
                n.nombre AS nombre_negocio,
                n.tipo_negocio,
                n.correo,
                n.telefono,
                n.direccion,
                n.nombre_dueno,
                n.cedula_dueno,
                n.nit,
                n.activo,
                n.fondo,
                n.color_primario,
                n.color_secundario,
                n.ubicacion_ciudad,
                COUNT(DISTINCT p.id_producto) AS cantidad_productos,
                COUNT(DISTINCT u.id_usuario) AS cantidad_trabajadores,
                COALESCE(SUM(v.total_venta), 0) AS total_ventas_mes
            FROM Negocios n
            LEFT JOIN Productos p ON n.id_negocio = p.id_negocio
            LEFT JOIN Usuarios u ON n.id_negocio = u.pertenece_negocio
            LEFT JOIN Ventas v ON n.id_negocio = v.id_negocio AND DATE_PART('month', v.fecha_venta) = DATE_PART('month', CURRENT_DATE)
            GROUP BY n.id_negocio
            ORDER BY n.nombre;
        `;

        const result = await pool.query(negociosQuery);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron negocios' });
        }

        res.status(200).json({ negocios: result.rows });
    } catch (error) {
        console.error('Error al listar los negocios:', error);
        res.status(500).json({ error: 'Error al listar los negocios' });
    }
};

module.exports = { listarNegocios };