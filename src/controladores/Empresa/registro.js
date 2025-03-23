const { Pool } = require('pg');
const bcrypt = require('bcrypt');
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

const registrarEmpresa = async (req, res) => {
  const { nombre, nit, direccion, telefono, correo } = req.body;

  try {
    // Insertar empresa en la base de datos
    const empresaResult = await pool.query(
      'INSERT INTO Empresas (nombre, nit, direccion, telefono) VALUES ($1, $2, $3, $4) RETURNING id_empresa',
      [nombre, nit, direccion, telefono]
    );
    const id_empresa = empresaResult.rows[0].id_empresa;

    // Generar contraseña temporal
    const contraseñaTemporal = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(contraseñaTemporal, 10);

    // Insertar usuario en la base de datos
    await pool.query(
      'INSERT INTO Usuarios (nombre, correo, cedula, contraseña, rol) VALUES ($1, $2, $3, $4, $5)',
      [nombre, correo, nit, hashedPassword, 'dueño']
    );

    // Enviar correo electrónico con la contraseña temporal
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: correo,
        subject: 'Registro de Empresa',
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

    res.status(201).json({ message: 'Empresa registrada y correo enviado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la empresa.' });
  }
};

module.exports = { registrarEmpresa };