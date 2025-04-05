const mongoose = require("mongoose");

const ventaSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  nombre: { type: String, required: true }, // Nombre del usuario
  producto: { type: String, required: true },
  valor: { type: Number, required: true },
  estado: { type: String, enum: ["Pendiente", "Aprobada", "Rechazada"], default: "Pendiente" }
});

module.exports = mongoose.model("Venta", ventaSchema);
