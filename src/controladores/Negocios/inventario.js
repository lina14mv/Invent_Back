const { pool } = require('../../../configuracion/bd');

// Aumentar stock de un producto
const aumentarStock = async (req, res) => {
    const { id_producto } = req.params;
    const { cantidad } = req.body;

    try {
        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
        }

        const query = `
            UPDATE Productos
            SET stock = stock + $1
            WHERE id_producto = $2
            RETURNING *;
        `;
        const values = [cantidad, id_producto];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({
            message: 'Stock aumentado correctamente',
            producto: result.rows[0]
        });
    } catch (error) {
        console.error('Error al aumentar el stock:', error);
        res.status(500).json({ error: 'Error al aumentar el stock' });
    }
};

// Disminuir stock de un producto
const disminuirStock = async (req, res) => {
    const { id_producto } = req.params;
    const { cantidad } = req.body;

    try {
        if (!cantidad || cantidad <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
        }

        const query = `
            UPDATE Productos
            SET stock = stock - $1
            WHERE id_producto = $2 AND stock >= $1
            RETURNING *;
        `;
        const values = [cantidad, id_producto];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Stock insuficiente o producto no encontrado' });
        }

        res.status(200).json({
            message: 'Stock disminuido correctamente',
            producto: result.rows[0]
        });
    } catch (error) {
        console.error('Error al disminuir el stock:', error);
        res.status(500).json({ error: 'Error al disminuir el stock' });
    }
};

// Editar un producto
const editarProducto = async (req, res) => {
    const { id_producto } = req.params;
    const { nombre, descripcion, precio_compra, precio_venta, stock, imagen_url } = req.body;

    try {
        const fieldsToUpdate = [];
        const values = [];
        let query = 'UPDATE Productos SET ';

        if (nombre) {
            fieldsToUpdate.push('nombre = $' + (fieldsToUpdate.length + 1));
            values.push(nombre);
        }
        if (descripcion) {
            fieldsToUpdate.push('descripcion = $' + (fieldsToUpdate.length + 1));
            values.push(descripcion);
        }
        if (precio_compra) {
            fieldsToUpdate.push('precio_compra = $' + (fieldsToUpdate.length + 1));
            values.push(precio_compra);
        }
        if (precio_venta) {
            fieldsToUpdate.push('precio_venta = $' + (fieldsToUpdate.length + 1));
            values.push(precio_venta);
        }
        if (stock) {
            fieldsToUpdate.push('stock = $' + (fieldsToUpdate.length + 1));
            values.push(stock);
        }
        if (imagen_url) {
            fieldsToUpdate.push('imagen_url = $' + (fieldsToUpdate.length + 1));
            values.push(imagen_url);
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
        }

        query += fieldsToUpdate.join(', ') + ' WHERE id_producto = $' + (fieldsToUpdate.length + 1) + ' RETURNING *';
        values.push(id_producto);

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({
            message: 'Producto actualizado correctamente',
            producto: result.rows[0]
        });
    } catch (error) {
        console.error('Error al editar producto:', error);
        res.status(500).json({ error: 'Error al editar producto' });
    }
};

module.exports = { aumentarStock, disminuirStock, editarProducto };