const { pool } = require('../../../configuracion/bd');

const verEmpleados = async (req, res) => {
    try {
        const { id_negocio } = req.params;

        // Verificar si el ID del negocio es válido
        if (!id_negocio) {
            return res.status(400).json({ error: 'El ID del negocio es obligatorio' });
        }

        // Consultar los empleados del negocio
        const query = `
            SELECT e.id_usuario, e.nombre, e.correo, e.telefono, e.activo, e.rol, e.cedula
            FROM Usuarios e
            WHERE e.pertenece_negocio = $1
        `;
        const result = await pool.query(query, [id_negocio]);

        // Verificar si se encontraron empleados
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron empleados para este negocio' });
        }

        // Devolver la lista de empleados
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}
module.exports = verEmpleados;