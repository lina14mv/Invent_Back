const { pool } = require('../../configuracion/bd');
const jwt = require('jsonwebtoken');


const generarToken = (usuario, tipo) => {
  const payload = {
    id: tipo === 'usuario' ? usuario.id_usuario : tipo === 'negocio' ? usuario.id_negocio : usuario.id_admin,
    correo: usuario.correo || usuario.nombre_usuario,
    rol: usuario.rol,
    nombre: usuario.nombre,
    fondo: usuario.fondo,
    color_primario: usuario.color_primario,
    color_secundario: usuario.color_secundario,
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

    // Obtener el nombre según el tipo
    let nombre = usuario.nombre;
    if (tipo === 'negocio' && !nombre) {
      nombre = usuario.nombre_negocio || usuario.nombre; // Ajusta según tu base de datos
    }

    // ...existing code...

    // obtener el fondo y colores según el tipo
    let fondo, color_primario, color_secundario;

    if (tipo === 'negocio') {
      fondo = usuario.fondo || '#5be494';
      color_primario = usuario.color_primario || '#000000';
      color_secundario = usuario.color_secundario || '#f8f8f8';
    } else if (tipo === 'usuario') {
      // Consultar la tabla Negocios para obtener los colores del negocio al que pertenece el usuario
      const negocioResult = await pool.query(
        'SELECT fondo, color_primario, color_secundario FROM Negocios WHERE id_negocio = $1',
        [usuario.pertenece_negocio]
      );
      if (negocioResult.rows.length > 0) {
        const negocio = negocioResult.rows[0];
        fondo = negocio.fondo || '#5be494';
        color_primario = negocio.color_primario || '#000000';
        color_secundario = negocio.color_secundario || '#f8f8f8';
      } else {
        // Valores por defecto si no se encuentra el negocio
        fondo = '#5be494';
        color_primario = '#000000';
        color_secundario = '#f8f8f8';
      }
    } else {
      // Para administradores u otros tipos, puedes definir valores por defecto o personalizados
      fondo = usuario.fondo || '#5be494';
      color_primario = usuario.color_primario || '#000000';
      color_secundario = usuario.color_secundario || '#f8f8f8';
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
      nombre,
      fondo,
      color_primario,
      color_secundario,
      debe_cambiar_contrasena: usuario.debe_cambiar_contrasena || false
    });
    console.log('Ingreso exitoso:', { token, tipo, id, rol, nombre, fondo, color_primario, color_secundario, debe_cambiar_contrasena: usuario.debe_cambiar_contrasena || false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al validar el código de sesión' });
  }
};

module.exports = { validarCodigoSesion };