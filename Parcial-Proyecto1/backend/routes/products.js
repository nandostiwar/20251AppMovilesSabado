const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate, authorize } = require('../middlewares/auth');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name email');
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Crear un nuevo producto (solo usuarios autenticados)
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, price, description } = req.body;
    
    const product = new Product({
      name,
      price,
      description,
      createdBy: req.user._id
    });
    
    const savedProduct = await product.save();
    
    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: savedProduct
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// Actualizar un producto (solo el creador o admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Verificar si el usuario es el creador del producto o un admin
    if (!product.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para actualizar este producto' });
    }
    
    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.description = description !== undefined ? description : product.description;
    
    const updatedProduct = await product.save();
    
    res.json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto (solo el creador o admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Verificar si el usuario es el creador del producto o un admin
    if (!product.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;