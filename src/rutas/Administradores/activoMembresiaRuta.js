const express = require('express');
const actualizarEstadoTodosNegociosPorMembresia = require('../../controladores/Administradores/activoMembresia');
const router = express.Router();

router.post('/actualizar-activo-negocios', actualizarEstadoTodosNegociosPorMembresia);

module.exports = router;