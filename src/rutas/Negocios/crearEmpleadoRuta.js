const express = require('express');
const router = express.Router();
const crearEmpleado  = require('../../controladores/Negocios/crearEmpleado');

router.post('/crear-empleado', crearEmpleado);

module.exports = router;