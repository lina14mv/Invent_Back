const verEmpleados = require ("../../controladores/Negocios/verEmpleados");
const { Router } = require("express");

const router = Router();
router.get("/verEmpleados/:id_negocio", verEmpleados);
module.exports = router;