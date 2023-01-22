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
    if (previous == 0 && current == 0) {
        return "Error";
    }
    return previous / current;
}

function operate (operator, previous, current) {
    let output;

    previous = parseFloat(previous);
    current = parseFloat(current);

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

function outputMessage (current, next, decimalPosition) {
    let output = String();

    if (current == 0) {
        output += next.toString();
    } else {
        output += current.toString() + next;
    }

    if (decimalPosition != undefined && !output.includes(".")) {
        output = output.substring(0, decimalPosition) + "." + output.substring(decimalPosition);
    }

    // max length
    output = output.substring(0, 10);

    const outputText = document.querySelector(".output")
    outputText.textContent = output;

    return output;
}

function updateMessagePosNeg (current) {
    current = current * -1

    const outputText = document.querySelector(".output")
    outputText.textContent = current;

    return current;
}

function calculate (obj, currentMessage, newOperator, isEdited) {
    if (isEdited === false) {
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

    if (currentMessage == "Error") {
        obj.previous = undefined;
        obj.next = undefined;
        obj.operator.previous = undefined;
        obj.operator.next = undefined;
    }

    return [obj, currentMessage];
}

function selected(operator) {
    const divideBtn = document.querySelector("#divide");
    const multiplyBtn = document.querySelector("#multiply");
    const minusBtn = document.querySelector("#minus");
    const plusBtn = document.querySelector("#plus");
    const equalsBtn = document.querySelector("#equals");

    divideBtn.classList.remove("selected");
    multiplyBtn.classList.remove("selected");
    minusBtn.classList.remove("selected");
    plusBtn.classList.remove("selected");
    equalsBtn.classList.remove("selected");
    
    switch (operator) {
        case "/":
            divideBtn.classList.add("selected");
            break;
        case "x":
            multiplyBtn.classList.add("selected");
            break;
        case "-":
            minusBtn.classList.add("selected");
            break;
        case "+":
            plusBtn.classList.add("selected");
            break;
        case "=": 
            equalsBtn.classList.add("selected");
            break;
    }
}

// variables
let replaceNumber = false; // tells whether the number needs to be changed
let isEdited = false;
let currentMessage = outputMessage(0, 0, undefined);
let operator = {};
let values = {operator};
let decimalPosition;

const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener('click', function (e) {
    if (isEdited === false && currentMessage === 0) { // AC
        operator = {};
        values = {operator};
        decimalPosition = undefined;
        return;
    }

    if (values.operator.previous === undefined) {
        values = {operator};
        currentMessage = outputMessage(0, 0, undefined);
        decimalPosition = undefined;
        return;
    }

    isEdited = false;
    currentMessage = outputMessage(0, 0, undefined);
    clearBtn.textContent = "AC";
    decimalPosition = undefined;
})

const numbers = document.querySelectorAll(".number");
numbers.forEach(number => {
    number.addEventListener('click', () => {
        if (replaceNumber === true) {
            currentMessage = outputMessage(0, 0, undefined);
            replaceNumber = false;
        }

        clearBtn.textContent = "C"
        isEdited = true;
        currentMessage = outputMessage(currentMessage, number.textContent, decimalPosition);
    })
})

const coreFunctions = document.querySelectorAll(".core-function");
coreFunctions.forEach(functions => {
    functions.addEventListener('click', () => {
        const valuesTemp = calculate(values, currentMessage, functions.textContent, isEdited)
        values = valuesTemp[0];
        currentMessage = valuesTemp[1];
        replaceNumber = true;
        isEdited = false;
        decimalPosition = undefined;

        selected(values.operator.previous);
    })
})

const changeBtn = document.querySelector("#change");
changeBtn.addEventListener('click', function(e) {
    currentMessage = updateMessagePosNeg(currentMessage);
})

const decimalBtn = document.querySelector(".decimal");
decimalBtn.addEventListener('click', function(e) {
    if (decimalPosition != undefined) {
        return;
    }

    decimalPosition = currentMessage.toString().length

    // temporary addition of . (as there is no value on right hand side to hold it)
    const outputText = document.querySelector(".output")
    outputText.textContent = currentMessage + ".";
})

const percentButton = document.querySelector("#percent");
percentButton.addEventListener('click', function(e) {
    currentMessage = operate("/", currentMessage, 100)

    const outputText = document.querySelector(".output")
    outputText.textContent = currentMessage;
})

// TODO : KEY INPUT (1-9, +, -, /, *, ., %, =)

// TODO : SHOW SELECTED (/ X - + =)