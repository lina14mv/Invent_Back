const { pool } = require('../../configuracion/bd');
const jwt = require('jsonwebtoken');


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

    // Validar si el estado activo es false
    if (usuario.activo === false) {
      return res.status(403).json({ error: `El ${tipo} está inactivo. Por favor, contacte al administrador.` });
    }

    // Obtener el ID según el tipo
    const id = tipo === 'usuario' ? usuario.id_usuario : tipo === 'negocio' ? usuario.id_negocio : usuario.id_admin;

    // Obtener el rol según el tipo
    let rol = usuario.rol;
    if (tipo === 'negocio') {
      rol = usuario.tipo_negocio; // Si quieres devolver el tipo de negocio como rol
    }

    // Generar token JWT
    const token = generarToken(usuario, tipo);
    console.log(`ID obtenido (${tipo}):`, id);

    // Responder con el token, tipo de usuario, rol y si necesita cambiar la contraseña
    res.status(200).json({
      message: 'Código de sesión válido',
      token,
      tipo,
      id,
      rol,
      debe_cambiar_contrasena: usuario.debe_cambiar_contrasena || false
    });
    console.log('Ingreso exitoso:', { token, tipo, id, rol, debe_cambiar_contrasena: usuario.debe_cambiar_contrasena || false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al validar el código de sesión' });
  }
};

module.exports = { validarCodigoSesion };