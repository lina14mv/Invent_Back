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

const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Verificar si el correo pertenece a un usuario
    let userResult = await pool.query('SELECT * FROM Usuarios WHERE correo = $1', [correo]);
    let tipo = 'usuario';

    // Si no se encuentra en Usuarios, buscar en Negocios
    if (userResult.rows.length === 0) {
      userResult = await pool.query('SELECT * FROM Negocios WHERE correo = $1', [correo]);
      tipo = 'negocio';
    }

    // Si no se encuentra en Negocios, buscar en Administradores
    if (userResult.rows.length === 0) {
      userResult = await pool.query('SELECT * FROM Administradores WHERE correo= $1', [correo]);
      tipo = 'administrador';
    }

    // Si no se encuentra en ninguna tabla, retornar error
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const usuario = userResult.rows[0];

    // Verificar si la contraseña almacenada es válida
    if (!usuario.contrasena) {
      return res.status(500).json({ error: 'El usuario no tiene una contraseña válida en el sistema' });
    }
    // Verificar la contraseña
    const validPassword = await bcrypt.compare(contraseña, usuario.contrasena);
    if (!validPassword) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Generar código de sesión
    const codigoSesion = Math.random().toString(36).slice(-8);
    const tableName = tipo === 'usuario' ? 'Usuarios' : tipo === 'negocio' ? 'Negocios' : 'Administradores';
    const idField = tipo === 'usuario' ? 'id_usuario' : tipo === 'negocio' ? 'id_negocio' : 'id_admin';

    await pool.query(`UPDATE ${tableName} SET codigo_sesion = $1 WHERE ${idField} = $2`, [codigoSesion, usuario[idField]]);

    // Enviar correo electrónico con el código de sesión
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Código de inicio de sesión',
      html: `
        <div style="text-align: center;">
          <h1>Código de inicio de sesión</h1>
          <p>Su código de inicio de sesión es <strong>${codigoSesion}</strong>.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Código de inicio de sesión enviado a su correo electrónico', tipo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { login };