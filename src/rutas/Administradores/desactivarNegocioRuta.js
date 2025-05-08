const express = require('express');
const { desactivarNegocio } = require('../../controladores/Administradores/desactivarNegocio');

const router = express.Router();

// Ruta para desactivar un negocio
router.put('/:id_negocio/desactivarN', desactivarNegocio);

module.exports = router;