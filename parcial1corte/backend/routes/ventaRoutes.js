const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');

// Middleware para verificar rol de administrador
const verificarAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
    next();
};

// Crear una nueva venta
router.post('/', async (req, res) => {
    try {
        const { nombre, valor, metodoPago } = req.body;
        const venta = new Venta({
            usuario: req.usuario.id,
            producto: {
                nombre,
                valor
            },
            estado: 'procesando',
            referenciaPago: `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });
        await venta.save();
        res.status(201).json(venta);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la venta' });
    }
});

// Obtener todas las ventas (solo admin)
router.get('/', verificarAdmin, async (req, res) => {
    try {
        const ventas = await Venta.find().populate('usuario', 'nombre email');
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las ventas' });
    }
});

// Obtener ventas del usuario actual
router.get('/mis-ventas', async (req, res) => {
    try {
        const ventas = await Venta.find({ usuario: req.usuario.id });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las ventas' });
    }
});

// Actualizar estado de una venta (solo admin)
router.put('/:id/estado', verificarAdmin, async (req, res) => {
    try {
        const { estado } = req.body;
        const venta = await Venta.findById(req.params.id);
        
        if (!venta) {
            return res.status(404).json({ mensaje: 'Venta no encontrada' });
        }

        // Validar que el nuevo estado sea válido
        if (!['procesando', 'completada', 'rechazada'].includes(estado)) {
            return res.status(400).json({ mensaje: 'Estado no válido' });
        }

        venta.estado = estado;
        await venta.save();
        res.json(venta);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el estado de la venta' });
    }
});

module.exports = router;