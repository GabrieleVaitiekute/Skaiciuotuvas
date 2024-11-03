document.getElementById('display').addEventListener('input', function(e) {
    // Užkirsti kelią netinkamiems simboliams arba įklijavimui
    this.innerText = this.innerText.replace(/[^0-9+\-*/().^]|[\+\-\*/^]{2,}/g, '');
    // Užtikrinti, kad pradžia būtų teisinga
    if (/^[+\-*/^]/.test(this.innerText)) {
        this.innerText = '';
    }
});

function display(value) {
    const display = document.getElementById('display');
    let currentText = display.innerText;

    // Tikrina ar pradinis įvedimas yra skaičius arba saknies funkcija
    if (currentText === '' && !['root(2,', 'root('].includes(value) && isNaN(value)) {
        return; // Jeigu tekstas tuščias, ir įvedamas simbolis nėra leistinas, nedaro nieko
    }

    // Tikrina, ar nėra bandymo įvesti du operatorius iš eilės
    const lastChar = currentText.slice(-1);
    const operators = ['+', '-', '*', '/', '^', '(', ')', '%', ','];
    if (operators.includes(lastChar) && operators.includes(value)) {
        return; // Neleidžia įvesti dviejų operatorių iš eilės
    }

    // Tinkamai pridėti reikšmę prie dabartinio ekrano teksto
    if (currentText.includes('=') && !['+', '-', '*', '/', '(', ')', '^', '%', ','].includes(value)) {
        clearDisplay();
    }
    display.innerText += value;
}

function calculate() {
    let expression = document.getElementById('display').innerText;
    const originalExpression = expression;
    
    // Pirmiausia, pakeiskite visas kablelius globaliai prieš tvarkant konkrečias funkcijas
    expression = expression.replace(/,/g, '.');

    // Teisingas 'root' funkcijos tvarkymas po kablelių pakeitimo
    expression = expression.replace(/root\((\d+).\s*(.*?)\)/g, (match, n, x) => {
        n = n.trim(); // Užtikrinti, kad nebūtų pradžios/galo tarpų
        x = x.trim(); // Užtikrinti, kad nebūtų pradžios/galo tarpų
        return `Math.pow(${x}, 1/${n})`; // Teisingai suformatuoti Math.pow funkcijos iškvietimą
    }); 
    // Pakeisti kitus matematinės simbolius ir operacijas
    expression = expression.replace(/(\d+)%/g, (match, value) => parseFloat(value) / 100);
    expression = expression.replace(/(\d+)!/g, (match, num) => factorial(parseInt(num)));
    expression = expression.replace(/\^/g, "**").replace(/×/g, "*").replace(/÷/g, "/");

    // Tvarkymas dalybos iš nulio atveju
    if (/\/\s*0/.test(expression)) {
        document.getElementById('display').innerText = 'Dalyba iš nulio negalima';
        return;
    }

    try {
        let result = Function("return " + expression)();
        if (!isFinite(result)) {
            throw new Error('Rezultatas begalinis');
        }
        
        // Rezultato suapvalinimas iki nustatyto skaičiaus po kablelio
        result = Math.round((result + Number.EPSILON) * 10000) / 10000;

        // Grąžinti rezultatą atgal į eilutę su kableliais kaip dešimtainiais skirtukais
        const formattedResult = result.toString().replace(/\./g, ',');

        document.getElementById('display').innerText = originalExpression + ' = ';
        const resultSpan = document.createElement('span');
        resultSpan.style.cssText = "align-self: flex-end;";
        resultSpan.textContent = formattedResult;
        document.getElementById('display').appendChild(resultSpan);
    } catch (e) {
        document.getElementById('display').innerText = 'Sintaksės klaida: ' + e.message;
        console.error("Klaida vertinant išraišką:", e);
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
        return "Klaida: Faktorialas neapibrėžtas neigiamiems skaičiams arba ne sveikiems skaičiams";
    } else if (n > 170) {  
        return "Klaida: Įvestis per didelė";
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function simpleParser(expression) {

    let tokens = expression.split(' ');
    let stack = [];

    // Pagrindinis operacijų tvarkymas
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
        return "Klaida";
    }
}
