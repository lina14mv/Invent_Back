const express = require('express');
const { cambiarContrasena } = require('../../controladores/Login/cambioContrasena');
const verificarToken = require('../../middlewares/verificarToken');

const router = express.Router();

router.put('/cambiar-contrasena', verificarToken, cambiarContrasena);

module.exports = router;