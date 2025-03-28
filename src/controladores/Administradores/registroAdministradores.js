const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const registrarAdministrador = async (req, res) => {
  const { nombre, nombre_usuario, contrasena, rol, correo } = req.body;

  try {
    // Verificar si el nombre de usuario ya existe
    const usuarioExistente = await pool.query('SELECT * FROM Administradores WHERE nombre_usuario = $1', [nombre_usuario]);
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar el nuevo administrador en la base de datos
    const result = await pool.query(
      `INSERT INTO Administradores (nombre, nombre_usuario, contrasena, rol, correo) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id_admin`,
      [nombre, nombre_usuario, hashedPassword, rol, correo || 'soporte']
    );

    const id_admin = result.rows[0].id_admin;

    res.status(201).json({ message: 'Administrador registrado exitosamente', id_admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el administrador' });
  }
};

module.exports = { registrarAdministrador };