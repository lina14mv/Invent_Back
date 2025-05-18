const {pool} = require('../../../configuracion/bd');

const datosNegocio = async (req, res) => {
    const { id_negocio } = req.params;

    try {
        // Obtener datos del negocio
        const negocioQuery = `
            SELECT n.*
            FROM Negocios n
            WHERE n.id_negocio = $1
        `;
        const negocioResult = await pool.query(negocioQuery, [id_negocio]);
        if (negocioResult.rows.length === 0) {
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }
        const negocio = negocioResult.rows[0];

        // Obtener productos del negocio
        const productosQuery = `
            SELECT p.*
            FROM Productos p
            WHERE p.id_negocio = $1
        `;
        const productosResult = await pool.query(productosQuery, [id_negocio]);

        res.status(200).json({
            id_negocio: negocio.id_negocio,
            nombre: negocio.nombre,
            direccion: negocio.direccion,
            telefono: negocio.telefono,
            fondo: negocio.fondo,
            correo: negocio.correo,
            color_primario: negocio.color_primario,
            color_secundario: negocio.color_secundario,
            logo: negocio.logo_url,
            propietario: {
                nombre: negocio.nombre_dueno,
            },
            productos: productosResult.rows.map(prod => ({
                id_producto: prod.id_producto,
                nombre: prod.nombre,
                precio: prod.precio,
                stock: prod.stock,
            }))
        });
    } catch (error) {
        console.error('Error al obtener datos del negocio:', error);
        res.status(500).json({ error: 'Error al obtener datos del negocio' });
    }
}

module.exports = datosNegocio;