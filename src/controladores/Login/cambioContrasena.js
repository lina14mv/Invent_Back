const bcrypt = require('bcrypt');
const { pool } = require('../../../configuracion/bd');

const cambiarContrasena = async (req, res) => {
  const { correo, nuevaContrasena } = req.body;

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
      userResult = await pool.query('SELECT * FROM Administradores WHERE correo = $1', [correo]);
      tipo = 'administrador';
    }

    // Si no se encuentra en ninguna tabla, retornar error
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'El correo no está registrado en el sistema' });
    }

    const usuario = userResult.rows[0];

    // Cifrar la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    // Actualizar la contraseña en la tabla correspondiente
    const tableName = tipo === 'usuario' ? 'Usuarios' : tipo === 'negocio' ? 'Negocios' : 'Administradores';
    const idField = tipo === 'usuario' ? 'id_usuario' : tipo === 'negocio' ? 'id_negocio' : 'id_admin';

    await pool.query(`UPDATE ${tableName} SET contrasena = $1, debe_cambiar_contrasena = $2 WHERE ${idField} = $3`, [
      hashedPassword,
      false, // debe_cambiar_contrasena se establece en false
      usuario[idField]
    ]);

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
};

module.exports = { cambiarContrasena };