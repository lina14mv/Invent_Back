const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const actualizarTicket = async (req, res) => {
    const { id_ticket, nuevo_estado } = req.body;

    try {
        // Actualizar el estado del ticket
        const ticketResult = await pool.query(
            `UPDATE Tickets SET estado = $1 WHERE id_ticket = $2 RETURNING id_usuario, asunto, descripcion`,
            [nuevo_estado, id_ticket]
        );

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
                    <p><strong>Nuevo estado:</strong> ${nuevo_estado}</p>
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