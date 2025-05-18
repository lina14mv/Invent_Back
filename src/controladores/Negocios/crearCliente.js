const { pool } = require('../../../configuracion/bd');

const crearCliente = async (req, res) => {
    const { nombre, correo, telefono, direccion, tipo_cliente, id, tipo } = req.body;

    try {
        let id_negocio;

        if (tipo === 'negocio') {
            // El id recibido es el id_negocio
            id_negocio = id;
        } else if (tipo === 'usuario') {
            // Buscar el negocio al que pertenece el usuario
            const result = await pool.query(
                'SELECT pertenece_negocio FROM Usuarios WHERE id_usuario = $1',
                [id]
            );
            if (result.rows.length === 0 || !result.rows[0].pertenece_negocio) {
                return res.status(400).json({ error: 'El usuario no está asociado a ningún negocio' });
            }
            id_negocio = result.rows[0].pertenece_negocio;
        } else {
            return res.status(400).json({ error: 'Tipo no válido' });
        }

        // Insertar el cliente
        const insertQuery = `
            INSERT INTO Clientes (nombre, correo, telefono, direccion, id_negocio, tipo_cliente)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [nombre, correo, telefono, direccion, id_negocio, tipo_cliente || 'minorista'];

        const insertResult = await pool.query(insertQuery, values);

        res.status(201).json({
            message: 'Cliente creado correctamente',
            cliente: insertResult.rows[0]
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ error: 'Error al crear cliente' });
    }
};

module.exports = { crearCliente };