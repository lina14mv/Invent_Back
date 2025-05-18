const express = require('express');
const verVentas = require('../../controladores/Negocios/verVentas');
const router = express.Router();

router.get('/ventas/:id_negocio', verVentas);

module.exports = router;