function add (previous, current) {
    return previous + current;
}

function subtract (previous, current) {
    return previous - current;
}

function multiply (previous, current) {
    return previous * current;
}

function divide (previous, current) {
    return previous / current;
}

function operate (operator, previous, current) {
    let output;
    switch(operator) {
        case "+":
            output = add(previous, current);
            break;
        case "-":
            output = subtract(previous, current);
            break;
        case "*":
            output = multiply(previous, current);
            break;
        case "/":
            output = divide(previous, current);
            break;
    }

    return output;
}