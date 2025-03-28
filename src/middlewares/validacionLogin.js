const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const generarToken = (usuario, tipo) => {
  const payload = {
    id: tipo === 'usuario' ? usuario.id_usuario : tipo === 'negocio' ? usuario.id_negocio : usuario.id_admin,
    correo: usuario.correo || usuario.nombre_usuario,
    rol: usuario.rol || tipo,
    tipo
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const validarCodigoSesion = async (req, res) => {
  const { correo, codigoSesion } = req.body;

  try {
    // Verificar si el código de sesión es correcto en Usuarios
    let userResult = await pool.query('SELECT * FROM Usuarios WHERE correo = $1 AND codigo_sesion = $2', [correo, codigoSesion]);
    let tipo = 'usuario';

    // Si no se encuentra en Usuarios, buscar en Negocios
    if (userResult.rows.length === 0) {
      userResult = await pool.query('SELECT * FROM Negocios WHERE correo = $1 AND codigo_sesion = $2', [correo, codigoSesion]);
      tipo = 'negocio';
    }

    // Si no se encuentra en Negocios, buscar en Administradores
    if (userResult.rows.length === 0) {
      userResult = await pool.query('SELECT * FROM Administradores WHERE correo = $1 AND codigo_sesion = $2', [correo, codigoSesion]);
      tipo = 'administrador';
    }

    // Si no se encuentra en ninguna tabla, retornar error
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Código de sesión incorrecto' });
    }

    const usuario = userResult.rows[0];

    // Generar token JWT
    const token = generarToken(usuario, tipo);

    // Responder con el token, tipo de usuario y si necesita cambiar la contraseña
    res.status(200).json({
      message: 'Código de sesión válido',
      token,
      tipo,
      debe_cambiar_contrasena: usuario.debe_cambiar_contrasena || false // Por defecto, false si no existe el campo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al validar el código de sesión' });
  }
};

module.exports = { validarCodigoSesion };