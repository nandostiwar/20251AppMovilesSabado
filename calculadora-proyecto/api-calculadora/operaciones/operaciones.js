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

/**
 * Restar dos cantidades numéricas
 */
function subtract(a, b){
    let number1 = parseInt(a);
    let number2 = parseInt(b);
    return number1 - number2;
}

/**
 * Multiplicar dos cantidades numéricas
 */
function multiply(a, b){
    let number1 = parseInt(a);
    let number2 = parseInt(b);
    return number1 * number2;
}

/**
 * Dividir dos cantidades numéricas
 */
function divide(a, b){
    let number1 = parseFloat(a);
    let number2 = parseFloat(b);
    if (number2 === 0) {
        throw new Error("No se puede dividir por cero");
    }
    return number1 / number2;
}

module.exports = {
    add,
    subtract,
    multiply,
    divide
};
