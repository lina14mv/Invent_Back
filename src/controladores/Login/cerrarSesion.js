const { pool } = require('../../../configuracion/bd');

const cerrarSesion = async (req, res) => {
    const { correo, tipo } = req.body;

    try {
        let tableName, idField;
        if (tipo === 'usuario') {
            tableName = 'Usuarios';
            idField = 'correo';
        } else if (tipo === 'negocio') {
            tableName = 'Negocios';
            idField = 'correo';
        } else if (tipo === 'administrador') {
            tableName = 'Administradores';
            idField = 'correo';
        } else {
            return res.status(400).json({ error: 'Tipo de usuario no válido' });
        }

        await pool.query(`UPDATE ${tableName} SET codigo_sesion = NULL WHERE ${idField} = $1`, [correo]);

    
        res.status(200).json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ error: 'Error al cerrar sesión' });
    }
};

module.exports = { cerrarSesion };