const express = require('express');
const { obtenerColoresPorCorreo } = require('../../controladores/Negocios/coloresNegocio');
const router = express.Router();

router.post('/colores-negocio', obtenerColoresPorCorreo);

module.exports = router;