const { pool } = require('../../../configuracion/bd');

const registrarProducto = async (req, res) => {
    const { nombre, descripcion, precio_compra, precio_venta, stock, id_negocio, imagen_url } = req.body;

    try {
        // Validar que todos los campos requeridos estén presentes
        if (!nombre || !descripcion || !precio_compra || !precio_venta || !stock || !id_negocio || !imagen_url) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Insertar el producto en la base de datos
        const query = `
            INSERT INTO Productos (nombre, descripcion, precio_compra, precio_venta, stock, imagen_url, id_negocio)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [nombre, descripcion, precio_compra, precio_venta, stock, imagen_url, id_negocio];

        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Producto registrado exitosamente',
            producto: result.rows[0]
        });
    } catch (error) {
        console.error('Error al registrar el producto:', error);
        res.status(500).json({ error: 'Error al registrar el producto' });
    }
};

module.exports = { registrarProducto };