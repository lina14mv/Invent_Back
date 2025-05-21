const express = require('express');
const renovarMembresia = require('../../controladores/Administradores/renovarMembresia');
const router = express.Router();

router.post('/renovar-membresia', renovarMembresia);

module.exports = router;