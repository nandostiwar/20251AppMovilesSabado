const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    producto: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Venta', ventaSchema); 