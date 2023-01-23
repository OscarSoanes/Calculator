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
    if (previous == 0 || current == 0 || isNaN(previous)) {
        return "Error";
    }
    return previous / current;
}

function operate (operator, previous, current) {
    previous = parseFloat(previous);
    current = parseFloat(current);

    switch(operator) {
        case "+":
            return add(previous, current);
        case "-":
            return subtract(previous, current);
        case "x":
            return multiply(previous, current);
        case "/":
            return divide(previous, current);
        default: // = & everything else
            return current;
    }
}

function outputMessage (current, next, decimalPosition) {
    let output = String();
    const outputText = document.querySelector(".output")

    if (current == 0 && decimalPosition == undefined) { // 0
        output += next;
    } else { // everything else __.__
        output = current + next;
    }

    // adds decimal position
    if (decimalPosition != undefined && !output.includes(".")) {
        output = output.substring(0, decimalPosition) + "." + output.substring(decimalPosition);
    }

    // max length
    output = output.substring(0, 10);

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

    divideBtn.classList.remove("selected");
    multiplyBtn.classList.remove("selected");
    minusBtn.classList.remove("selected");
    plusBtn.classList.remove("selected");
    
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
    }
}

function clear(isEdited, currentMessage, decimalPosition, values, clearBtn) {
    if (isEdited === false && currentMessage === 0) { // AC
        operator = {};
        values = {operator};
        decimalPosition = undefined;
        return [isEdited, currentMessage, decimalPosition, values];
    }

    if (values.operator.previous === undefined) {
        values = {operator};
        currentMessage = outputMessage(0, 0, undefined);
        decimalPosition = undefined;
        return [isEdited, currentMessage, decimalPosition, values];
    }

    isEdited = false;
    currentMessage = outputMessage(0, 0, undefined);
    clearBtn.textContent = "AC";
    decimalPosition = undefined;

    console.log(isEdited, currentMessage, decimalPosition, values)

    return [isEdited, currentMessage, decimalPosition, values];
}

function updateMessageNumber(replaceNumber, currentMessage, isEdited, decimalPosition, numberEntered, clearBtn) {
    if (replaceNumber === true) {
        currentMessage = outputMessage(0, 0, undefined);
        replaceNumber = false;
    }

    clearBtn.textContent = "C"
    isEdited = true;
    currentMessage = outputMessage(currentMessage, numberEntered, decimalPosition);

    return [replaceNumber, currentMessage, isEdited, decimalPosition]
}

function deleteOne(currentMessage) {
    const outputText = document.querySelector(".output")

    currentMessage = currentMessage.toString();

    currentMessage = currentMessage.substring(0, currentMessage.length - 1);

    if (currentMessage != "") {
        outputText.textContent = currentMessage;
    } else {
        outputText.textContent = "0";
    }
    return currentMessage;
}

// variables
let replaceNumber = false; // tells whether the number needs to be changed
let isEdited = false;
let currentMessage = outputMessage(0, 0, undefined);
let operator = {};
let values = {operator};
let decimalPosition;

const clearBtn = document.querySelector("#clear");
const numbers = document.querySelectorAll(".number");
const coreFunctions = document.querySelectorAll(".core-function");
const changeBtn = document.querySelector("#change");
const decimalBtn = document.querySelector(".decimal");
const percentButton = document.querySelector("#percent");

clearBtn.addEventListener('click', () => {
    const temp = clear(isEdited, currentMessage, decimalPosition, values, clearBtn);
    isEdited = temp[0];
    currentMessage = temp[1];
    decimalPosition = temp[2];
    values = temp[3];
})


numbers.forEach(number => {
    number.addEventListener('click', () => {
        const temp = updateMessageNumber(replaceNumber, currentMessage, isEdited, decimalPosition, number.textContent, clearBtn);
        replaceNumber = temp[0];
        currentMessage = temp[1];
        isEdited = temp[2];
        decimalPosition = temp[3];
    })
})

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

changeBtn.addEventListener('click', function(e) {
    currentMessage = updateMessagePosNeg(currentMessage);
})


decimalBtn.addEventListener('click', function(e) {
    if (decimalPosition != undefined) {
        return;
    }

    decimalPosition = currentMessage.toString().length
})


percentButton.addEventListener('click', function(e) {
    currentMessage = operate("/", currentMessage, 100)

    const outputText = document.querySelector(".output")
    outputText.textContent = currentMessage;
})

document.addEventListener("keydown", (event) => {
    switch(event.key) {
        case "0": case "1": case "2": case "3": case "4": 
        case "5": case "6": case "7": case "8": case "9":
            const temp = updateMessageNumber(replaceNumber, currentMessage, isEdited, decimalPosition, event.key, clearBtn);
            replaceNumber = temp[0];
            currentMessage = temp[1];
            isEdited = temp[2];
            decimalPosition = temp[3];
            break;
        case "%":
            currentMessage = operate("/", currentMessage, 100)

            const outputText = document.querySelector(".output")
            outputText.textContent = currentMessage;
            break;

        case "/": case "-": case "+": case "=": 
            let valuesTemp = calculate(values, currentMessage, event.key, isEdited)
            values = valuesTemp[0];
            currentMessage = valuesTemp[1];
            replaceNumber = true;
            isEdited = false;
            decimalPosition = undefined;
            selected(values.operator.previous);
            break;

        case "*":
            let valuesTempX = calculate(values, currentMessage, "x", isEdited)
            values = valuesTempX[0];
            currentMessage = valuesTempX[1];
            replaceNumber = true;
            isEdited = false;
            decimalPosition = undefined;
            selected(values.operator.previous);
            break;

        case "Backspace":
            currentMessage = deleteOne(currentMessage);
            
            break;
        case ".":
            console.log("decimal");
            break;
    }
})

