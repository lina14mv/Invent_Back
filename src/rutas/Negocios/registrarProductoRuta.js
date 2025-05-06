const express = require('express');
const { registrarProducto } = require('../../controladores/Negocios/registrarProducto');

const router = express.Router();

// Ruta para registrar un producto
router.post('/registrarProductos', registrarProducto);

module.exports = router;