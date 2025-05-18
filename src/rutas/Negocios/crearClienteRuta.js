const express = require('express');
const { crearCliente } = require('../../controladores/Negocios/crearCliente');
const router = express.Router();

router.post('/crear-cliente', crearCliente);

module.exports = router;