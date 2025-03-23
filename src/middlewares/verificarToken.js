const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  // Obtener el token del encabezado y eliminar el prefijo "Bearer" si está presente
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "Acceso denegado. Token no proporcionado." });
  }

  // Verificar si JWT_SECRET está definido en el entorno
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET no está definido en el entorno");
  }

  // Verificar la estructura del token (3 partes separadas por puntos)
  if (token.split(".").length !== 3) {
    return res
      .status(400)
      .json({ mensaje: "Token inválido. Formato incorrecto." });
  }

  try {
    // Verificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Almacenar los datos del usuario decodificado en req.user
    console.log("Usuario decodificado: ", req.user);
    next(); // Continuar con la solicitud
  } catch (error) {
    return res.status(400).json({ mensaje: "Token no válido.", error });
  }
};

module.exports = verificarToken;