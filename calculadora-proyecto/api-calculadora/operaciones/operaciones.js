
/**
 * Sumar dos cantidades numéricas
 * @param {Number} a 
 * @param {Number} b 
 * @returns Number
 */
function add(a, b){
    let number1 = parseInt(a);
    let number2 = parseInt(b);
    return number1 + number2;
}

function subtract(a, b){
    let number1 = parseInt(a);
    let number2 = parseInt(b);
    return number1 - number2;
}

function multiply(a, b){
    let number1 = parseInt(a);
    let number2 = parseInt(b);
    return number1 * number2;
}

function division(a, b){
    let number1 = parseInt(a);
    let number2 = parseInt(b);
    return number1 / number2;
}

function Squaring(a){
    let number1 = parseInt(a);
    return number1 * 2;
}

function squareRoot(a){
    let number1 = parseInt(a);
    return Math.exp(0.5 * Math.log(number1));
};


module.exports = {
    add,
    subtract,
    multiply,
    division,
    Squaring,
    squareRoot
}