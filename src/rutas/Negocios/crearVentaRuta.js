const express = require('express');
const { crearVenta } = require('../../controladores/Negocios/crearVenta');
const router = express.Router();

router.post('/crear-venta', crearVenta);

module.exports = router;