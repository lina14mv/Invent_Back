const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const rutas = require("./src/rutas/indexRutas");
const { testDbConnection } = require("./configuracion/bd");

const app = express();

const allowedOrigins = [
  "http://localhost:5002", // Origen local para desarrollo
  "http://localhost:5173",
  "https://d2oip7dtxebx8q.cloudfront.net",
  "http://d2oip7dtxebx8q.cloudfront.net",
  // "http://localhost:3004",
  // "https://movetogether.netlify.app", 
  // "https://move-together-back.vercel.app",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "El CORS policy no permite el acceso desde este origen.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200, // Para navegadores antiguos que requieren un status 200 en lugar de 204
};
app.use(cors(corsOptions));

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