const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: String, // Nombre del producto ingresado manualmente
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'El monto de la compra es obligatorio'],
    min: [0, 'El monto no puede ser negativo']
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Campos adicionales para datos personales
  customerName: {
    type: String,
    required: [true, 'El nombre completo es obligatorio'],
    trim: true
  },
  identificationNumber: {
    type: String,
    required: [true, 'El número de cédula es obligatorio'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'El número de teléfono es obligatorio'],
    trim: true
  },
  // Campos para detalles de la tarjeta (en un entorno real, estos datos deberían estar encriptados)
  cardDetails: {
    cardNumber: {
      type: String,
      required: [true, 'El número de tarjeta es obligatorio'],
      // Solo guardar los últimos 4 dígitos por seguridad
      set: function(number) {
        const cleanNumber = number.replace(/\s+/g, '');
        return '************' + cleanNumber.slice(-4);
      }
    },
    expirationDate: {
      type: String,
      required: [true, 'La fecha de expiración es obligatoria']
    }
    // Por seguridad no guardamos el CVV
  },
  status: {
    type: String,
    enum: ['aceptado', 'declinado'],
    default: 'aceptado'
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);