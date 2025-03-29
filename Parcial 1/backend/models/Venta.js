// models/Venta.js
const mongoose = require('mongoose')

const ventaSchema = new mongoose.Schema({
  valor: Number,
  producto: String,
  nombre: String,
  cedula: String,
  telefono: String,
  tarjeta: String,
  vencimiento: String,
  ccv: String,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, enum: ['Aceptado', 'Declinado'], default: 'Declinado' }
})

module.exports = mongoose.model('Venta', ventaSchema)
