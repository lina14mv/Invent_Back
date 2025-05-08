const { pool } = require('../../../configuracion/bd');

const desactivarNegocio = async (req, res) => {
    const { id_negocio } = req.params; // ID del negocio a desactivar

    try {
        // Validar que se haya proporcionado el ID del negocio
        if (!id_negocio) {
            return res.status(400).json({ error: 'El ID del negocio es obligatorio' });
        }

        // Actualizar el estado del negocio a inactivo
        const query = `
            UPDATE Negocios
            SET activo = FALSE
            WHERE id_negocio = $1
            RETURNING *;
        `;
        const result = await pool.query(query, [id_negocio]);

        // Verificar si el negocio fue encontrado y desactivado
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }

        res.status(200).json({
            message: 'Negocio desactivado correctamente',
            negocio: result.rows[0]
        });
    } catch (error) {
        console.error('Error al desactivar el negocio:', error);
        res.status(500).json({ error: 'Error al desactivar el negocio' });
    }
};

module.exports = { desactivarNegocio };