const express = require('express');
const { cerrarSesion } = require('../../controladores/Login/cerrarSesion');
const router = express.Router();

router.post('/cerrarSesion', cerrarSesion);

module.exports = router;