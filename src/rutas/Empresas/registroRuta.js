const express = require('express');
const router = express.Router();
const {registrarEmpresa}  = require('../../controladores/Empresa/registro');


router.post('/registrar', registrarEmpresa);

module.exports = router;