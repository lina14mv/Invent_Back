const express = require('express');
const router = express.Router();

//Importar Rutas
const registroNegocios = require('./Negocios/registroNegociosRuta');
const login= require('./Login/loginRuta');
const validarCodigoLogin = require('./Login/validarCodigoLoginRuta');
const cambioContrasena = require('./Login/cambioContrasenaRuta');
const registroAdministradores = require('./Administradores/registroAdministradoresRuta');
const validacionCambioContrasena = require('./Login/validacionCambioContrasenaRuta');

router.use("/negocios", registroNegocios);
router.use("/api", login);
router.use("/api", validarCodigoLogin);
router.use("/api", cambioContrasena);
router.use("/administradores", registroAdministradores);
router.use("/api", validacionCambioContrasena);

module.exports = router;