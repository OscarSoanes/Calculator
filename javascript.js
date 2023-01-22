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

    previous = parseInt(previous);
    current = parseInt(current);

    switch(operator) {
        case "+":
            output = add(previous, current);
            break;
        case "-":
            output = subtract(previous, current);
            break;
        case "x":
            output = multiply(previous, current);
            break;
        case "/":
            output = divide(previous, current);
            break;
        case "=":
            output = current;
            break;
    }

    return output;
}

function outputMessage (current, next) {
    let output;
    if (current === 0 && next != ".") {
        output = next;
    } else {
        output = current.toString() + next;
    }

    output = parseFloat((output.toString()).substring(0,10))

    const outputText = document.querySelector(".output")
    outputText.textContent = output;

    return output;
}

function calculate (obj, currentMessage, newOperator, edited) {
    if (edited === false) {
        obj.operator.previous = newOperator;
        return [obj, currentMessage];
    }

    // operators
    if (obj.operator.previous === undefined) {
        obj.operator.previous = newOperator;
    } else if (obj.operator.next === undefined && newOperator != "=") {
        obj.operator.next = newOperator;
    }

    // numbers
    if (obj.previous === undefined) {
        obj.previous = currentMessage;
        return [obj, currentMessage]; 
    }
    if (obj.next === undefined) {
        obj.next = currentMessage;
    }

    // should only be here if everything is full.
    currentMessage = operate(obj.operator.previous, obj.previous, obj.next)
    outputMessage(0, currentMessage);
    
    // changing all next values to previous values
    obj.previous = currentMessage;
    obj.next = undefined;

    obj.operator.previous = obj.operator.next;
    obj.operator.next = undefined;

    return [obj, currentMessage];
}


// variables
let replaceNumber = false;
let edited = false;
let currentMessage = outputMessage(0, 0);
let previous;
let current;
let operator = {};
let values = {operator};
const clearBtn = document.querySelector("#clear");

const numbers = document.querySelectorAll(".number");
numbers.forEach(number => {
    number.addEventListener('click', () => {
        if (replaceNumber == true) {
            currentMessage = outputMessage(0, 0);
            replaceNumber = false;
        }
        clearBtn.textContent = "C"
        edited = true;
        currentMessage = outputMessage(currentMessage, number.textContent);
    })
})

const coreFunctions = document.querySelectorAll(".core-function");
coreFunctions.forEach(functions => {
    functions.addEventListener('click', () => {
        const valuesTemp = calculate(values, currentMessage, functions.textContent, edited)
        values = valuesTemp[0];
        currentMessage = valuesTemp[1];
        replaceNumber = true;
        edited = false;
    })
})

// TODO : +/- button
// TODO : % Button

clearBtn.addEventListener('click', function (e) {
    if (edited === false && currentMessage === 0) { // AC
        operator = {}
        values = {operator}
        return;
    }

    if (values.operator.previous === undefined) {
        values = {operator}
        currentMessage = outputMessage(0, 0);
        return;
    }

    edited = false;
    currentMessage = outputMessage(0, 0);
    clearBtn.textContent = "AC"
})
// TODO : . Button

// TODO : GUI