const express = require('express');
const router = express.Router();
const crearTickets = require('../../controladores/Negocios/crearTickets');

router.post('/crear-tickets', crearTickets);

module.exports = router;