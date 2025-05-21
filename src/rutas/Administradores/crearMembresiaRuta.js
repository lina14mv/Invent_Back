const express = require('express');
const crearMembresia = require('../../controladores/Administradores/crearMembresia');
const router = express.Router();

router.post('/crear-membresia', crearMembresia);

module.exports = router;