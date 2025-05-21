const express = require('express');
const grafica = require('../../controladores/Administradores/grafica');
const router = express.Router();

router.get('/grafica-membresias', grafica);

module.exports = router;