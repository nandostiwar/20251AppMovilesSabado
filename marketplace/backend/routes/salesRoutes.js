const express = require('express');
const router = express.Router();
const { getAllVentas, getVentasUsuario, storeVenta, actualizarVenta } = require('../controllers/salesController');


router.get('/admin', getAllVentas);
router.get('/sales-by-user/:id', getVentasUsuario);
router.post('/store-venta', storeVenta);
router.put('/:id', actualizarVenta);

module.exports = router;