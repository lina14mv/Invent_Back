const { pool } = require('../../../configuracion/bd');

const renovarMembresia = async (req, res) => {
    const { id_negocio, meses } = req.body;

    if (!id_negocio || !meses) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Registrar el pago
        await client.query(
            'INSERT INTO Pagos (id_negocio, meses) VALUES ($1, $2)',
            [id_negocio, meses]
        );

        // Actualizar la fecha_fin de la membresía sumando los meses
        await client.query(
            `UPDATE Membresias
             SET fecha_fin = 
                CASE 
                    WHEN fecha_fin > CURRENT_DATE 
                        THEN fecha_fin + ($1 || ' month')::interval
                    ELSE CURRENT_DATE + ($1 || ' month')::interval
                END
             WHERE id_negocio = $2`,
            [meses, id_negocio]
        );

        await client.query('COMMIT');
        res.status(200).json({ message: 'Membresía renovada y pago registrado correctamente' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al renovar membresía:', error);
        res.status(500).json({ error: 'Error al renovar membresía' });
    } finally {
        client.release();
    }
};

module.exports = renovarMembresia;