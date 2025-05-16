const { pool } = require('../../../configuracion/bd');

const obtenerColoresPorCorreo = async (req, res) => {
    const { correo, tipo } = req.body;

    try {
        if (tipo === 'negocio') {
            // Buscar en la tabla Negocios
            const result = await pool.query(
                'SELECT fondo, color_primario, color_secundario FROM Negocios WHERE correo = $1',
                [correo]
            );
            if (result.rows.length > 0) {
                return res.status(200).json({
                    fondo: result.rows[0].fondo,
                    color_primario: result.rows[0].color_primario,
                    color_secundario: result.rows[0].color_secundario
                });
            } else {
                return res.status(404).json({ error: 'Negocio no encontrado' });
            }
        } else if (tipo === 'usuario') {
            // Buscar en la tabla Usuarios
            const result = await pool.query(
                'SELECT pertenece_negocio FROM Usuarios WHERE correo = $1',
                [correo]
            );
            if (result.rows.length > 0 && result.rows[0].pertenece_negocio) {
                const id_negocio = result.rows[0].pertenece_negocio;
                const negocioResult = await pool.query(
                    'SELECT fondo, color_primario, color_secundario FROM Negocios WHERE id_negocio = $1',
                    [id_negocio]
                );
                if (negocioResult.rows.length > 0) {
                    return res.status(200).json({
                        fondo: negocioResult.rows[0].fondo,
                        color_primario: negocioResult.rows[0].color_primario,
                        color_secundario: negocioResult.rows[0].color_secundario
                    });
                } else {
                    return res.status(404).json({ error: 'Negocio no encontrado para este usuario' });
                }
            } else {
                return res.status(404).json({ error: 'Usuario no encontrado o no tiene negocio asociado' });
            }
        } else {
            return res.status(400).json({ error: 'Tipo no válido' });
        }
    } catch (error) {
        console.error('Error al obtener colores:', error);
        res.status(500).json({ error: 'Error al obtener colores' });
    }
};

module.exports = { obtenerColoresPorCorreo };