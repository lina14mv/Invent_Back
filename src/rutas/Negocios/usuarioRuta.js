const datosUsuario = require("../../controladores/Negocios/usuario");
const { Router } = require("express");

const router = Router();
router.get("/usuario/:id_usuario", datosUsuario);
module.exports = router;