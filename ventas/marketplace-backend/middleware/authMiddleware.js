const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // ✅ Esto es clave

  console.log("🔑 Token recibido:", token);

  if (!token) {
    console.log("❌ Error: Token no proporcionado.");
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("✅ Usuario autenticado:", req.user);
    next();
  } catch (error) {
    console.log("❌ Token inválido:", error.message);
    res.status(403).json({ message: "Token inválido." });
  }
};

module.exports = verificarToken;
