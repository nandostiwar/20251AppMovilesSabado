const express = require('express');
const Cliente = require('../models/Cliente');

const router = express.Router();

// Guardar un cliente
router.post('/', async (req, res) => {
    try {
        const nuevoCliente = new Cliente(req.body);
        await nuevoCliente.save();
        res.status(201).send('Cliente guardado');
    } catch (error) {
        res.status(500).send('Error guardando el cliente');
    }
});

module.exports = router;