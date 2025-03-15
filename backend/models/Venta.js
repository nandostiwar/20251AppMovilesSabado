const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    producto: { type: String, required: true },
});

module.exports = mongoose.model('Venta', VentaSchema);