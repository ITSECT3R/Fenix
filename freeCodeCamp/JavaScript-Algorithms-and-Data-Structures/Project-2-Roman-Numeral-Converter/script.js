const numberInput = document.getElementById('number');
const convertBtn = document.getElementById('convert-btn');
const output = document.getElementById('output');

function convertToRoman(num) {
    const romanNumerals = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
    ];

    let result = '';
    for (const { value, numeral } of romanNumerals) {
        while (num >= value) {
            result += numeral;
            num -= value;
        }
    };
    return result;
};

const convertListener = () => {
    const number = parseInt(numberInput.value);

    if (number <= 0) {
        output.textContent = "Please enter a number greater than or equal to 1"
    } else if (number > 3999) {
        output.textContent = "Please enter a number less than or equal to 3999"
    } else if (!number) {
        output.textContent = "Please enter a valid number"
    } else {
        output.textContent = convertToRoman(number);
    };
};

convertBtn.addEventListener('click', convertListener);
numberInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        convertListener();
    }
});