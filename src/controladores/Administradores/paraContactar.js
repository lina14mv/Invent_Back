const { pool } = require('../../../configuracion/bd');

// Registrar un nuevo contacto
const registrarContacto = async (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO ParaContactar (nombre, correo, telefono, mensaje) 
       VALUES ($1, $2, $3, $4) RETURNING id_contacto`,
      [nombre, correo, telefono, mensaje]
    );

    res.status(201).json({
      message: 'Contacto registrado exitosamente',
      id_contacto: result.rows[0].id_contacto
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el contacto' });
  }
};

// Listar todos los contactos
const listarContactos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ParaContactar ORDER BY fecha DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar los contactos' });
  }
};

module.exports = { registrarContacto, listarContactos };