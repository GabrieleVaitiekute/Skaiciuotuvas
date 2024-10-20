// Add these variables globally to manage the cursor position and input states
let cursorPosition = 0;
let baseInputActive = false;

document.addEventListener('DOMContentLoaded', function() {
    const answerBox = document.getElementById('display');

    // Extended display function to handle formatting
    window.display = function(value) {
        let currentValue = answerBox.innerHTML;
        let before = currentValue.slice(0, cursorPosition);
        let after = currentValue.slice(cursorPosition);
        answerBox.innerHTML = before + value + after;
        cursorPosition += value.length;  // Update cursor position after adding value
        updateCursor();
    };

    // Handling special functions
    window.handlePower = function(power) {
        display('<sup>' + power + '</sup>');
    };

    window.startRoot = function(n) {
        display('<sup>' + n + '</sup>√<span id="root-base"></span>');
        baseInputActive = true;
    };

    window.startLog = function() {
        display('log<sub></sub>');
        baseInputActive = true;
    };

    // Adjust cursor movement
    window.moveCursor = function(direction) {
        if (direction === 'left' && cursorPosition > 0) {
            cursorPosition--;
        } else if (direction === 'right' && cursorPosition < answerBox.textContent.length) {
            cursorPosition++;
        }
        updateCursor();
    };

    // Function to update cursor visually
    function updateCursor() {
        window.getSelection().collapse(answerBox.firstChild, cursorPosition);
    }

    // Clears the display
    window.clearDisplay = function() {
        answerBox.innerHTML = '';
        cursorPosition = 0;
    };

    // Handles backspace operation
    window.backspace = function() {
        let currentValue = answerBox.innerHTML;
        if (cursorPosition > 0) {
            let before = currentValue.slice(0, cursorPosition - 1);
            let after = currentValue.slice(cursorPosition);
            answerBox.innerHTML = before + after;
            cursorPosition--;
            updateCursor();
        }
    };
});
