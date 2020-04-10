// const formHandler = new FormHandler('.length');

const className = '.length';
const history = [];
const lengthLabel = document.querySelector(className + ' > label');
const lengthInput = document.querySelector(className + ' > input');
const generateButton = document.querySelector(className + ' > button');

const copyInput = document.querySelector('.password > input');
const copyButton = document.querySelector('.password > button');

const lowCaseChars = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const specialSymbols = '!#$%&()*+,-./:;<=>?@[\]^_{|}~';

function generatePassword(length) {
    return new Promise(function(resolve) {
        let password = '';
        let currentType = 'lowCaseChars';
        while (length) {
            switch (currentType) {
                case 'lowCaseChars':
                    password += getLowCaseChar();
                    currentType = 'upperCaseChars';
                    break;
                case 'upperCaseChars':
                    password += getUpperCaseChar();
                    currentType = 'numbers';
                    break;
                case 'numbers':
                    password += getNumber();
                    currentType = 'specialSymbols';
                    break;
                case 'specialSymbols':
                    password += getSpecialSymbol();
                    currentType = 'lowCaseChars';
                    break;
            }
            length--;
        }
        resolve(randomise(password));
    })
}

function updatePwd(pwd) {
    copyInput.value = pwd;
}

function randomise(string) {
    const arr = string.split('');
    let x;
    for (let i = arr.length - 1; i > 0; i--) {
        x = Math.floor(Math.random() * (i + 1));
        // destructuring, [a, b] = [b, a]
        [arr[x], arr[i]] = [arr[i], arr[x]]
    }
    return arr.join('');
}

function getLowCaseChar() {
    return lowCaseChars.charAt(getRandomIndex(lowCaseChars));
}
function getUpperCaseChar() {
    return upperCaseChars.charAt(getRandomIndex(upperCaseChars));
}
function getNumber() {
    return numbers.charAt(getRandomIndex(numbers));
}
function getSpecialSymbol() {
    return specialSymbols.charAt(getRandomIndex(specialSymbols));
}
function getRandomIndex(characters) {
    return Math.floor(Math.random() * characters.length);
}
// event bindings
(function() {
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(input.value);
    })
    lengthInput.addEventListener('input', (e) => {
        lengthLabel.innerHTML = e.target.value;
    });
    generateButton.addEventListener('click', async () => {
        const length = Number(lengthLabel.innerHTML);
        const password = await generatePassword(length);
        history.push(password);
        updatePwd(password);
    })
})();
