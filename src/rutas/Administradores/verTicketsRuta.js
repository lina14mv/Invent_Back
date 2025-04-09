const express = require('express');
const verTickets = require('../../controladores/Administradores/verTickets');

const router = express.Router();

// Ruta para obtener los tickets
router.get('/ver-tickets', verTickets);

module.exports = router;