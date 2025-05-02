const { pool } = require('../../../configuracion/bd');

// Listar todos los usuarios agrupados por negocio
const listarUsuariosPorNegocio = async (req, res) => {
    try {
        const query = `
            SELECT 
                n.id_negocio,
                n.nombre AS nombre_negocio,
                json_agg(
                    json_build_object(
                        'id_usuario', u.id_usuario,
                        'nombre', u.nombre,
                        'correo', u.correo,
                        'activo', u.activo,
                        'rol', u.rol,
                        'telefono', u.telefono
                    )
                ) AS usuarios
            FROM Negocios n
            LEFT JOIN Usuarios u ON n.id_negocio = u.pertenece_negocio
            WHERE n.activo = TRUE
            GROUP BY n.id_negocio, n.nombre
            ORDER BY n.nombre;
        `;

        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron negocios con usuarios' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al listar usuarios por negocio:', error);
        res.status(500).json({ error: 'Error al listar usuarios por negocio', message: error.message });
    }
};

module.exports = { listarUsuariosPorNegocio };