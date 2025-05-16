const {pool} = require('../../../configuracion/bd');

const editarEmpleado = async (req, res) => {
    const {id_usuario} = req.params; // ID del empleado a editar
    const {
        nombre,
        telefono,
        correo,
        direccion,
        rol,
        cedula,
        activo,
    } = req.body;

    try {
        if (!id_usuario) {
            return res.status(400).json({error: 'El ID del empleado es obligatorio'});
        }

        // Construir la consulta SQL dinámicamente
        const fieldsToUpdate = [];
        const values = [];
        let query = 'UPDATE Usuarios SET ';
        if (nombre) {
            fieldsToUpdate.push('nombre = $' + (fieldsToUpdate.length + 1));
            values.push(nombre);
        }
        if (telefono) {
            fieldsToUpdate.push('telefono = $' + (fieldsToUpdate.length + 1));
            values.push(telefono);
        }
        if (correo) {
            fieldsToUpdate.push('correo = $' + (fieldsToUpdate.length + 1));
            values.push(correo);
        }
        if (direccion) {
            fieldsToUpdate.push('direccion = $' + (fieldsToUpdate.length + 1));
            values.push(direccion);
        }
        if (rol) {
            fieldsToUpdate.push('rol = $' + (fieldsToUpdate.length + 1));
            values.push(rol);
        }
        if (cedula) {
            fieldsToUpdate.push('cedula = $' + (fieldsToUpdate.length + 1));
            values.push(cedula);
        }
        if (activo !== undefined) {
            fieldsToUpdate.push('activo = $' + (fieldsToUpdate.length + 1));
            values.push(activo);
        }
        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({error: 'No se proporcionaron campos para actualizar'});
        }
        query += fieldsToUpdate.join(', ') + ' WHERE id_usuario = $' + (fieldsToUpdate.length + 1);
        values.push(id_usuario);
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({error: 'Empleado no encontrado'});
        }

        res.status(200).json({message: 'Empleado actualizado correctamente'});
        
    } catch (error) {
        console.error('Error al editar el empleado:', error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
};
module.exports = editarEmpleado;