function FormHandler(className) {
    const history = [];
    const label = document.querySelector(className + ' > label');
    const input = document.querySelector(className + ' > input');
    const button = document.querySelector(className + ' > button');

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
    const copyHandler = new CopyHandler('.password');

    // event bindings
    (function() {
        copyHandler.bindCopyBtn();
        input.addEventListener('input', (e) => {
            label.innerHTML = e.target.value;
        });
        button.addEventListener('click', async () => {
            const length = Number(label.innerHTML);
            const password = await executeUntilCorrect(generatePassword, length);
            history.push(password);
            copyHandler.updatePwd(password);
        })
    })();
    async function executeUntilCorrect(fn, param) {
        let password = await fn(param);
        while (!isPwdCorrect(password)) {
            password = await fn(param);
        }
        return password;
    }
    function generatePassword(length) {
        return new Promise(function(resolve) {
            let password = '';
            while (length) {
                const currentType = whichTypeDice();
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
                length--;
            }
            resolve(password);
        })
    }
    function whichTypeDice() {
        return symbolTypes[Math.floor(Math.random() * symbolTypes.length)];
    }
    function isPwdCorrect(password) {
        const isLow = regexes.lowCaseChars.test(password);
        const isUp = regexes.upperCaseChars.test(password);
        const isNum = regexes.numbers.test(password);
        const isSpecial = regexes.symbols.test(password);
        const isDuplicate = history.includes(password);

        if (isLow && isUp && isNum && isSpecial && !isDuplicate) {
            return true;
        } else {
            return false;
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
}

function CopyHandler(className) {
    const input = document.querySelector(className + ' > input');
    const button = document.querySelector(className + ' > button');

    this.updatePwd = function(pwd) {
        input.value = pwd;
    }
    this.bindCopyBtn = function() {
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(input.value);
        })
    }
}
