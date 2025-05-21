const express = require('express');
const router = express.Router();
const crearTickets = require('../../controladores/Negocios/crearTickets');
const verificarToken = require('../../middlewares/verificarToken');

router.post('/crear-tickets',verificarToken, crearTickets);

module.exports = router;