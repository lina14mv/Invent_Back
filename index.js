const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const rutas = require("./src/rutas/indexRutas");
const { testDbConnection } = require("./configuracion/bd");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Usar el endpoint de prueba de la base de datos
testDbConnection(app);

// Usar las rutas de la API
app.use(rutas);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});