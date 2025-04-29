const express = require('express');
const { cambiarContrasena } = require('../../controladores/Login/cambioContrasena');

const router = express.Router();

router.put('/cambiar-contrasena', cambiarContrasena);

module.exports = router;