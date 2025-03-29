const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    producto: {
        nombre: {
            type: String,
            required: true
        },
        valor: {
            type: Number,
            required: true
        }
    },
    estado: {
        type: String,
        enum: ['procesando', 'completada', 'rechazada'],
        default: 'procesando'
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    referenciaPago: {
        type: String,
        unique: true,
        sparse: true
    }
});

module.exports = mongoose.model('Venta', ventaSchema);