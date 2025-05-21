const express = require('express');
const { cerrarSesion } = require('../../controladores/Login/cerrarSesion');
const verificarToken = require('../../middlewares/verificarToken');
const router = express.Router();

router.post('/cerrarSesion',verificarToken, cerrarSesion);

module.exports = router;