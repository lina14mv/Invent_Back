const express = require('express');
const { mostrarProductos } = require('../../controladores/Negocios/mostrarProductos');

const router = express.Router();

// Ruta para mostrar los productos de un negocio
router.get('/:id_negocio', mostrarProductos);

module.exports = router;