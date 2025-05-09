const express = require('express');
const { activarNegocio } = require('../../controladores/Administradores/activarNegocio');

const router = express.Router();

// Ruta para desactivar un negocio
router.put('/:id_negocio/activarN', activarNegocio);

module.exports = router;