const className = '.length';
const history = [''];
const lengthLabel = document.querySelector(className + ' > label');
const lengthInput = document.querySelector(className + ' > input');
const generateButton = document.querySelector(className + ' > button');

const copyInput = document.querySelector('.password > input');
const copyButton = document.querySelector('.password > button');

class Symbols {
    constructor(symbols, regex) {
        this.symbols = symbols;
        this.regex = regex;
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
class Password {
    constructor(password) {
        this.itself = password;
        this.typesMissed = ['lowCaseChars', 'upperCaseChars', 'numbers', 'specialSymbols'];
        this.allTypes = ['lowCaseChars', 'upperCaseChars', 'numbers', 'specialSymbols'];
        
        const lowCaseChars = new Symbols('abcdefghijklmnopqrstuvwxyz', /[a-z]/);
        const upperCaseChars = new Symbols('ABCDEFGHIJKLMNOPQRSTUVWXYZ', /[A-Z]/);
        const numbers = new Symbols('0123456789', /\d/);
        const specialSymbols = new Symbols('!#$%&()*+,-./:;<=>?@[\]^_{|}~', /[!#$%&()\*\+,-.\/:;<=>?@\[\]\^_{|}~]/);
        
        this.types = new Map();
        
        this.types.set('lowCaseChars', lowCaseChars);
        this.types.set('upperCaseChars', upperCaseChars);
        this.types.set('numbers', numbers);
        this.types.set('specialSymbols', specialSymbols);
    }
    get() {
        return this.itself;
    }
    increment(type) {
        const currentSymbols = this.types.get(type);
        this.itself += currentSymbols.getRandom();
    }
    update(newPwd) {
        this.itself = newPwd;
    }
    includeType(type) {
        this.typesMissed = this.typesMissed.filter(x => x !== type);
    }
    getRandomType(array) {
        return array[Math.floor(Math.random() * this.typesMissed.length)]
    }
    getCurrentType(counter) {
        let currentType;
        if (counter <= 4 && this.typesMissed.length !== 0) {
            currentType = this.getRandomType(this.typesMissed);
        } else {
            currentType = this.getRandomType(this.allTypes);
        }
        return currentType;
    }
}

function generatePassword(length) {
    return new Promise(function(resolve) {
        let counter = length;
        const password = new Password('');
        while (isDuplicate(password.get())) {
            password.update('');
            counter = length;

            while (counter) {
                const currentType = password.getCurrentType(counter);
                password.increment(currentType);
                password.includeType(currentType);
                counter--;
            }
        }
        resolve(password.get());
    })
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
