const express = require('express');
const actualizarTicket = require('../../controladores/Administradores/actualizarTicket');

const router = express.Router();

router.put('/actualizar-ticket', actualizarTicket);

module.exports = router;