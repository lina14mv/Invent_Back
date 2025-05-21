const { pool } = require('../../../configuracion/bd');

const grafica = async (req, res) => {
    try {
        // Membresías: sumar meses * 30000 agrupado por mes de primera_activacion
        const membresiasQuery = `
            SELECT 
                TO_CHAR(primera_activacion, 'YYYY-MM') AS mes,
                SUM(meses) * 30000 AS ganancias
            FROM Membresias
            GROUP BY mes
        `;

        // Pagos: sumar meses * 30000 agrupado por mes de fecha_pago
        const pagosQuery = `
            SELECT 
                TO_CHAR(fecha_pago, 'YYYY-MM') AS mes,
                SUM(meses) * 30000 AS ganancias
            FROM Pagos
            GROUP BY mes
        `;

        const membresiasResult = await pool.query(membresiasQuery);
        const pagosResult = await pool.query(pagosQuery);

        // Unir resultados por mes
        const datos = {};

        // Sumar ganancias de membresías
        for (const row of membresiasResult.rows) {
            datos[row.mes] = (datos[row.mes] || 0) + Number(row.ganancias || 0);
        }

        // Sumar ganancias de pagos
        for (const row of pagosResult.rows) {
            datos[row.mes] = (datos[row.mes] || 0) + Number(row.ganancias || 0);
        }

        // Formatear para la gráfica
        const resultado = Object.entries(datos)
            .map(([mes, ganancias]) => ({ mes, ganancias }))
            .sort((a, b) => a.mes.localeCompare(b.mes));

        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al obtener datos para la gráfica:', error);
        res.status(500).json({ error: 'Error al obtener datos para la gráfica' });
    }
};

module.exports = grafica;