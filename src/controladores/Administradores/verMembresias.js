const { pool } = require('../../../configuracion/bd');

const verMembresias = async (req, res) => {
    try {
        // Calcular meses pagados como la diferencia en meses entre fecha_inicio y fecha_fin
        const membresiasResult = await pool.query(
            `SELECT 
                m.id_membresia, 
                m.fecha_inicio, 
                m.fecha_fin, 
                m.id_negocio, 
                n.nombre AS nombre_negocio,
                (EXTRACT(YEAR FROM m.fecha_fin) - EXTRACT(YEAR FROM m.fecha_inicio)) * 12 +
                 (EXTRACT(MONTH FROM m.fecha_fin) - EXTRACT(MONTH FROM m.fecha_inicio)) AS meses_pagados
            FROM Membresias m
            JOIN Negocios n ON m.id_negocio = n.id_negocio
            ORDER BY m.fecha_inicio DESC`
        );

        res.status(200).json({
            membresias: membresiasResult.rows
        });
    } catch (error) {
        console.error('Error al obtener membresías:', error);
        res.status(500).json({ error: 'Error al obtener membresías' });
    }
};

module.exports = verMembresias;