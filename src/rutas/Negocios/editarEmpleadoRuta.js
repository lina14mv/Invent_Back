const express = require('express');
const editarEmpleado  = require('../../controladores/Negocios/editarEmpleado');

const router = express.Router();

router.put('/editarEmpleado/:id_empleado', editarEmpleado);

module.exports = router;