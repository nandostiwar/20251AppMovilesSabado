const express = require("express");
const { nuevaVenta } = require("../controllers/ventasController");
const verificarAdmin = require("../middleware/verificarAdmin");
const verificarToken = require("../middleware/authMiddleware"); // Middleware para autenticación
const authMiddleware = require("../middleware/authMiddleware"); // Middleware para verificar JWT
const { obtenerVentas, actualizarVenta } = require("../controllers/ventasController");
const Venta = require("../models/Venta");


const router = express.Router();

// Obtener historial de compras del usuario autenticado
// GET todas las ventas (admin)
router.get("/", obtenerVentas, async (req, res) => {
  try {
    if (req.user.rol !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const ventas = await Venta.find().populate("usuario", "nombre");
    res.json(ventas);
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Registrar una nueva venta (accesible para todos)
router.post("/nuevaVenta", nuevaVenta);

// Obtener todas las ventas (solo para admins)
router.get("/", verificarToken, );
router.put("/:id", verificarToken, actualizarVenta);

// Actualizar una venta (solo admins)
router.put("/:id", verificarToken, verificarAdmin, actualizarVenta);

module.exports = router;
