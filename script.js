document.addEventListener('DOMContentLoaded', function() 
{
    // Select all buttons
    const NumberButtons = document.querySelectorAll('.number-button');
    const answerBox = document.querySelector('.answer-box');

    // Function to handle button click
    NumberButtons.forEach(button => 
    {
        button.addEventListener('click', function() 
        {
            answerBox.textContent += this.value; // Append the value of the button to the answer box
        });
    });


});

