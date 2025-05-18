const datosNegocioController = require('../../controladores/Negocios/datosNegocio');
const { Router } = require('express');
const router = Router();
// Ruta para obtener los datos del negocio
router.get('/negocio/:id_negocio', datosNegocioController);

module.exports = router;