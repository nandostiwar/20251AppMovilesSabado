const express = require('express');
const Usuario = require('../models/usuario');
const router = express.Router();

// Iniciar sesión (Login)
router.post('/login', async (req, res) => {
  try {
    const { telefono } = req.body;

    if (!telefono) {
      return res.status(400).json({ error: 'El teléfono es obligatorio' });
    }

    const usuario = await Usuario.findOne({ telefono });

    if (!usuario) {
      return res.status(400).json({ error: 'Número no registrado' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
  } catch (error) {
    console.error('Error en el backend:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
