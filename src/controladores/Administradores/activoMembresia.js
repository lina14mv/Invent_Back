const { pool } = require('../../../configuracion/bd');

const actualizarEstadoTodosNegociosPorMembresia = async (req, res) => {
    try {
        // Obtener todos los negocios y su última fecha_fin de membresía
        const result = await pool.query(`
            SELECT n.id_negocio, 
                   COALESCE(
                       (SELECT fecha_fin 
                        FROM Membresias m 
                        WHERE m.id_negocio = n.id_negocio 
                        ORDER BY fecha_fin DESC LIMIT 1), 
                       NULL
                   ) AS fecha_fin
            FROM Negocios n
        `);

        const hoy = new Date();
        let actualizados = 0;

        for (const row of result.rows) {
            let activo = false;
            if (row.fecha_fin) {
                activo = new Date(row.fecha_fin) >= hoy;
            }
            await pool.query(
                `UPDATE Negocios SET activo = $1 WHERE id_negocio = $2`,
                [activo, row.id_negocio]
            );
            actualizados++;
        }

        res.status(200).json({
            message: `Estados de ${actualizados} negocios actualizados correctamente`
        });
    } catch (error) {
        console.error('Error al actualizar estados de negocios:', error);
        res.status(500).json({ error: 'Error al actualizar estados de negocios' });
    }
};

module.exports = actualizarEstadoTodosNegociosPorMembresia;