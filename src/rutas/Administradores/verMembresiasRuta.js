const express = require('express');
const verMembresias = require('../../controladores/Administradores/verMembresias');
const router = express.Router();

router.get('/ver-membresias', verMembresias);

module.exports = router;