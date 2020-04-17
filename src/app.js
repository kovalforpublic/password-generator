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
class Password {
    constructor(password, length) {
        this.itself = password;
        this.typesMissed = ['lowCaseChars', 'upperCaseChars', 'numbers', 'specialSymbols'];
        this.allTypes = ['lowCaseChars', 'upperCaseChars', 'numbers', 'specialSymbols'];
    }
    get() {
        return this.itself;
    }
    increment(newSymbol) {
        this.itself += newSymbol;
    }
    update(newPwd) {
        this.itself = newPwd;
    }
    includeType(type) {
        this.typesMissed = this.typesMissed.filter(x => x !== type);
    }
    getRandomType(array) {
        return array[Math.floor(Math.random() * symbolTypes.length)]
    }


}

const lowCaseChars = new Symbols('abcdefghijklmnopqrstuvwxyz', /[a-z]/);
const upperCaseChars = new Symbols('ABCDEFGHIJKLMNOPQRSTUVWXYZ', /[A-Z]/);
const numbers = new Symbols('0123456789', /\d/);
const specialSymbols = new Symbols('!#$%&()*+,-./:;<=>?@[\]^_{|}~', /[!#$%&()\*\+,-.\/:;<=>?@\[\]\^_{|}~]/);

function generatePassword(length) {
    return new Promise(function(resolve) {
        let counter = length;
        const password = new Password('');
        if (length === 4) {
            password.increment(lowCaseChars.getRandom());
            password.increment(upperCaseChars.getRandom());
            password.increment(numbers.getRandom());
            password.increment(specialSymbols.getRandom());
            password.update(randomise(password.get()));
        } else {
            while (isDuplicate(password.get())) {
                password.update('');
                counter = length;

                while (counter) {
                    if (counter <= 3) {
                        currentType = password.getRandomType(password.typesMissed);
                        if (currentType === undefined) {
                            currentType = password.getRandomType(password.allTypes);
                        }
                    } else {
                        currentType = password.getRandomType(password.allTypes);
                    }

                    switch (currentType) {
                        case 'lowCaseChars':
                            password.increment(lowCaseChars.getRandom());
                            password.includeType('lowCaseChars');
                            break;
                        case 'upperCaseChars':
                            password.increment(upperCaseChars.getRandom());
                            password.includeType('upperCaseChars');
                            break;
                        case 'numbers':
                            password.increment(numbers.getRandom());
                            password.includeType('numbers');
                            break;
                        case 'specialSymbols':
                            password.increment(specialSymbols.getRandom());
                            password.includeType('specialSymbols');
                            break;
                    }
                    counter--;
                }
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
