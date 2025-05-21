const { pool } = require('../../../configuracion/bd');

const crearMembresia = async (req, res) => {
    const { id_negocio, meses } = req.body;

    if (!id_negocio || !meses) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        // Calcular fechas
        const result = await pool.query(
            `INSERT INTO Membresias (id_negocio, fecha_inicio, fecha_fin)
             VALUES ($1, CURRENT_DATE, CURRENT_DATE + ($2 || ' month')::interval)
             RETURNING fecha_fin`,
            [id_negocio, meses]
        );

        // Obtener el nombre del negocio
        const negocioResult = await pool.query(
            'SELECT nombre FROM Negocios WHERE id_negocio = $1',
            [id_negocio]
        );

        if (negocioResult.rows.length === 0) {
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }

        res.status(201).json({
            nombre_negocio: negocioResult.rows[0].nombre,
            fecha_fin: result.rows[0].fecha_fin
        });
    } catch (error) {
        console.error('Error al crear membresía:', error);
        res.status(500).json({ error: 'Error al crear membresía' });
    }
};

module.exports = crearMembresia;