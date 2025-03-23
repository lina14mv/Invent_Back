const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const generarToken = (usuario) => {
  const payload = {
    id_usuario: usuario.id_usuario,
    correo: usuario.correo,
    rol: usuario.rol
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const validarCodigoSesion = async (req, res) => {
  const { correo, codigoSesion } = req.body;

  try {
    // Verificar si el código de sesión es correcto
    const userResult = await pool.query('SELECT * FROM Usuarios WHERE correo = $1 AND codigo_sesion = $2', [correo, codigoSesion]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Código de sesión incorrecto' });
    }

    const usuario = userResult.rows[0];

    // Generar token JWT
    const token = generarToken(usuario);

    res.status(200).json({ message: 'Código de sesión válido', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al validar el código de sesión' });
  }
};

module.exports = { validarCodigoSesion };