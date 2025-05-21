const express = require('express');
const finanzas = require('../../controladores/Negocios/finanzas');
const router = express.Router();

router.get('/finanzas/:id_negocio', finanzas);

module.exports = router;