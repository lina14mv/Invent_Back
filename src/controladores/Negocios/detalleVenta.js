const { pool } = require('../../../configuracion/bd');

const detalleVenta = async (req, res) => {
    const { id_venta } = req.params;

    try {
        // Obtener datos generales de la venta, cliente y vendedor
        const ventaQuery = `
            SELECT v.id_venta, v.fecha_venta, v.total_venta, v.total_neto, v.descuento,
                   c.nombre AS cliente_nombre, c.correo AS cliente_correo,
                   u.nombre AS vendedor_nombre, u.correo AS vendedor_correo
            FROM Ventas v
            LEFT JOIN Clientes c ON v.cliente_id = c.id_cliente
            LEFT JOIN Usuarios u ON v.empleado_id = u.id_usuario
            WHERE v.id_venta = $1
        `;
        const ventaResult = await pool.query(ventaQuery, [id_venta]);
        if (ventaResult.rows.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        const venta = ventaResult.rows[0];

        // Obtener detalle de productos vendidos
        const productosQuery = `
            SELECT dv.producto_id, p.nombre AS producto_nombre, dv.cantidad, dv.precio_unitario
            FROM Detalle_Ventas dv
            LEFT JOIN Productos p ON dv.producto_id = p.id_producto
            WHERE dv.venta_id = $1
        `;
        const productosResult = await pool.query(productosQuery, [id_venta]);


        res.status(200).json({
            id_venta: venta.id_venta,
            fecha_venta: venta.fecha_venta,
            total_venta: venta.total_venta,
            total_neto: venta.total_neto,
            descuento: venta.descuento,
            cliente: {
                nombre: venta.cliente_nombre,
                correo: venta.cliente_correo
            },
            vendedor: {
                nombre: venta.vendedor_nombre,
                correo: venta.vendedor_correo
            },
            productos: productosResult.rows.map(prod => ({
                id: prod.producto_id,
                nombre: prod.producto_nombre,
                cantidad: prod.cantidad,
                precio_unitario: prod.precio_unitario,
                subtotal: prod.cantidad * parseFloat(prod.precio_unitario)
            }))
        });
        console.log('Detalle de venta:', {
            id_venta: venta.id_venta,
            fecha_venta: venta.fecha_venta,
            total_venta: venta.total_venta
        });
    } catch (error) {
        console.error('Error al obtener detalle de venta:', error);
        res.status(500).json({ error: 'Error al obtener detalle de venta' });
    }
};

module.exports = detalleVenta;