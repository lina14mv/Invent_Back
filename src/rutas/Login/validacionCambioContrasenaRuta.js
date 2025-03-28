const express = require('express');
const {
  enviarCodigoRecuperacion,
  verificarCodigoRecuperacion
} = require('../../middlewares/validacionCambioContrasena');

const router = express.Router();

// Enviar código de recuperación
router.post('/enviar-codigo', enviarCodigoRecuperacion);

// Verificar código de recuperación
router.put('/verificar-codigo-cambio', verificarCodigoRecuperacion);

module.exports = router;