const express = require('express');
const { registrarContacto, listarContactos } = require('../../controladores/Administradores/paraContactar');

const router = express.Router();

// Ruta para registrar un nuevo contacto
router.post('/paraContactar', registrarContacto);

// Ruta para listar todos los contactos
router.get('/listarContactos', listarContactos);

module.exports = router;