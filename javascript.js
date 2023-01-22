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

function outputMessage (current, next) {
    let output;
    if (current === 0 && next != ".") {
        output = next;
    } else {
        output = current.toString() + next;
    }

    const outputText = document.querySelector(".output")
    outputText.textContent = output;

    return output;
}

let currentMessage = outputMessage(0, 0);


const numbers = document.querySelectorAll(".number");

numbers.forEach(number => {
    number.addEventListener('click', event => {
        currentMessage = outputMessage(currentMessage, number.textContent)
    })
})