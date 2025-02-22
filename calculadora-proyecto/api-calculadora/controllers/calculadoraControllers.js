const {add, subtract, multiply, divide} = require('../operaciones/operaciones.js');

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

function dividir(req, res) {
    const { body } = req;
    const { number1, number2 } = body;
    try {
        const result = divide(number1, number2);
        res.json({ resultado: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    sumar,
    restar,
    multiplicar,
    dividir
}