/* =============================================================================
            Helper Functions for generatePassword()
============================================================================= */


/* ============================
      getRandomLower()
============================ */


function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}


/* ============================
      getRandomUpper()
============================ */


function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}


/* ============================
      getRandomNumber()
============================ */

function getRandomNumber() {
  return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

/* ============================
      getRandomSymbol()
============================ */


function getRandomSymbol() {
  const symbols = '!@#$%^&*(){}[]=<>/,.'
  return symbols[Math.floor(Math.random() * symbols.length)];
}


/* ============================
      randomFunctions
============================ */


//The helper functions are put in an object.
//They are then accessed if in generatePassword when they filter through
//to the includedTypes array.
const randomFunctions = {
  lower:  getRandomLower,
  upper:  getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol
}


/* =============================================================================
                           generatePassword()
============================================================================= */


function generatePassword(lower, upper, number, symbol, characterNumber) {
  //This takes advantage of the fact that true evaluates/coerces to 1, and false to 0.
  const typesCount = lower + upper + number + symbol;


  //Or simply use if(typesCount === 0) { ... }
  if (!lower && !upper && !number && !symbol) {
    Toastify({
      text: "Please include at least one character specification.",
      duration: 3000,
      backgroundColor: "#FF355E",
      className: "toastify warning-toast",
      stopOnFocus: true,
      close: true
    }).showToast();
   return '';
  }


  let generatedPassword = '';

  //Before filter: [{lower: true|false}, {upper: true|false}, {number: true|false}, {symbol: true|false}]
  //After filtering, only those elements that have true values will remain.
  //Because two of the values are true, they pass the test.
  const includedTypes = [ {lower}, {upper}, {number}, {symbol}]
    .filter(item => Object.values(item)[0]);
  //1-4 types will be included:
  //includedTypes: [{lower: true}, {upper: true}, {number: true}, {symbol: true}]

  for (let i = 0; i < characterNumber; i += typesCount) {
    includedTypes.forEach(
      (type) => {
        //The pattern is not entirely random.
        //It's always lower, upper, number, symbol...
        //However the functions themselves randomize WHICH character
        //for each subset will be chosens
        const functionName = Object.keys(type)[0];
                             //Here is where we are calling the helper functions.
        generatedPassword += randomFunctions[functionName]();
      }
    );
  }

  //generatedPassword may overgenerate numbers, and therefore needs to be truncated.
  const finalPassword = generatedPassword.slice(0, characterNumber);


  Toastify({
    text: "Password generated!",
    duration: 3000,
    backgroundColor: "#66FF66",
    className: "toastify success-toast",
    stopOnFocus: true,
    close: true
  }).showToast();

  return finalPassword;
}


/* =============================================================================
                                clearResult()
============================================================================= */


function clearResult(){
  const result = document.getElementById('result');
  result.textContent = '';
}


/* =============================================================================
                              copyToClipboard()
============================================================================= */


function copyToClipboard(){
  const textarea = document.createElement('textarea');
  const result   = document.getElementById('result');
  const password = result.innerText;

  if (!password) {
    Toastify({
      text: "First generate a password. <em>Then</em> copy!",
      duration: 3000,
      backgroundColor: "#FF355E",
      className: "toastify warning-toast",
      stopOnFocus: true,
      close: true
    }).showToast();

    return;
  }

  textarea.value = password;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();

  clearResult();

  Toastify({
    text: "Password copied to clipboard!",
    duration: 3000,
    backgroundColor: "#66FF66",
    className: "toastify success-toast",
    stopOnFocus: true,
    close: true
  }).showToast();
}


/* =============================================================================
                             Event Listeners
============================================================================= */


const clipboardButton   = document.getElementById('clipboard');
const plusButton        = document.getElementById("plus-button");
const minusButton       = document.getElementById("minus-button");
const generateButton    = document.getElementById('generate-button');
const clearButton       = document.getElementById("clear-button");


clipboardButton.addEventListener('click', () => {
  copyToClipboard();
});


generateButton.addEventListener('click', (e) => {
  const result            = document.getElementById('result');
  const lengthInput       = document.getElementById('length-input');
  const uppercaseCheckbox = document.getElementById('uppercase-checkbox');
  const lowercaseCheckbox = document.getElementById('lowercase-checkbox');
  const numbersCheckbox   = document.getElementById('numbers-checkbox');
  const symbolsCheckbox   = document.getElementById('symbols-checkbox');

  //Values
  const length           = +lengthInput.value;        //Presumably this is a hack to coerce the value.
  const includeLowercase = lowercaseCheckbox.checked; //true | false  (type boolean)
  const includeUppercase = uppercaseCheckbox.checked; //true | false
  const includeNumbers   = numbersCheckbox.checked;   //true | false
  const includeSymbols   = symbolsCheckbox.checked;   //true | false

  result.innerText = generatePassword(includeLowercase, includeUppercase, includeNumbers, includeSymbols, length);
});


minusButton.addEventListener('click', function(){
  const numberInputContainer = this.closest('.number-input-container');
  const numberInput          = numberInputContainer.getElementsByTagName('INPUT')[0];
  let value                  = parseInt(numberInput.value, 10);

  if (value === 5) {
    Toastify({
      text: "Whoops! No going below 5...",
      duration: 3000,
      backgroundColor: "#FF355E",
      className: "toastify warning-toast",
      stopOnFocus: true,
      close: true
    }).showToast();

    return;
  }

  value -= 1;
  numberInput.value = value;
});


plusButton.addEventListener('click', function(){
  const numberInputContainer = this.closest('.number-input-container');
  const numberInput          = numberInputContainer.getElementsByTagName('INPUT')[0];
  let value                  = parseInt(numberInput.value, 10);

  if (value === 20) {
    Toastify({
      text: "Whoops! No going above 20...",
      duration: 3000,
      backgroundColor: "#FF355E",
      className: "toastify warning-toast",
      stopOnFocus: true,
      close: true
    }).showToast();

    return;
  }

  value += 1;
  numberInput.value = value;
});


clearButton.addEventListener('click', clearResult);
