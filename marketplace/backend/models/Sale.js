const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  producto: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  cedula: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  tarjeta: {
    numero: {
      type: String,
      required: true
    },
    vencimiento: {
      type: String,
      required: true
    },
    ccv: {
      type: String,
      required: true
    }
  },
  estado: {
    type: String,
    enum: ['Aceptado', 'Declinado'],
    default: 'Declinado'
  },
  fechaCompra: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Sale', SaleSchema);
