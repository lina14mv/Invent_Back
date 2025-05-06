const { pool } = require('../../../configuracion/bd');

const mostrarProductos = async (req, res) => {
    const { id_negocio } = req.params;

    try {
        // Validar que se haya proporcionado el id_negocio
        if (!id_negocio) {
            return res.status(400).json({ error: 'El id del negocio es obligatorio' });
        }

        // Consulta para obtener los productos del negocio junto con la información del negocio
        const query = `
            SELECT 
                n.nombre AS nombre_negocio,
                n.logo_url AS imagen_negocio,
                p.id_producto,
                p.nombre AS nombre_producto,
                p.descripcion,
                p.precio_compra,
                p.precio_venta,
                p.stock,
                p.imagen_url AS imagen_producto
            FROM Negocios n
            INNER JOIN Productos p ON n.id_negocio = p.id_negocio
            WHERE n.id_negocio = $1
            ORDER BY p.nombre;
        `;

        const result = await pool.query(query, [id_negocio]);

        // Verificar si hay productos asociados al negocio
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para este negocio' });
        }

        // Estructurar la respuesta
        const negocio = {
            nombre: result.rows[0].nombre_negocio,
            imagen: result.rows[0].imagen_negocio,
            productos: result.rows.map(producto => ({
                id_producto: producto.id_producto,
                nombre: producto.nombre_producto,
                descripcion: producto.descripcion,
                precio_compra: producto.precio_compra,
                precio_venta: producto.precio_venta,
                stock: producto.stock,
                disponibilidad: producto.stock > 0 ? 'Disponible' : 'No disponible',
                imagen: producto.imagen_producto
            }))
        };

        res.status(200).json(negocio);
    } catch (error) {
        console.error('Error al mostrar los productos:', error);
        res.status(500).json({ error: 'Error al mostrar los productos' });
    }
};

module.exports = { mostrarProductos };