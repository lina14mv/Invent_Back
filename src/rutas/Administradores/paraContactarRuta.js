const express = require('express');
const { registrarContacto, listarContactos, marcarComoContactado } = require('../../controladores/Administradores/paraContactar');

const router = express.Router();

// Ruta para registrar un nuevo contacto
router.post('/paraContactar', registrarContacto);

// Ruta para listar todos los contactos
router.get('/listarContactos', listarContactos);

router.post('/contactado', marcarComoContactado);

module.exports = router;