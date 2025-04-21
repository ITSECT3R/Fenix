const textInput = document.querySelector('#text-input');
const checkBtn = document.querySelector('#check-btn');
const result = document.querySelector('#result');

const checkPalindrome = () => {
  if (textInput.value === '') return alert('Please input a value');

  const regex = /[^a-zA-Z0-9]/g;
  const textOriginal = textInput.value;
  const textProcessed = textInput.value.toLowerCase().replace(regex, '');
  const reversedText = textProcessed.split('').reverse().join('');
  
  if (textProcessed === reversedText) {
    result.textContent = `${textOriginal} is a palindrome.`;
  } else {
    result.textContent = `${textOriginal} is not a palindrome.`;
  }
};

checkBtn.addEventListener('click', checkPalindrome);
document.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    checkPalindrome();
  };
});
