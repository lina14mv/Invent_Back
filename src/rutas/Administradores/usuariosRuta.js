const express = require('express');
const { listarUsuariosPorNegocio } = require('../../controladores/Administradores/usuarios');

const router = express.Router();

// Ruta para listar usuarios agrupados por negocio
router.get('/por-negocio', listarUsuariosPorNegocio);

module.exports = router;