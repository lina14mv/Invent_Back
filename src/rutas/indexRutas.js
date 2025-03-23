const express = require('express');
const router = express.Router();

//Importar Rutas
const registroEmpresa = require('./Empresas/registroRuta');
const loginEmpresa = require('./Empresas/loginRuta');
const validarCodigoLogin = require('./validarCodigoLoginRuta');

router.use("/empresa", registroEmpresa);
router.use("/empresa", loginEmpresa);
router.use("/empresa", validarCodigoLogin);

module.exports = router;