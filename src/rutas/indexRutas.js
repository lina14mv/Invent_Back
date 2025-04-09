const express = require('express');
const router = express.Router();

//Importar Rutas
const registroNegocios = require('./Negocios/registroNegociosRuta');
const login= require('./Login/loginRuta');
const validarCodigoLogin = require('./Login/validarCodigoLoginRuta');
const cambioContrasena = require('./Login/cambioContrasenaRuta');
const registroAdministradores = require('./Administradores/registroAdministradoresRuta');
const validacionCambioContrasena = require('./Login/validacionCambioContrasenaRuta');
const paraContactar = require('./Administradores/paraContactarRuta');
const inicioAdmin = require('./Administradores/inicioAdminRuja');
const crearEmpleado = require('./Negocios/crearEmpleadoRuta');
const crearTickets = require('./Negocios/crearTicketsRuta');
const verTickets = require('./Administradores/verTicketsRuta');
const actualizarTicket = require('./Administradores/actualizarTicketRuta');

router.use("/negocios", registroNegocios);
router.use("/api", login);
router.use("/api", validarCodigoLogin);
router.use("/api", cambioContrasena);
router.use("/administradores", registroAdministradores);
router.use("/api", validacionCambioContrasena);
router.use("/api", paraContactar);
router.use("/api", inicioAdmin);
router.use("/api", crearEmpleado);
router.use("/api", crearTickets);
router.use("/api", verTickets);
router.use("/api", actualizarTicket);

module.exports = router;