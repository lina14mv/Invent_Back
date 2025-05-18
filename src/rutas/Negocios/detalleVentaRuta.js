const express = require('express');
const detalleVenta = require('../../controladores/Negocios/detalleVenta');
const router = express.Router();

router.get('/detalle-venta/:id_venta', detalleVenta);

module.exports = router;