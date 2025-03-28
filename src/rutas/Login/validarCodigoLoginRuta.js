const express = require('express');
const { validarCodigoSesion } = require('../../middlewares/validacionLogin');

const router = express.Router();

router.post('/validar-codigo', validarCodigoSesion);

module.exports = router;