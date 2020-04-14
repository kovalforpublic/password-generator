const className = '.length';
const history = [];
const lengthLabel = document.querySelector(className + ' > label');
const lengthInput = document.querySelector(className + ' > input');
const generateButton = document.querySelector(className + ' > button');

const copyInput = document.querySelector('.password > input');
const copyButton = document.querySelector('.password > button');

const symbolTypes = ['lowCaseChars', 'upperCaseChars', 'numbers', 'specialSymbols'];
const lowCaseChars = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const specialSymbols = '!#$%&()*+,-./:;<=>?@[\]^_{|}~';

const regexes = {
    lowCaseChars: /[a-z]/,
    upperCaseChars: /[A-Z]/,
    numbers: /\d/,
    symbols: /[!#$%&()\*\+,-.\/:;<=>?@\[\]\^_{|}~]/,
    // symbols: /[!@#$%^&*)(+=._-]/, // alternative just in case
};

function generatePassword(length) {
    return new Promise(function(resolve) {
        let counter = length;
        let password = '';

        if (length === 4) {
            password += getLowCaseChar();
            password += getUpperCaseChar();
            password += getNumber();
            password += getSpecialSymbol();
            password = randomise(password);
        } else {
            while (isDuplicate(password)) {
                password = '';
                counter = length;
                while (counter) {

                    if (counter <= 3) {
                        currentType = whichTypeMissed(password);
                    } else {
                        currentType = getRandomType();
                    }

                    switch (currentType) {
                        case 'lowCaseChars':
                        password += getLowCaseChar();
                        break;
                        case 'upperCaseChars':
                        password += getUpperCaseChar();
                        break;
                        case 'numbers':
                        password += getNumber();
                        break;
                        case 'specialSymbols':
                        password += getSpecialSymbol();
                        break;
                    }
                    counter--;
                }
            }
        }
        resolve(password);
    })
}

function getRandomType() {
    return symbolTypes[Math.floor(Math.random() * symbolTypes.length)];
}
function whichTypeMissed(password) {
    const isLow = regexes.lowCaseChars.test(password);
    const isUp = regexes.upperCaseChars.test(password);
    const isNum = regexes.numbers.test(password);
    const isSpecial = regexes.symbols.test(password);

    if (!isLow) {
        return 'lowCaseChars';
    } else if (!isUp) {
        return 'upperCaseChars';
    } else if (!isNum) {
        return 'numbers';
    } else if (!isSpecial) {
        return 'specialSymbols';
    } else {
        return getRandomType();
    }
}
function isDuplicate(password) {
    if (password === '') {
        return true;
    } else {
        return history.includes(password);
    }
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

function updatePwd(pwd) {
    copyInput.value = pwd;
}

// event bindings
copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(copyInput.value);
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
