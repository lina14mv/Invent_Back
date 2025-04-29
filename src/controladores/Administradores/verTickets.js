const { pool } = require('../../../configuracion/bd');

const verTickets = async (req, res) => {
    try {
        // Consulta para obtener los tickets con información adicional
        const result = await pool.query(`
            SELECT 
                t.id_ticket,
                t.asunto,
                t.descripcion,
                t.estado,
                t.prioridad,
                t.fecha_creacion,
                u.nombre AS nombre_usuario,
                u.correo AS correo_usuario,
                n.nombre AS nombre_negocio
            FROM Tickets t
            LEFT JOIN Usuarios u ON t.id_usuario = u.id_usuario
            LEFT JOIN Negocios n ON t.id_negocio = n.id_negocio
            ORDER BY t.fecha_creacion DESC
        `);

        // Retornar los tickets obtenidos
        res.status(200).json({
            message: 'Tickets obtenidos exitosamente',
            tickets: result.rows
        });
    } catch (error) {
        console.error('Error al obtener los tickets:', error);
        res.status(500).json({ error: 'Error al obtener los tickets' });
    }
};

module.exports = verTickets;