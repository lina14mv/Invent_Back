const express = require('express');
const { editarEmpresa } = require('../../controladores/Administradores/editarNegocio');

const router = express.Router();

// Ruta para editar una empresa
router.put('/:id_negocio/editarE', editarEmpresa);

module.exports = router;