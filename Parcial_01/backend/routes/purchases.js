const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const { authenticate, authorize } = require('../middlewares/auth');

// Obtener todas las compras (admin puede ver todas, usuarios normales solo ven las suyas)
router.get('/', authenticate, async (req, res) => {
  try {
    let purchases;
    
    // Si es admin, puede ver todas las compras
    if (req.user.role === 'admin') {
      purchases = await Purchase.find().populate('user', 'name email');
    } else {
      // Si es usuario normal, solo puede ver sus propias compras
      purchases = await Purchase.find({ user: req.user._id });
    }
    
    res.json(purchases);
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({ error: 'Error al obtener las compras' });
  }
});

// Obtener una compra específica por ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate('user', 'name email');
    
    if (!purchase) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    
    // Verificar si el usuario puede ver esta compra (solo el dueño o un admin)
    if (!purchase.user.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para ver esta compra' });
    }
    
    res.json(purchase);
  } catch (error) {
    console.error('Error al obtener compra:', error);
    res.status(500).json({ error: 'Error al obtener la compra' });
  }
});

// Realizar una nueva compra
router.post('/', authenticate, async (req, res) => {
  try {
    const { 
      product, 
      amount, 
      customerName, 
      identificationNumber, 
      phoneNumber, 
      cardNumber, 
      expirationDate, 
      status 
    } = req.body;
    
    // Validar campos obligatorios básicos
    if (!product || !amount) {
      return res.status(400).json({ error: 'El nombre del producto y el monto son obligatorios' });
    }
    
    // Validar datos de cliente
    if (!customerName || !identificationNumber || !phoneNumber) {
      return res.status(400).json({ error: 'Los datos personales del cliente son obligatorios' });
    }
    
    // Validar datos de la tarjeta
    if (!cardNumber || !expirationDate) {
      return res.status(400).json({ error: 'Los datos de la tarjeta son obligatorios' });
    }
    
    // Crear objeto de compra con todos los campos
    const purchase = new Purchase({
      user: req.user._id,
      product,
      amount,
      customerName,
      identificationNumber,
      phoneNumber,
      cardDetails: {
        cardNumber,
        expirationDate
      },
      status: status || 'aceptado' // Por defecto es aceptado si no se especifica
    });
    
    const savedPurchase = await purchase.save();
    
    res.status(201).json({
      message: 'Compra realizada exitosamente',
      purchase: savedPurchase
    });
  } catch (error) {
    console.error('Error al crear compra:', error);
    res.status(500).json({ error: 'Error al realizar la compra' });
  }
});

// Actualizar una compra (solo admin)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { 
      product, 
      amount, 
      customerName, 
      identificationNumber, 
      phoneNumber, 
      cardNumber, 
      expirationDate, 
      status 
    } = req.body;
    
    const purchase = await Purchase.findById(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    
    // Actualizar campos básicos si se proporcionan
    if (product) purchase.product = product;
    if (amount !== undefined) purchase.amount = amount;
    
    // Actualizar datos personales si se proporcionan
    if (customerName) purchase.customerName = customerName;
    if (identificationNumber) purchase.identificationNumber = identificationNumber;
    if (phoneNumber) purchase.phoneNumber = phoneNumber;
    
    // Actualizar detalles de la tarjeta si se proporcionan
    if (cardNumber) purchase.cardDetails.cardNumber = cardNumber;
    if (expirationDate) purchase.cardDetails.expirationDate = expirationDate;
    
    // Actualizar estado si se proporciona
    if (status && ['aceptado', 'declinado'].includes(status)) {
      purchase.status = status;
    }
    
    const updatedPurchase = await purchase.save();
    
    res.json({
      message: 'Compra actualizada exitosamente',
      purchase: updatedPurchase
    });
  } catch (error) {
    console.error('Error al actualizar compra:', error);
    res.status(500).json({ error: 'Error al actualizar la compra' });
  }
});

// Eliminar una compra (solo admin)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({ error: 'Compra no encontrada' });
    }
    
    res.json({ message: 'Compra eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar compra:', error);
    res.status(500).json({ error: 'Error al eliminar la compra' });
  }
});

module.exports = router;