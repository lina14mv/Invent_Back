const express = require('express');
const { login } = require('../../controladores/Login/login');

const router = express.Router();

router.post('/login', login);

module.exports = router;