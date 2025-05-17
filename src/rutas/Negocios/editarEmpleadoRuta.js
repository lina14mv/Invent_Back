const express = require('express');
const editarEmpleado  = require('../../controladores/Negocios/editarEmpleado');

const router = express.Router();

router.put('/editarEmpleado/:id_usuario', editarEmpleado);

module.exports = router;