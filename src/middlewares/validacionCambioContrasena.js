const { pool } = require('../../configuracion/bd');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Enviar código de recuperación al correo
const enviarCodigoRecuperacion = async (req, res) => {
  const { correo, tipo } = req.body;

  try {
    const tableName = tipo === 'usuario' ? 'Usuarios' : tipo === 'negocio' ? 'Negocios' : 'Administradores';
    const idField = tipo === 'usuario' ? 'id_usuario' : tipo === 'negocio' ? 'id_negocio' : 'id_admin';

    const result = await pool.query(`SELECT ${idField} FROM ${tableName} WHERE correo = $1`, [correo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'El correo no está registrado en el sistema' });
    }

    const usuario = result.rows[0];
    const codigoRecuperacion = Math.random().toString(36).slice(-8);

    await pool.query(`UPDATE ${tableName} SET codigo_recuperacion = $1 WHERE ${idField} = $2`, [
      codigoRecuperacion,
      usuario[idField]
    ]);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Código para cambio de contraseña',
      html: `
        <div style="text-align: center;">
        <img src="https://res.cloudinary.com/deucbjygt/image/upload/v1742666709/Invent_vgeqm2.gif" alt="Logo" style="width: 200px; height: auto;">
          <h1>Código para cambio de contraseña</h1>
          <p>Su código de recuperación es: <strong>${codigoRecuperacion}</strong></p>
          <p>Utilice este código para cambiar su contraseña.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Código de recuperación enviado al correo electrónico' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar el código de recuperación' });
  }
};

// Verificar el código de recuperación
const verificarCodigoRecuperacion = async (req, res) => {
  const { correo, tipo, codigo } = req.body;

  try {
    const tableName = tipo === 'usuario' ? 'Usuarios' : tipo === 'negocio' ? 'Negocios' : 'Administradores';

    const result = await pool.query(
      `SELECT codigo_recuperacion FROM ${tableName} WHERE correo = $1 AND codigo_recuperacion = $2`,
      [correo, codigo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'El código de recuperación es incorrecto o ha expirado' });
    }

    res.status(200).json({ message: 'Código de recuperación válido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar el código de recuperación' });
  }
};

module.exports = { enviarCodigoRecuperacion, verificarCodigoRecuperacion };