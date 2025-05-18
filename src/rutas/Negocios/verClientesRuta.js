const express = require('express');
const verClientes = require('../../controladores/Negocios/verClientes');
const router = express.Router();

router.get('/clientes/:id_negocio', verClientes);

module.exports = router;