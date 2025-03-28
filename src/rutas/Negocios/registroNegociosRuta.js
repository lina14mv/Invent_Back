const express = require('express');
const router = express.Router();
const {registrarNegocio}  = require('../../controladores/Negocios/registroNegocios');


router.post('/registrar', registrarNegocio);

module.exports = router;