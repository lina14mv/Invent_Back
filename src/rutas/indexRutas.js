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
const listarNegocios = require('./Administradores/negociosRuta');
const listarUsuariosPorNegocio = require('./Administradores/usuariosRuta');
const registrarProducto = require('./Negocios/registrarProductoRuta');
const mostrarProductos = require('./Negocios/mostrarProductosRuta');
const editarEmpresa = require('./Administradores/editarNegocioRuta');
const desactivarNegocio = require('./Administradores/desactivarNegocioRuta');
const activarNegocio = require('./Administradores/activarNegocioRuta');
const inventario = require('./Negocios/inventarioRuta');
const cerrarSesion = require('./Login/cerrarSesionRuta');
const verEmpleados = require('./Negocios/verEmpleadosRuta');
const obtenerColoresPorCorreo = require('./Negocios/coloresNegocioRuta');
const editarEmpleado = require('./Negocios/editarEmpleadoRuta');
const crearCliente = require('./Negocios/crearClienteRuta');
const crearVenta = require('./Negocios/crearVentaRuta');
const verClientes = require('./Negocios/verClientesRuta');
const verVentas = require('./Negocios/verVentasRuta');
const datosUsuario = require('./Negocios/usuarioRuta');
const detalleVenta = require('./Negocios/detalleVentaRuta');
const datosNegocio = require('./Negocios/datosNegocioRuta');
const finanzas = require('./Negocios/finanzasRuta');
const crearMembresia = require('./Administradores/crearMembresiaRuta');
const verMembresias = require('./Administradores/verMembresiasRuta');
const renovarMembresia = require('./Administradores/renovarMembresiaRuta');
const actualizarEstado = require('./Administradores/activoMembresiaRuta');
const grafica = require('./Administradores/graficaRuta');

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
router.use("/api", listarNegocios);
router.use("/api", listarUsuariosPorNegocio);
router.use("/api", registrarProducto);
router.use("/api/productos", mostrarProductos);
router.use("/api", editarEmpresa);
router.use("/api", desactivarNegocio);
router.use("/api", activarNegocio);
router.use("/api", inventario);
router.use("/api", cerrarSesion);
router.use("/api", verEmpleados);
router.use("/api", obtenerColoresPorCorreo);
router.use("/api", editarEmpleado);
router.use("/api", crearCliente);
router.use("/api", crearVenta);
router.use("/api", verClientes);
router.use("/api", verVentas);
router.use("/api", datosUsuario);
router.use("/api", detalleVenta);
router.use("/api", datosNegocio);
router.use("/api", finanzas);
router.use("/api", crearMembresia);
router.use("/api", verMembresias);
router.use("/api", renovarMembresia);
router.use("/api", actualizarEstado);
router.use("/api", grafica);

module.exports = router;