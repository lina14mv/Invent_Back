const { pool } = require('../../../configuracion/bd');

const finanzas = async (req, res) => {
    const { id_negocio } = req.params;

    try {
        // Total de ventas y total de ingresos en el mes actual
        const ventasMes = await pool.query(
            `SELECT COUNT(*) AS total_ventas, 
                    COALESCE(SUM(total_venta),0) AS total_ingresos
             FROM Ventas
             WHERE id_negocio = $1
               AND DATE_TRUNC('month', fecha_venta) = DATE_TRUNC('month', CURRENT_DATE)`,
            [id_negocio]
        );

        // Cantidad de productos vendidos en el mes actual
        const productosVendidosMes = await pool.query(
            `SELECT COALESCE(SUM(dv.cantidad),0) AS cantidad_productos
             FROM Ventas v
             JOIN Detalle_Ventas dv ON v.id_venta = dv.venta_id
             WHERE v.id_negocio = $1
               AND DATE_TRUNC('month', v.fecha_venta) = DATE_TRUNC('month', CURRENT_DATE)`,
            [id_negocio]
        );

        // Ventas por mes (últimos 12 meses)
        const ventasPorMes = await pool.query(
            `SELECT TO_CHAR(DATE_TRUNC('month', fecha_venta), 'YYYY-MM') AS mes,
                    COUNT(*) AS total_ventas,
                    COALESCE(SUM(total_venta),0) AS total_ingresos
             FROM Ventas
             WHERE id_negocio = $1
             GROUP BY mes
             ORDER BY mes DESC
             LIMIT 12`,
            [id_negocio]
        );

        // Top 5 productos más vendidos en el mes actual
        const topProductos = await pool.query(
            `SELECT p.nombre, SUM(dv.cantidad) AS cantidad_vendida
             FROM Ventas v
             JOIN Detalle_Ventas dv ON v.id_venta = dv.venta_id
             JOIN Productos p ON dv.producto_id = p.id_producto
             WHERE v.id_negocio = $1
               AND DATE_TRUNC('month', v.fecha_venta) = DATE_TRUNC('month', CURRENT_DATE)
             GROUP BY p.nombre
             ORDER BY cantidad_vendida DESC
             LIMIT 5`,
            [id_negocio]
        );

        res.status(200).json({
            total_ventas_mes: parseInt(ventasMes.rows[0].total_ventas),
            total_ingresos_mes: parseFloat(ventasMes.rows[0].total_ingresos),
            cantidad_productos_vendidos_mes: parseInt(productosVendidosMes.rows[0].cantidad_productos),
            ventas_por_mes: ventasPorMes.rows,
            top_5_productos: topProductos.rows
        });
    } catch (error) {
        console.error('Error al obtener datos financieros:', error);
        res.status(500).json({ error: 'Error al obtener datos financieros' });
    }
};

module.exports = finanzas;