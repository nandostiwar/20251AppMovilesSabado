const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true }, // Agregado el campo correo
  password: { type: String, required: true },
  rol: { type: String, enum: ["usuario", "admin"], default: "usuario" }
});

module.exports = mongoose.model("User", userSchema);
