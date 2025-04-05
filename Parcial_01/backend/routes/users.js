const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorize } = require('../middlewares/auth');

// Obtener todos los usuarios (solo admin)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
  }
});

// Obtener un usuario específico por ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    // Solo los admins pueden ver cualquier usuario, los usuarios normales solo pueden verse a sí mismos
    if (req.user.role !== 'admin' && req.params.id !== req.user.id.toString()) {
      return res.status(403).json({ error: 'No tienes permiso para ver este usuario' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Actualizar un usuario
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Solo los admins pueden actualizar cualquier usuario, los usuarios normales solo pueden actualizarse a sí mismos
    if (req.user.role !== 'admin' && req.params.id !== req.user.id.toString()) {
      return res.status(403).json({ error: 'No tienes permiso para actualizar este usuario' });
    }

    const { name, email, password } = req.body;
    
    // No permitir cambio de rol a menos que sea admin
    const updates = { name, email };
    if (password) {
      updates.password = password;
    }
    
    // Si es admin, puede cambiar el rol
    if (req.user.role === 'admin' && req.body.role) {
      updates.role = req.body.role;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario actualizado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;