const { pool } = require('../../../configuracion/bd');

const crearVenta = async (req, res) => {
    const { id_negocio, empleado_id, cliente_id, total_venta, descuento, productos, total_neto } = req.body;

    if (!id_negocio || !empleado_id || !cliente_id || !total_venta || !total_neto || !productos || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos para registrar la venta' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Registrar la venta
        const ventaQuery = `
            INSERT INTO Ventas (id_negocio, empleado_id, cliente_id, total_venta, descuento, total_neto)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_venta, fecha_venta;
        `;
        const ventaResult = await client.query(ventaQuery, [id_negocio, empleado_id, cliente_id, total_venta, descuento, total_neto]);
        const id_venta = ventaResult.rows[0].id_venta;

        // Registrar el detalle de la venta
        for (const prod of productos) {
            await client.query(
                `INSERT INTO Detalle_Ventas (venta_id, producto_id, cantidad, precio_unitario)
                 VALUES ($1, $2, $3, $4)`,
                [id_venta, prod.id_producto, prod.cantidad, prod.precio_unitario]
            );
            // Actualizar stock del producto
            await client.query(
                `UPDATE Productos SET stock = stock - $1 WHERE id_producto = $2 AND stock >= $1`,
                [prod.cantidad, prod.id_producto]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({
            message: 'Venta registrada correctamente',
            id_venta,
            fecha_venta: ventaResult.rows[0].fecha_venta
        });
        console.log('Datos de la venta:', {
            id_negocio,
            empleado_id,
            cliente_id,
            total_venta,
            descuento,
            total_neto,
            productos
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al registrar la venta:', error);
        res.status(500).json({ error: 'Error al registrar la venta' });
    } finally {
        client.release();
    }
};

module.exports = { crearVenta };