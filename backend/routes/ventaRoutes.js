const express = require('express');
const Venta = require('../models/Venta');

const router = express.Router();

// Guardar una venta
router.post('/', async (req, res) => {
    try {
        const nuevaVenta = new Venta(req.body);
        await nuevaVenta.save();
        res.status(201).send('Venta guardada');
    } catch (error) {
        res.status(500).send('Error guardando la venta');
    }
});

module.exports = router;