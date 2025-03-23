const express = require('express');
const { validarCodigoSesion } = require('../../src/middlewares/validacionLogin');

const router = express.Router();

router.post('/validar-codigo', validarCodigoSesion);

module.exports = router;