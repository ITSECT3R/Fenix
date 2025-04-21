const input = document.querySelector('#user-input');
const results = document.querySelector('#results-div');
const checkBtn = document.querySelector('#check-btn');
const clearBtn = document.querySelector('#clear-btn');

const check = () => {
    const value = input.value;
    if (value === '') return alert('Please provide a phone number');
    const phoneRegex = /^(1\s?)?(\(\d{3}\)|\d{3})([\s\-]?)\d{3}([\s\-]?)\d{4}$/;
    if (phoneRegex.test(value)) {
        results.innerHTML += `<div class="good-result">Valid US number:${value}</div>`;
    } else {
        results.innerHTML += `<div class="bad-result">Invalid US number:${value}</div>`;
    }
    input.value = '';
};

const clear = () => {
    input.value = '';
    results.innerHTML = '';
}

clearBtn.addEventListener('click', clear);
checkBtn.addEventListener('click', check);
input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') check();
});