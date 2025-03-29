// models/User.js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, unique: true },
  contraseña: String,
  rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' }
})

module.exports = mongoose.model('User', userSchema)
