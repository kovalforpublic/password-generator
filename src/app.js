const className = '.length';
const history = [''];
const lengthLabel = document.querySelector(className + ' > label');
const lengthInput = document.querySelector(className + ' > input');
const generateButton = document.querySelector(className + ' > button');

const copyInput = document.querySelector('.password > input');
const copyButton = document.querySelector('.password > button');

const symbolTypes = ['lowCaseChars', 'upperCaseChars', 'numbers', 'specialSymbols'];

class Symbols {
    constructor(symbols, regex) {
        this.regex = regex;
        this.symbols = symbols;
    }
    getRegex() {
        return this.regex;
    }
    get() {
        return this.symbols;
    }
    getRandom() {
        return this.symbols.charAt(this.getRandomIndex());
    }
    getRandomIndex() {
        return Math.floor(Math.random() * this.symbols.length);
    }
}

const lowCaseChars = new Symbols('abcdefghijklmnopqrstuvwxyz', /[a-z]/);
const upperCaseChars = new Symbols('ABCDEFGHIJKLMNOPQRSTUVWXYZ', /[A-Z]/);
const numbers = new Symbols('0123456789', /\d/);
const specialSymbols = new Symbols('!#$%&()*+,-./:;<=>?@[\]^_{|}~', /[!#$%&()\*\+,-.\/:;<=>?@\[\]\^_{|}~]/);

function generatePassword(length) {
    return new Promise(function(resolve) {
        let counter = length;
        let password = '';

        if (length === 4) {
            password += lowCaseChars.getRandom();
            password += upperCaseChars.getRandom();
            password += numbers.getRandom();
            password += specialSymbols.getRandom();
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
                        password += lowCaseChars.getRandom();
                        break;
                        case 'upperCaseChars':
                        password += upperCaseChars.getRandom();
                        break;
                        case 'numbers':
                        password += numbers.getRandom();
                        break;
                        case 'specialSymbols':
                        password += specialSymbols.getRandom();
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
    const isLow = lowCaseChars.getRegex().test(password);
    const isUp = upperCaseChars.getRegex().test(password);
    const isNum = numbers.getRegex().test(password);
    const isSpecial = specialSymbols.getRegex().test(password);

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
        return history.includes(password);
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
