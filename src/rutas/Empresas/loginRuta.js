const express = require('express');
const { loginEmpresa } = require('../../controladores/Empresa/login');

const router = express.Router();

router.post('/login', loginEmpresa);

module.exports = router;