const { pool } = require('../../../configuracion/bd');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const actualizarTicket = async (req, res) => {
    const { id_ticket, nuevo_estado, nueva_prioridad } = req.body;

    try {
        // Construir la consulta SQL dinámicamente
        const fieldsToUpdate = [];
        const values = [];
        let query = 'UPDATE Tickets SET ';

        if (nuevo_estado) {
            fieldsToUpdate.push('estado = $' + (fieldsToUpdate.length + 1));
            values.push(nuevo_estado);
        }

        if (nueva_prioridad) {
            fieldsToUpdate.push('prioridad = $' + (fieldsToUpdate.length + 1));
            values.push(nueva_prioridad);
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
        }

        query += fieldsToUpdate.join(', ') + ' WHERE id_ticket = $' + (fieldsToUpdate.length + 1) + ' RETURNING id_usuario, asunto, descripcion';
        values.push(id_ticket);

        // Ejecutar la consulta
        const ticketResult = await pool.query(query, values);

        if (ticketResult.rows.length === 0) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }

        const { id_usuario, asunto, descripcion } = ticketResult.rows[0];

        // Obtener el correo y nombre del usuario
        const userResult = await pool.query(
            `SELECT correo, nombre FROM Usuarios WHERE id_usuario = $1`,
            [id_usuario]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const correo_usuario = userResult.rows[0].correo;
        const nombre_usuario = userResult.rows[0].nombre;

        // Enviar correo electrónico al usuario
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: correo_usuario,
            subject: 'Actualización de Estado del Ticket',
            html: `
                <div style="font-family: Arial, sans-serif; color: #000; text-align: center; padding: 20px;">
                    <h1 style="margin-bottom: 20px;">Estado del Ticket Actualizado</h1>
                    <p>Hola <strong>${nombre_usuario}</strong>,</p>
                    <p>El estado de tu ticket ha cambiado.</p>
                    <p><strong>ID del ticket:</strong> ${id_ticket}</p>
                    <p><strong>Asunto:</strong> ${asunto}</p>
                    <p><strong>Descripción:</strong> ${descripcion}</p>
                    ${nuevo_estado ? `<p><strong>Nuevo estado:</strong> ${nuevo_estado}</p>` : ''}
                    ${nueva_prioridad ? `<p><strong>Prioridad:</strong> ${nueva_prioridad}</p>` : ''}
                    <p>Gracias por tu paciencia.</p>
                    <p>Atentamente,</p>
                    <p>Soporte Técnico</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Estado del ticket actualizado y correo enviado' });
    } catch (error) {
        console.error('Error al actualizar el ticket:', error);
        res.status(500).json({ error: 'Error al actualizar el ticket' });
    }
};

module.exports = actualizarTicket;