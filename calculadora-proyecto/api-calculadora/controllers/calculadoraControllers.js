const {add, subtract, multiply,division,Squaring,squareRoot} = require('../operaciones/operaciones.js');

function sumar(req, res){
    const {body} = req;
    const {number1, number2} = body;
    const result = add(number1, number2);
    res.json({
        resultado: result
    });
}

function restar(req, res){
    const {body} = req;
    const {number1, number2} = body;
    const result = subtract(number1, number2);
    res.json({
        resultado: result
    })
}

function multiplicar(req, res){
    const {body} = req;
    const {number1, number2} = body;
    const result = multiply(number1, number2);
    res.json({
        resultado: result
    })
}

function dividir(req, res){
    const {body} = req;
    const {number1, number2} = body;
    const result = division(number1, number2);
    res.json({
        resultado: result
    })
}

function elevar_al_cuadrado(req, res){
    const {body} = req;
    const {number1} = body;
    const result = Squaring(number1);
    res.json({
        resultado: result
    })
}

function raizCuadrada(req, res){
    const {body} = req;
    const {number1} = body;
    const result = squareRoot(number1);
    res.json({
        resultado: result
    })
}
module.exports = {
    sumar,
    restar,
    multiplicar,
    dividir,
    elevar_al_cuadrado,
    raizCuadrada
}