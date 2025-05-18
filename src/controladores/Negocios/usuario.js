const {pool} = require('../../../configuracion/bd');

const datosUsuario = async (req, res) => {
    const {id_usuario} = req.params; // ID del usuario a obtener
    try {
        const result = await pool.query('SELECT * FROM Usuarios WHERE id_usuario = $1', [id_usuario]);
        if (result.rowCount === 0) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).json({error: 'Error al obtener datos del usuario'});
    }
}
module.exports = datosUsuario;