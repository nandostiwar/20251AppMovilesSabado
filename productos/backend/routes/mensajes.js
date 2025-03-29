const express = require('express');
const Mensaje = require('../models/mensaje');
const Usuario = require('../models/usuario');
const router = express.Router();

// Enviar mensaje solo a usuarios registrados
router.post('/', async (req, res) => {
  try {
    const { telefono, mensaje } = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ telefono });
    if (!usuario) {
      return res.status(400).json({ error: 'Número no registrado' });
    }

    const nuevoMensaje = new Mensaje({ telefono, mensaje });
    await nuevoMensaje.save();
    res.status(201).json({ message: 'Mensaje enviado correctamente', mensaje: nuevoMensaje });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// Obtener mensajes enviados
router.get('/', async (req, res) => {
  try {
    const mensajes = await Mensaje.find();
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

module.exports = router;
