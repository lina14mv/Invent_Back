const express = require('express');
const { aumentarStock, disminuirStock, editarProducto } = require('../../controladores/Negocios/inventario');
const router = express.Router();

// Ruta para aumentar stock de un producto
router.patch('/productos/:id_producto/aumentar', aumentarStock);

// Ruta para disminuir stock de un producto
router.patch('/productos/:id_producto/disminuir', disminuirStock);

// Ruta para editar un producto
router.put('/productos/:id_producto', editarProducto);

module.exports = router;