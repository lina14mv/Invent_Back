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

const loginEmpresa = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Verificar si el usuario existe
    const userResult = await pool.query('SELECT * FROM Usuarios WHERE correo = $1', [correo]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const usuario = userResult.rows[0];

    // Verificar que la contraseña del usuario esté definida
    if (!usuario.contraseña) {
      return res.status(500).json({ error: 'Error interno del servidor. Contraseña no definida.' });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Generar código de sesión
    const codigoSesion = Math.random().toString(36).slice(-8);
    await pool.query('UPDATE Usuarios SET codigo_sesion = $1 WHERE id_usuario = $2', [codigoSesion, usuario.id_usuario]);

    // Enviar correo electrónico con el código de sesión
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Código de inicio de sesión',
      html: `
        <div style="text-align: center;">
          <img src="https://res.cloudinary.com/deucbjygt/image/upload/v1742666709/Invent_vgeqm2.gif" alt="Logo" style="width: 200px; height: auto;">
          <h1>Código de inicio de sesión</h1>
          <p>Su código de inicio de sesión es <strong>${codigoSesion}</strong>.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Código de inicio de sesión enviado a su correo electrónico' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { loginEmpresa };