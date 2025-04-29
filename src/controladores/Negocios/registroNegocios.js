const { pool } = require('../../../configuracion/bd');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const registrarNegocio = async (req, res) => {
  const {
    nombre,
    nit,
    direccion,
    telefono,
    correo,
    tipo_negocio,
    nombre_dueno,
    cedula_dueno,
    id_admin
  } = req.body; // Asegúrate de recibir todos los campos necesarios

  try {
    // Generar contraseña temporal para el dueño del negocio
    const contraseñaTemporal = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(contraseñaTemporal, 10);

    // Insertar negocio en la base de datos
    const negocioResult = await pool.query(
      `INSERT INTO Negocios (
        nombre, nit, direccion, telefono, correo, tipo_negocio, 
        nombre_dueno, cedula_dueno, contrasena, debe_cambiar_contrasena, 
        creado_por
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id_negocio`,
      [
        nombre,
        nit,
        direccion,
        telefono,
        correo,
        tipo_negocio,
        nombre_dueno,
        cedula_dueno,
        hashedPassword,
        true, // debe_cambiar_contrasena
        id_admin
      ]
    );
    const id_negocio = negocioResult.rows[0].id_negocio;

    // Enviar correo electrónico con la contraseña temporal
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Registro de Negocio',
      html: `
        <div style="text-align: center;">
          <img src="https://res.cloudinary.com/deucbjygt/image/upload/v1742666709/Invent_vgeqm2.gif" alt="Logo" style="width: 200px; height: auto;">
          <h1>Bienvenido a nuestro sistema</h1>
          <p>Su usuario es <strong>${correo}</strong> y su contraseña temporal es <strong>${contraseñaTemporal}</strong>.</p>
          <p>Por favor, cambie su contraseña después de iniciar sesión por primera vez.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Negocio registrado y correo enviado.',
      id_negocio
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el negocio.' });
  }
};

module.exports = { registrarNegocio };