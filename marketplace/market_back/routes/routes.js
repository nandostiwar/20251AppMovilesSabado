const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const ventasController = require('../controllers/ventasController');

router
    // Ruta login
    .post('/login', usuariosController.login)
    // Rutas usuarios
    .post('/usuarios/crear-usuario', usuariosController.crearUsuario)
    .put('/usuarios/actualizar-usuario/:id', usuariosController.actualizarUsuario)
    .delete('/usuarios/eliminar-usuario/:id', usuariosController.eliminarUsuario)
    // Rutas ventas
    .get('/ventas/listar', ventasController.listarVentas)
    .post('/ventas/crear-venta', ventasController.nuevaVenta)
    .put('/ventas/actualizar-venta/:id', ventasController.actualizarVenta)

module.exports = router;
