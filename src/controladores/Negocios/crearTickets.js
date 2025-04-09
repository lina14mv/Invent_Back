const {Pool} = require('pg');
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

const registrarTicket = async (req, res) => {
    const { 
        id_usuario,
        id_negocio,
        asunto, 
        descripcion 
    } = req.body;
    
    try {
         // Obtener el correo del usuario desde la base de datos
         const userResult = await pool.query(
            'SELECT correo, nombre FROM Usuarios WHERE id_usuario = $1',
            [id_usuario]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const correo_usuario = userResult.rows[0].correo;
        const nombre_usuario = userResult.rows[0].nombre;

        // Insertar ticket en la base de datos
        const ticketResult = await pool.query(
            `INSERT INTO Tickets (id_usuario, id_negocio, asunto, descripcion) VALUES ($1, $2, $3, $4) RETURNING id_ticket`,
            [id_usuario, id_negocio, asunto, descripcion]
        );
        const id_ticket = ticketResult.rows[0].id_ticket;

        // Enviar correo electrónico al usuario
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: correo_usuario,
            subject: 'Ticket Registrado',
            html: `
                <div style="text-align: center;">
                <img src="https://res.cloudinary.com/deucbjygt/image/upload/v1742666709/Invent_vgeqm2.gif" alt="Logo" style="width: 200px; height: auto;">
                <h1>Ticket Registrado</h1>
                <div style="text-align: left; margin: 20px;">
                <p>Hola ${nombre_usuario},</p>
                <p>Tu ticket ha sido registrado con éxito.</p>
                <p>ID del ticket: ${id_ticket}</p>
                <p>Asunto: ${asunto}</p>
                <p>Descripción: ${descripcion}</p>
                <p>Nuestro equipo dará solución a este lo más pronto posible.</p>
                <p>Gracias.</p>
                <p>Atentamente,</p>
                <p>Soporte Técnico</p>
                </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({message: 'Ticket registrado exitosamente', id_ticket});
    } catch (error) {
        console.error('Error al registrar el ticket:', error);
        res.status(500).json({error: 'Error al registrar el ticket'});
    }
};  

module.exports = registrarTicket;