const express = require('express');
const { listarNegocios } = require('../../controladores/Administradores/negocios');

const router = express.Router();

router.get('/negocios', listarNegocios);

module.exports = router;