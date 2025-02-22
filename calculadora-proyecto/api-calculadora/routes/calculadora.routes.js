const express = require('express');
const router = express.Router();
const calculadoraControllers = require('../controllers/calculadoraControllers.js');

router
    .post('/sumar', calculadoraControllers.sumar)
    .post('/restar', calculadoraControllers.restar)
    .post('/multiplicar', calculadoraControllers.multiplicar)
    .post('/dividir', calculadoraControllers.dividir)
    .post('/elevar-al-cuadrado', calculadoraControllers.elevar_al_cuadrado)
    .post('/raiz-cuadrada', calculadoraControllers.raizCuadrada)

module.exports = router;