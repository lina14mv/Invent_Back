const { pool } = require('../../../configuracion/bd');

const editarEmpresa = async (req, res) => {
    const { id_negocio } = req.params; // ID del negocio a editar
    const {
        nombre,
        nit,
        direccion,
        telefono,
        correo,
        tipo_negocio,
        nombre_dueno,
        ubicacion_ciudad,
        cedula_dueno,
        fondo,
        color_primario,
        color_secundario
    } = req.body;

    try {
        // Validar que se haya proporcionado el ID del negocio
        if (!id_negocio) {
            return res.status(400).json({ error: 'El ID del negocio es obligatorio' });
        }

        // Construir la consulta SQL dinámicamente
        const fieldsToUpdate = [];
        const values = [];
        let query = 'UPDATE Negocios SET ';

        if (nombre) {
            fieldsToUpdate.push('nombre = $' + (fieldsToUpdate.length + 1));
            values.push(nombre);
        }
        if (nit) {
            fieldsToUpdate.push('nit = $' + (fieldsToUpdate.length + 1));
            values.push(nit);
        }
        if (direccion) {
            fieldsToUpdate.push('direccion = $' + (fieldsToUpdate.length + 1));
            values.push(direccion);
        }
        if (telefono) {
            fieldsToUpdate.push('telefono = $' + (fieldsToUpdate.length + 1));
            values.push(telefono);
        }
        if (correo) {
            fieldsToUpdate.push('correo = $' + (fieldsToUpdate.length + 1));
            values.push(correo);
        }
        if (tipo_negocio) {
            fieldsToUpdate.push('tipo_negocio = $' + (fieldsToUpdate.length + 1));
            values.push(tipo_negocio);
        }
        if (nombre_dueno) {
            fieldsToUpdate.push('nombre_dueno = $' + (fieldsToUpdate.length + 1));
            values.push(nombre_dueno);
        }
        if (ubicacion_ciudad) {
            fieldsToUpdate.push('ubicacion_ciudad = $' + (fieldsToUpdate.length + 1));
            values.push(ubicacion_ciudad);
        }
        if (cedula_dueno) {
            fieldsToUpdate.push('cedula_dueno = $' + (fieldsToUpdate.length + 1));
            values.push(cedula_dueno);
        }
        if (fondo) {
            fieldsToUpdate.push('fondo = $' + (fieldsToUpdate.length + 1));
            values.push(fondo);
        }
        if (color_primario) {
            fieldsToUpdate.push('color_primario = $' + (fieldsToUpdate.length + 1));
            values.push(color_primario);
        }
        if (color_secundario) {
            fieldsToUpdate.push('color_secundario = $' + (fieldsToUpdate.length + 1));
            values.push(color_secundario);  
        }

        // Si no se envió ningún campo para actualizar
        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
        }

        // Completar la consulta SQL
        query += fieldsToUpdate.join(', ') + ' WHERE id_negocio = $' + (fieldsToUpdate.length + 1) + ' RETURNING *';
        values.push(id_negocio);

        // Ejecutar la consulta
        const result = await pool.query(query, values);

        // Verificar si el negocio fue encontrado y actualizado
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }

        res.status(200).json({
            message: 'Negocio actualizado correctamente',
            negocio: result.rows[0]
        });
    } catch (error) {
        console.error('Error al editar el negocio:', error);
        res.status(500).json({ error: 'Error al editar el negocio' });
    }
};

module.exports = { editarEmpresa };