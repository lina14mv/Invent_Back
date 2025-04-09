const express = require('express');
const {
    consultaInicial
} = require('../../controladores/Administradores/inicioAdmin');

const router = express.Router();

// Ruta para realizar todas las consultas y retornar una única respuesta
router.get('/consultaInicial', consultaInicial);

module.exports = router;