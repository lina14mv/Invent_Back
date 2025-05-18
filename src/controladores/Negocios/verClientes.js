const { pool } = require('../../../configuracion/bd');

const verClientes = async (req, res) => {
    const { id_negocio } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM Clientes WHERE id_negocio = $1',
            [id_negocio]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
};

module.exports = verClientes;