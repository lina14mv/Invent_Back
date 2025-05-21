const { pool } = require("../../../configuracion/bd");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const registrarTicket = async (req, res) => {
  const { tipo, id_usuario, id_negocio, asunto, descripcion } = req.body;

  try {
    let correo_destino = "";
    let nombre_destino = "";

    if (tipo === "usuario") {
      // Obtener el correo y nombre del usuario
      const userResult = await pool.query(
        "SELECT correo, nombre FROM Usuarios WHERE id_usuario = $1",
        [id_usuario]
      );
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      correo_destino = userResult.rows[0].correo;
      nombre_destino = userResult.rows[0].nombre;
    } else if (tipo === "negocio") {
      // Obtener el correo y nombre del negocio
      const negocioResult = await pool.query(
        "SELECT correo, nombre FROM Negocios WHERE id_negocio = $1",
        [id_negocio]
      );
      if (negocioResult.rows.length === 0) {
        return res.status(404).json({ error: "Negocio no encontrado" });
      }
      correo_destino = negocioResult.rows[0].correo;
      nombre_destino = negocioResult.rows[0].nombre;
    } else {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    // Insertar ticket en la base de datos
    const ticketResult = await pool.query(
      `INSERT INTO Tickets (id_usuario, id_negocio, asunto, descripcion) VALUES ($1, $2, $3, $4) RETURNING id_ticket`,
      [id_usuario || null, id_negocio, asunto, descripcion]
    );
    const id_ticket = ticketResult.rows[0].id_ticket;

    // Enviar correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo_destino,
      subject: "Ticket Registrado",
      html: `
        <div style="font-family: Arial, sans-serif; color: #000; text-align: center; padding: 10px;">
            <img src="https://res.cloudinary.com/deucbjygt/image/upload/v1742666709/Invent_vgeqm2.gif" alt="Logo" style="width: 200px; height: auto">
            <h1 style="margin-bottom: 10px; color: #000;">Ticket Registrado</h1>
            <div style="text-align: left; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; padding: 15px; color: #000;">
                <p style="margin-bottom: 5px; color: #000;">Hola <strong style="color: #000;">${nombre_destino}</strong>,</p>
                <p style="margin-bottom: 5px; color: #000;">Tu ticket ha sido registrado con éxito.</p>
                <p style="margin-bottom: 5px; color: #000;"><strong style="color: #000;">ID del ticket:</strong> ${id_ticket}</p>
                <p style="margin-bottom: 5px; color: #000;"><strong style="color: #000;">Asunto:</strong> ${asunto}</p>
                <p style="margin-bottom: 5px; color: #000;"><strong style="color: #000;">Descripción:</strong> ${descripcion}</p>
                <p style="margin: 5px 0; color: #000;">Nuestro equipo dará solución a este lo más pronto posible.</p>
                <p style="margin-bottom: 5px; color: #000;">Atentamente,</p>
                <p style="margin: 0; color: #000;">Soporte Técnico</p>
            </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "Ticket registrado exitosamente", id_ticket });
  } catch (error) {
    console.error("Error al registrar el ticket:", error);
    res.status(500).json({ error: "Error al registrar el ticket" });
  }
};

module.exports = registrarTicket;
