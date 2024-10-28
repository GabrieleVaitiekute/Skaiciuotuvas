document.getElementById('display').addEventListener('input', function(e) {
    // Prevent invalid characters or pasting
    this.innerText = this.innerText.replace(/[^0-9+\-*/().^]|[\+\-\*/^]{2,}/g, '');
    // Ensure it starts correctly
    if (/^[+\-*/^]/.test(this.innerText)) {
        this.innerText = '';
    }
});
function display(value) {
    const display = document.getElementById('display');
    if (display.innerText.includes('=') && !['+', '-', '*', '/', '(', ')', '^', '%'].includes(value)) {
        clearDisplay();
    }
    display.innerText += value;
}

function calculate() {
    let expression = document.getElementById('display').innerText;
    const originalExpression = expression;
    expression = expression.replace(/(\d+)%/g, (match, value) => parseFloat(value) / 100);
    expression = expression.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));
    expression = expression.replace(/root\((\d+),\s*(.*?)\)/g, (match, n, x) => `Math.pow(${x.trim()}, 1/${n.trim()})`);
    expression = expression.replace(/\^/g, "**").replace(/×/g, "*").replace(/÷/g, "/"); // Also handle multiplication and division symbols

    try {
        const result = Function("return " + expression)();
        document.getElementById('display').innerText = originalExpression + ' = ';
        const resultSpan = document.createElement('span');
        resultSpan.style.cssText = "align-self: flex-end;"; // desinej rodo
        resultSpan.textContent = result;
        document.getElementById('display').appendChild(resultSpan);
    } catch (e) {
        document.getElementById('display').innerText = "Error";
    }  
}

function backspace() {
    let displayText = document.getElementById('display').innerText;
    document.getElementById('display').innerText = displayText.substring(0, displayText.length - 1);
}

function clearDisplay() {
    document.getElementById('display').innerText = '';
}

function handleBracket() {
    const display = document.getElementById('display');
    let displayText = display.innerText;
    const lastChar = displayText.slice(-1);
    const openBrackets = (displayText.match(/\(/g) || []).length;
    const closeBrackets = (displayText.match(/\)/g) || []).length;

    if (openBrackets <= closeBrackets || ['+', '-', '*', '/', '^', ''].includes(lastChar)) {
        displayText += '(';
    } else if (openBrackets > closeBrackets && lastChar !== '(') {
        displayText += ')';
    }

    display.innerText = displayText;
}

function handlePower(n) {
    display('^');
    if (n !== 'n') display(n);
}

function startRoot(n) {
    if (n === 'n') {
        display('root(');
    } else {
        display('root(2,');
    }
}

function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) {
        return "Error: Factorial not defined for negative numbers or non-integers";
    } else if (n > 170) {  // Beyond 170!, JavaScript returns Infinity due to floating-point overflow
        return "Error: Input too large";
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function simpleParser(expression) {
    // Split the expression on spaces assuming inputs are like "10 + 20"
    let tokens = expression.split(' ');
    let stack = [];

    // Basic handling of operations
    try {
        tokens.forEach((token, index) => {
            if (!isNaN(parseFloat(token))) {
                stack.push(parseFloat(token));
            } else if (token === '+' && index + 1 < tokens.length) {
                stack.push(stack.pop() + parseFloat(tokens[index + 1]));
            } else if (token === '-' && index + 1 < tokens.length) {
                stack.push(stack.pop() - parseFloat(tokens[index + 1]));
            }
        });
        return stack.pop();
    } catch (e) {
        return "Error";
    }
}