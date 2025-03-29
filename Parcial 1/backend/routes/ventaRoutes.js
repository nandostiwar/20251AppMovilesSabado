const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  nuevaVenta,
  obtenerVentasUsuario,
  obtenerTodasVentas,
  actualizarVenta
} = require('../controllers/ventaController')

// PROTEGER estas rutas con middleware auth
router.post('/nueva', auth, nuevaVenta)
router.get('/usuario/:userId', auth, obtenerVentasUsuario)
router.get('/admin/todas', auth, obtenerTodasVentas)
router.put('/admin/actualizar', auth, actualizarVenta)

module.exports = router
