const express = require('express');
const { registrarAdministrador } = require('../../controladores/Administradores/registroAdministradores');

const router = express.Router();

router.post('/registrar', registrarAdministrador);

module.exports = router;